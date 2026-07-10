"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { 
  Sparkles, Send, ArrowRight, MessageSquare, Database, 
  Share2, FileText, Cpu, Check, TerminalSquare, AlertCircle,
  HelpCircle, Settings, Trash2, ArrowUpRight, ShieldCheck,
  BrainCircuit, ExternalLink
} from "lucide-react"

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  confidence?: number;
  sources?: { type: "code" | "slack" | "doc"; name: string; link: string }[];
}

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "ai",
    text: "Hello Manan! I have parsed 24 new PRs, 3 Slack threads, and the recent architecture meeting. What would you like to know about your engineering knowledge base today?",
    timestamp: "10:30 AM"
  }
];

const suggestions = [
  { text: "Explain the new authentication flow.", label: "Auth Flow" },
  { text: "Why was Redis caching introduced?", label: "Redis Caching" },
  { text: "Who knows vector operations best?", label: "Expertise Map" },
  { text: "Summarize yesterday's architecture meeting.", label: "Meeting Summary" }
];

const mockResponses: Record<string, { text: string; confidence: number; sources: Message["sources"] }> = {
  "explain the new authentication flow.": {
    text: "The new authentication flow leverages JWT tokens signed by the backend server via Passport.js, storing the token inside localStorage as `recalliq_jwt`. Upon initial onboarding or page reload, the client checks the query string for `?token=...`, saves it, and scrubs the URL. All requests from `src/lib/api.ts` are automatically decorated with an `Authorization: Bearer <token>` header. Let me know if you want to inspect `src/context/AuthContext.tsx` code.",
    confidence: 98,
    sources: [
      { type: "code", name: "src/context/AuthContext.tsx:L12-45", link: "#" },
      { type: "code", name: "src/lib/api.ts:L70-85", link: "#" },
      { type: "slack", name: "Slack: #auth-refactor thread", link: "#" }
    ]
  },
  "why was redis caching introduced?": {
    text: "Redis caching was introduced to optimize token metadata lookups and prevent DB overload. The backend coordinates cache calls in the repository model pipelines. This change reduced server latency averages from 180ms to 124ms, particularly for repeat requests on dashboard statistics.",
    confidence: 96,
    sources: [
      { type: "code", name: "server/src/models/Commit.model.ts", link: "#" },
      { type: "doc", name: "ADR #14: Caching Layer Specification", link: "#" }
    ]
  },
  "who knows vector operations best?": {
    text: "Based on contribution volumes in `vector-ops-engine` (which handles cosine distance operations and AVX-512 intrinsic optimizations), Sarah has authored 65% of changes, followed by Manan with 28%. I recommend reaching out to Sarah for core mathematical questions, or Manan for integration details.",
    confidence: 94,
    sources: [
      { type: "code", name: "vector-ops-engine/src/lib.rs", link: "#" },
      { type: "slack", name: "Slack: #vector-math discussion", link: "#" }
    ]
  },
  "summarize yesterday's architecture meeting.": {
    text: "Yesterday's meeting aligned on deprecating `legacy-data-ingest` in favor of TypeScript integrations. Key milestones include: \n1. Deprecate Go modules in the CLI where overlapping schemas occur.\n2. Add cache optimization stages in the CI/CD runners to drop build latency by 2 minutes.\n3. Appoint Aman as backup reviewer to unblock Sarah's queue bottlenecks.",
    confidence: 92,
    sources: [
      { type: "doc", name: "Meeting Notes: Sprint 4 Alignment", link: "#" },
      { type: "slack", name: "Slack: #planning thread", link: "#" }
    ]
  }
};

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking and reply
    setTimeout(() => {
      const lowerText = text.trim().toLowerCase()
      const match = mockResponses[lowerText] || {
        text: "I've scanned the codebase regarding your query. I don't see any explicit implementations, but based on dependencies like Radix and Tailwind, we can construct custom UI configurations to solve this. What specific module would you like to target?",
        confidence: 85,
        sources: [{ type: "doc", name: "RecallIQ General Documentation", link: "#" }]
      }

      const aiMsg: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: match.text,
        confidence: match.confidence,
        sources: match.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)
    }, 1500)
  }

  const handleClearHistory = () => {
    setMessages([
      {
        id: 1,
        sender: "ai",
        text: "History cleared. I am ready to answer any questions about RecallIQ codebase. Try selecting a template below.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] animate-in fade-in duration-500 overflow-hidden">
      
      {/* LEFT COLUMN: Sources Panel (3 Columns) */}
      <Card className="lg:col-span-3 border border-white/5 bg-surface/30 flex flex-col h-full overflow-y-auto hide-scrollbar">
        <div className="p-4 border-b border-white/5 flex items-center gap-2">
          <Database className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">AI Context Sources</h3>
        </div>
        
        <div className="p-4 flex-1 space-y-5 text-xs">
          
          <div className="space-y-2">
            <span className="text-[10px] text-white/30 uppercase font-semibold block">Connected Repositories (4)</span>
            <div className="space-y-1.5">
              {["recall-iq-app", "ai-sync-service", "vector-ops-engine", "recall-cli-tool"].map(repo => (
                <div key={repo} className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/5 font-mono text-[10px] text-white/70">
                  <span>{repo}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-white/30 uppercase font-semibold block">Parsed Meeting Audits</span>
            <div className="space-y-1.5">
              {["Architecture Align v2", "Daily Standup Jul 9", "Backend Cache Specs"].map(meet => (
                <div key={meet} className="flex items-center gap-2 p-2 rounded bg-white/[0.02] border border-white/5 text-[11px] text-white/60">
                  <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{meet}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-white/30 uppercase font-semibold block">Slack Log Indexes</span>
            <div className="space-y-1.5">
              {["#auth-refactor", "#vector-math", "#deployments"].map(channel => (
                <div key={channel} className="flex items-center gap-2 p-2 rounded bg-white/[0.02] border border-white/5 text-[11px] text-white/60">
                  <Share2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="truncate">{channel}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-primary/20 bg-primary/5 text-[11px] leading-relaxed text-white/70 mt-4">
            <Cpu className="w-4 h-4 text-primary mb-1.5" />
            <b>Note:</b> RecallIQ context matches code references with live Slack/Meeting transcript logs using semantic linkages.
          </div>
        </div>
      </Card>

      {/* RIGHT COLUMN: Interactive Chat Feed (9 Columns) */}
      <Card className="lg:col-span-9 border border-white/5 bg-surface/30 flex flex-col h-full overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        {/* Chat Feed Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between z-10 relative bg-[#09090b]/40 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-sm font-semibold text-white">Interactive Copilot Feed</h3>
              <span className="text-[10px] text-foreground/40">Current Model: cascadeflow-v2</span>
            </div>
          </div>
          
          <button 
            onClick={handleClearHistory}
            className="p-1.5 rounded border border-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Messaging Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar z-10 relative">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center gap-2 text-[10px] text-white/30 mb-1.5">
                <span>{msg.sender === "user" ? "You" : "RecallIQ AI"}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>
              
              <div className={`p-4 rounded-2xl max-w-xl text-sm leading-relaxed border ${
                msg.sender === "user" 
                  ? "bg-primary border-primary/50 text-white rounded-tr-sm" 
                  : "bg-[#0c0c0e] border-white/5 text-foreground/90 rounded-tl-sm shadow-xl"
              }`}>
                {msg.text.split("\n").map((line, idx) => (
                  <p key={idx} className={idx > 0 ? "mt-2" : ""}>{line}</p>
                ))}
                
                {/* Confidence indicator & sources citation on AI messages */}
                {msg.sender === "ai" && msg.confidence && (
                  <div className="mt-4 pt-3.5 border-t border-white/5 space-y-3">
                    <div className="flex justify-between items-center text-[10px] text-white/40">
                      <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-400" /> Confidence Match</span>
                      <span className="font-semibold text-primary">{msg.confidence}%</span>
                    </div>
                    
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[9px] text-white/30 uppercase font-semibold block">Sources consulted</span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.map((src, i) => (
                            <span 
                              key={i} 
                              className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60 hover:text-primary hover:border-primary/50 cursor-pointer flex items-center gap-1 transition-colors"
                            >
                              {src.name}
                              <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex flex-col items-start">
              <span className="text-[10px] text-white/30 mb-1.5">RecallIQ AI is analyzing...</span>
              <div className="p-4 rounded-2xl bg-[#0c0c0e] border border-white/5 text-sm text-foreground/50 rounded-tl-sm flex items-center gap-1.5 shadow-xl">
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Suggestions Quick Buttons */}
        {messages.length === 1 && !isTyping && (
          <div className="p-4 border-t border-white/5 bg-[#09090b]/20 z-10 relative">
            <span className="text-[10px] text-white/30 uppercase font-semibold block mb-2.5">Suggested Queries</span>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <button
                  key={item.text}
                  onClick={() => handleSendMessage(item.text)}
                  className="px-3.5 py-2 rounded-lg border border-white/5 bg-[#0c0c0e]/80 hover:bg-white/5 hover:border-white/10 text-xs text-white/70 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 group"
                >
                  {item.label}
                  <ArrowRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-white/5 bg-[#09090b]/40 z-10 relative">
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage(inputValue)
            }}
            className="relative"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask RecallIQ AI about code, meetings, or Slack logs..."
              className="w-full bg-surface border border-white/15 hover:border-white/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl pl-4 pr-12 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-all"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary rounded-lg text-white hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </Card>
      
      {/* Global CSS overrides for custom scrollbar inside the component */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.15);
        }
      `}} />

    </div>
  )
}
