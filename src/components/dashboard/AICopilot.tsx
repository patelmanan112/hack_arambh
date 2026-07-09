"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Sparkles, ArrowRight } from "lucide-react"

const suggestions = [
  "Why was Redis introduced?",
  "Explain the new authentication flow.",
  "Summarize yesterday's architecture meeting.",
  "Who knows Kubernetes best?",
]

export function AICopilot() {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          AI Copilot
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col justify-end gap-4 mb-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 text-sm text-foreground/90 backdrop-blur-md">
            I've analyzed 24 new PRs, 3 Slack threads, and the recent architecture meeting. What would you like to know?
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {suggestions.map((q) => (
            <button
              key={q}
              className="w-full text-left px-4 py-2.5 rounded-lg border border-white/5 bg-surface/50 hover:bg-white/10 hover:border-white/20 transition-all text-xs text-foreground/80 flex items-center justify-between group"
            >
              {q}
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
            </button>
          ))}
        </div>

        <div className="relative mt-auto">
          <input
            type="text"
            placeholder="Ask anything about your engineering..."
            className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-foreground/30"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary rounded-lg text-white hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
