"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { GitMerge, Database, Server, MessageSquare, FileText, Zap } from "lucide-react"

const timeline = [
  { title: "Redis Added", type: "architecture", icon: Database, color: "text-red-400", time: "2h ago" },
  { title: "Authentication Changed", type: "decision", icon: Zap, color: "text-yellow-400", time: "5h ago" },
  { title: "Slack Discussion: Auth", type: "discussion", icon: MessageSquare, color: "text-purple-400", time: "6h ago" },
  { title: "PR Merged: OAuth2", type: "code", icon: GitMerge, color: "text-blue-400", time: "1d ago" },
  { title: "Docker Introduced", type: "infrastructure", icon: Server, color: "text-cyan-400", time: "2d ago" },
  { title: "Notion ADR: Containerization", type: "doc", icon: FileText, color: "text-white", time: "2d ago" },
]

export function Timeline() {
  return (
    <Card className="col-span-1 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600">
      <CardHeader>
        <CardTitle>Engineering Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative border-l border-white/10 ml-3 space-y-6 pb-4">
          {timeline.map((event, i) => (
            <div key={i} className="relative pl-6 group">
              <span className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-surface border border-white/20 flex items-center justify-center group-hover:border-primary transition-colors">
                <event.icon className={`h-3 w-3 ${event.color}`} />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {event.title}
                </span>
                <span className="text-xs text-foreground/40 mt-1">{event.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
