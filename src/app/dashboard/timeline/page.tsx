"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { recentTimeline } from "@/lib/mockData"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { 
  Clock, Filter, Search, GitBranch, GitPullRequest, 
  CircleDot, Rocket, Zap, GitCommit, Check, ChevronRight
} from "lucide-react"

export default function TimelinePage() {
  const [filterType, setFilterType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const timelineFilters = [
    { id: "all", label: "All Events" },
    { id: "commit", label: "Commits" },
    { id: "pr", label: "Pull Requests" },
    { id: "issue", label: "Issues" },
    { id: "deployment", label: "Deployments" },
    { id: "release", label: "Releases" }
  ]

  const filteredTimeline = useMemo(() => {
    return recentTimeline.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase())
      
      let matchesFilter = true
      if (filterType === "commit") matchesFilter = item.type === "commit" || item.type === "branch"
      else if (filterType === "pr") matchesFilter = item.type === "pr-create" || item.type === "pr-merge"
      else if (filterType === "issue") matchesFilter = item.type === "issue-create" || item.type === "issue-close"
      else if (filterType === "deployment") matchesFilter = item.type === "deployment"
      else if (filterType === "release") matchesFilter = item.type === "release"

      return matchesSearch && matchesFilter
    })
  }, [searchQuery, filterType])

  return (
    <div className="flex flex-col gap-6 pb-12 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-400" />
          Engineering Activity Timeline
        </h2>
        <p className="text-xs text-foreground/50 mt-1">
          Historical log of commits, branches, pull requests, issues, releases, and staging/production deployments.
        </p>
      </div>

      {/* Filter Options Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-3 bg-white/[0.01] border border-white/5 rounded-xl">
        <div className="flex flex-wrap gap-1.5">
          {timelineFilters.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                filterType === tab.id
                  ? "bg-primary border-primary text-white"
                  : "bg-transparent border-white/10 text-white/60 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          <input
            type="text"
            placeholder="Search timeline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-white/15 hover:border-white/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg pl-9 pr-4 py-1.5 text-xs text-foreground placeholder:text-foreground/30 outline-none transition-all"
          />
        </div>
      </div>

      {/* Activity Timeline List */}
      <Card className="border border-white/5 bg-surface/30 p-6">
        <CardContent className="p-0 relative">
          <div className="absolute top-4 bottom-4 left-[15px] w-px bg-white/10" />
          
          {filteredTimeline.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-white/30">
              <Clock className="w-8 h-8 opacity-40 mb-2" />
              <span className="text-sm font-semibold">No activity logs match your filter</span>
            </div>
          ) : (
            <div className="space-y-8 relative z-10">
              <AnimatePresence mode="popLayout">
                {filteredTimeline.map((event, idx) => (
                  <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: idx * 0.03 }}
                    className="relative pl-8 group flex items-start justify-between gap-4"
                  >
                    <span className="absolute -left-[11px] top-1 h-6 w-6 rounded-full bg-[#000000] border border-white/20 flex items-center justify-center group-hover:border-primary transition-colors z-10 shadow-lg">
                      <event.icon className={`h-3 w-3 ${event.color}`} />
                    </span>
                    
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors leading-relaxed">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-2.5 text-xs text-white/40 mt-1.5 flex-wrap">
                        <span>Author: <b>{event.author}</b></span>
                        <span>•</span>
                        <span>Scope: <span className="font-mono text-primary/80">RecallIQ</span></span>
                        <span>•</span>
                        <span>{event.time}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-white/30 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                        {event.type}
                      </span>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors cursor-pointer" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
