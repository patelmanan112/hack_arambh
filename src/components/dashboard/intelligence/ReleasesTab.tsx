"use client"

import React from "react"
import { ExtendedRepo } from "@/lib/mockData"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Zap, Sparkles, Calendar, Tag, ChevronDown, Download } from "lucide-react"

interface TabProps {
  repo: ExtendedRepo
}

const mockReleases = [
  {
    tag: "v1.2.0",
    title: "v1.2.0 Engineering Intelligence Core Release",
    date: "2d ago",
    author: "Sarah",
    downloads: "2.4k",
    aiSummary: "Shipped the core AI integration module (cascadeflow-v2) for vector indexing. Improved document chunking and metadata attachment operations. Resolved JWT auth reload exception on client."
  },
  {
    tag: "v1.1.5",
    title: "v1.1.5 Component UI Refactor & Theme Integration",
    date: "1w ago",
    author: "Rahul",
    downloads: "1.8k",
    aiSummary: "Redesigned dashboard widgets using Radix UI. Implemented pure black dark mode gradients. Replaced old static charts with responsive Recharts configurations."
  },
  {
    tag: "v1.0.0",
    title: "v1.0.0 Stable Initial Release RecallIQ",
    date: "1m ago",
    author: "Manan",
    downloads: "8.5k",
    aiSummary: "First commercial release of RecallIQ. Established backend indexing queues. Configured repository selection dashboard hooks and GitHub OAuth integrations."
  }
]

export default function ReleasesTab({ repo }: TabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <Card className="border border-white/5 bg-surface/30">
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-white/70 flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Repository Releases
          </CardTitle>
          <CardDescription className="text-xs text-white/40">Published release history and AI-synthesized release changelogs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockReleases.map((release) => (
              <div 
                key={release.tag}
                className="p-5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] flex flex-col gap-4 transition-all group"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                        {release.title}
                      </h4>
                      <span className="text-[10px] text-white/40 block mt-0.5">
                        published by {release.author} • <Calendar className="w-3 h-3 inline mr-0.5" /> {release.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs shrink-0">
                    <span className="text-[10px] text-white/40 flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
                      <Download className="w-3.5 h-3.5" /> {release.downloads} downloads
                    </span>
                    <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                      {release.tag}
                    </span>
                  </div>
                </div>

                {/* AI Summary block */}
                <div className="space-y-2">
                  <span className="text-[10px] text-white/40 font-bold uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                    AI Release Summary & Changelog
                  </span>
                  <p className="text-xs text-white/60 leading-relaxed italic pl-3 border-l border-primary">
                    "{release.aiSummary}"
                  </p>
                </div>

              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
