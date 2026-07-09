"use client"

import { Button } from "@/components/ui/Button"
import { MessageSquare, UploadCloud, Github, Slack } from "lucide-react"

export function WelcomeSection() {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end justify-between w-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <p className="text-primary/80 font-medium tracking-wide uppercase text-sm">RecallIQ Workspace</p>
        <h1 className="text-4xl font-bold tracking-tight text-white text-glow">
          Good Morning, Manan
        </h1>
        <div className="flex items-center gap-4 text-sm text-foreground/60 mt-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Last AI Sync: 2m ago
          </span>
          <span>•</span>
          <span>Knowledge Freshness: 98%</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button className="bg-primary hover:bg-primary-hover text-white border-none shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all hover:shadow-[0_0_25px_rgba(124,58,237,0.6)]">
          <MessageSquare className="w-4 h-4 mr-2" />
          Ask AI
        </Button>
        <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md">
          <UploadCloud className="w-4 h-4 mr-2" />
          Upload Meeting
        </Button>
        <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md">
          <Github className="w-4 h-4 mr-2" />
          Sync GitHub
        </Button>
      </div>
    </div>
  )
}
