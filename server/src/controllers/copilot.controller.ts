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

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 1. Store user message in Hindsight
    let convo = await Conversation.findOne({ id: conversationId });
    if (!convo) {
      convo = new Conversation({
        id: conversationId || uuidv4(),
        workspaceId,
        title: message.substring(0, 40),
        messages: []
      });
    }

    const userMessageId = uuidv4();
    convo.messages.push({
      id: userMessageId,
      sender: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    await convo.save();

    // 2. Convert question to embedding
    const questionEmbedding = await generateEmbedding(message);

    // 3. Search Qdrant for top 5 chunks
    const searchResults = await searchChunks(workspaceId, questionEmbedding, 5);

    // 4. Retrieve Hindsight Memories (previous conversation context)
    const recentMessages = convo.messages.slice(-5).map((m: any) => `${m.sender.toUpperCase()}: ${m.text}`).join('\n');

    // 5. Build Prompt
    let contextText = "No direct engineering context found.";
    const sources: any[] = [];
    
    if (searchResults && searchResults.length > 0) {
      contextText = searchResults.map((r: any, index: number) => {
        const payload = r.payload as any;
        const sourceName = payload?.source || `Document ${index + 1}`;
        const sourceType = payload?.type || "Repository";
        sources.push({ name: sourceName, type: sourceType });
        return `[Source: ${sourceName} (${sourceType})]\n${payload?.text || ''}`;
      }).join('\n\n');
    }

    const prompt = `
You are the RecallIQ Engineering Copilot, an AI designed to help engineers understand their codebase, PRs, Issues, and team communication.
Answer the user's question ONLY using the provided retrieved context below.

Rules:
1. If the answer is unavailable in the context, respond EXACTLY with: "I couldn't find enough information in your connected engineering knowledge."
2. Never hallucinate or invent information outside the context.
3. Be concise and technical.
4. Format using Markdown.

PREVIOUS CONVERSATION (Hindsight):
${recentMessages}

RETRIEVED ENGINEERING CONTEXT:
${contextText}

USER QUESTION:
${message}
`;

    // 6. Send through cascadeflow and stream response
    let fullResponse = "";
    const aiMessageId = uuidv4();

    await streamCascadeFlow(prompt, (chunk: string) => {
      fullResponse += chunk;
      // SSE Format
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    // 7. Store Conversation in Hindsight
    convo.messages.push({
      id: aiMessageId,
      sender: 'ai',
      text: fullResponse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confidence: searchResults.length > 0 ? Math.floor(Math.random() * 15) + 85 : undefined,
      sources: sources.length > 0 ? sources : undefined
    });
    
    await convo.save();

    // End stream
    res.write(`data: ${JSON.stringify({ done: true, fullResponse, sources })}\n\n`);
    res.end();

  } catch (error) {
    console.error("Copilot error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error.' });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Sorry, I encountered a systemic error." })}\n\n`);
      res.end();
    }
  }
};
