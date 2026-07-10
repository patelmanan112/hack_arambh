import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Conversation } from '../models/Conversation.model.js';
import { searchChunks } from '../services/qdrant.service.js';
import { generateEmbedding, streamCascadeFlow } from '../services/gemini.service.js';

export const askCopilot = async (req: Request, res: Response) => {
  try {
    const { message, workspaceId, conversationId } = req.body;

    if (!message || !workspaceId) {
      res.status(400).json({ error: 'Message and workspaceId are required.' });
      return;
    }

    // Set SSE headers before anything else
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // ── 1. Hindsight: Load or create conversation ──
    let convo = conversationId
      ? await Conversation.findOne({ _id: conversationId, workspaceId })
      : null;

    if (!convo) {
      convo = new Conversation({
        workspaceId,
        title: message.substring(0, 50),
        messages: [],
      });
    }

    // Save user message
    const userMessageId = uuidv4();
    convo.messages.push({
      id: userMessageId,
      sender: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    await convo.save();

    // ── 2. Embed user question ──
    const questionEmbedding = await generateEmbedding(message);

    // ── 3. Search Qdrant for top 5 relevant chunks ──
    const searchResults = await searchChunks(workspaceId, questionEmbedding, 5);

    // ── 4. Retrieve Hindsight context (last 6 messages) ──
    const hindsightMessages = convo.messages
      .slice(-6)
      .map((m: any) => `${m.sender === 'user' ? 'ENGINEER' : 'COPILOT'}: ${m.text}`)
      .join('\n');

    // ── 5. Build sources and context ──
    let contextText = '';
    const sources: { name: string; type: string; url?: string }[] = [];

    if (searchResults.length > 0) {
      contextText = searchResults
        .map((r: any, i: number) => {
          const p = r.payload as any;
          const sourceName = p?.source || `Document ${i + 1}`;
          const sourceType = p?.sourceType || 'Repository';
          sources.push({ name: sourceName, type: sourceType, url: p?.url });
          return `[Source ${i + 1}: ${sourceName} (${sourceType})]\n${p?.text || ''}`;
        })
        .join('\n\n---\n\n');
    } else {
      contextText = 'No relevant context found in the knowledge base for this question.';
    }

    // ── 6. Build cascadeflow prompt ──
    const systemInstruction = `You are the RecallIQ Engineering Copilot — an expert AI assistant that helps engineers understand their codebase, architecture decisions, pull requests, issues, commits, and team knowledge.

STRICT RULES:
1. Answer ONLY using the retrieved context provided below.
2. If the answer cannot be found in the context, respond EXACTLY: "I couldn't find enough information in your connected engineering knowledge."
3. NEVER hallucinate, guess, or use knowledge outside the provided context.
4. Format answers in clean Markdown with code blocks where relevant.
5. Be precise and technical. Reference specific source names.`;

    const prompt = `━━━━━━━━━━━━━━━━━━━━━━━━
HINDSIGHT (Conversation Memory):
━━━━━━━━━━━━━━━━━━━━━━━━
${hindsightMessages || 'No previous conversation.'}

━━━━━━━━━━━━━━━━━━━━━━━━
RETRIEVED ENGINEERING CONTEXT (${searchResults.length} chunks):
━━━━━━━━━━━━━━━━━━━━━━━━
${contextText}

━━━━━━━━━━━━━━━━━━━━━━━━
ENGINEER'S QUESTION:
━━━━━━━━━━━━━━━━━━━━━━━━
${message}`;

    // ── 7. Stream via cascadeflow ──
    let fullResponse = '';
    const aiMessageId = uuidv4();
    let model = 'gemini-2.0-flash-exp';
    let latency = 0;

    // If no search results, provide a clear fallback response
    if (searchResults.length === 0) {
      fullResponse = "I couldn't find enough information in your connected engineering knowledge to answer this question. Please make sure your repositories are synced and have relevant data.";
      res.write(`data: ${JSON.stringify({ chunk: fullResponse })}\n\n`);
      res.write(`data: ${JSON.stringify({ fullResponse })}\n\n`);
    } else {
      const result = await streamCascadeFlow(prompt, systemInstruction, (chunk: string) => {
        fullResponse += chunk;
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      });
      model = result.model;
      latency = result.latency;
    }

    // ── 8. Store AI response in Hindsight ──
    convo.messages.push({
      id: aiMessageId,
      sender: 'ai',
      text: fullResponse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confidence: searchResults.length > 0 ? Math.round(85 + searchResults[0].score * 10) : undefined,
      sources: sources.length > 0 ? sources : undefined,
    });
    await convo.save();

    // ── 9. Send done event with metadata ──
    const calculatedConfidence = searchResults.length > 0 ? Math.round(85 + searchResults[0].score * 10) : 0;
    res.write(`data: ${JSON.stringify({
      done: true,
      fullResponse,
      sources,
      conversationId: convo._id.toString(),
      confidence: calculatedConfidence,
      runtime: {
        model,
        latencyMs: latency,
        chunksSearched: searchResults.length,
        provider: 'Google Gemini',
      },
    })}\n\n`);

    res.end();
  } catch (error: any) {
    console.error('[Copilot] Error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error.' });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'A server error occurred. Please try again.' })}\n\n`);
      res.end();
    }
  }
};

/** GET /api/copilot/history?workspaceId=... */
export const getConversationHistory = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.query;
    if (!workspaceId) {
      res.status(400).json({ error: 'workspaceId is required.' });
      return;
    }

    const conversations = await Conversation.find({ workspaceId: workspaceId as string })
      .select('_id title createdAt messages')
      .sort({ updatedAt: -1 })
      .limit(20)
      .lean();

    res.json({ success: true, data: conversations });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
};
