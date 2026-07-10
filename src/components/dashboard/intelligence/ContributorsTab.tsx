"use client"

import React from "react"
import { ExtendedRepo, contributorIntelligence } from "@/lib/mockData"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Progress } from "@/components/ui/Progress"
import { Users, Sparkles, Award, Zap, ShieldCheck } from "lucide-react"

interface TabProps {
  repo: ExtendedRepo
}

// Sparkline SVG Component
function Sparkline({ data, stroke = "#10B981" }: { data: number[]; stroke?: string }) {
  const width = 120
  const height = 30
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((val - min) / range) * (height - 6) - 3
    return `${x},${y}`
  }).join(" ")
  
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  )
}

export default function ContributorsTab({ repo }: TabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Overview Intro */}
      <Card className="border border-white/5 bg-surface/30">
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-white/70 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Contributor Activity Network
          </CardTitle>
          <CardDescription className="text-xs text-white/40">Active contributions, review turnaround speeds, and AI productivity index scoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
            {contributorIntelligence.map((dev, index) => (
              <div 
                key={dev.name} 
                className="p-5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all flex flex-col justify-between gap-4 group"
              >
                {/* Header info */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={dev.avatarUrl}
                      alt={dev.name}
                      className="w-11 h-11 rounded-full object-cover border border-white/10 group-hover:border-primary transition-all"
                    />
                    {index === 0 && (
                      <span className="absolute -top-1 -right-1 bg-yellow-500 rounded-full border-2 border-background w-4 h-4 flex items-center justify-center text-[8px] font-black text-black">
                        👑
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{dev.name}</h4>
                    <span className="text-xs text-white/40 block mt-0.5">{dev.role}</span>
                  </div>
                </div>

                {/* Score indicators */}
                <div className="space-y-2 border-t border-b border-white/5 py-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/40">Commits</span>
                    <span className="font-semibold text-white">{dev.commits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">PRs Merged</span>
                    <span className="font-semibold text-white">{dev.prs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Reviews Done</span>
                    <span className="font-semibold text-white">{dev.reviews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Issues Solved</span>
                    <span className="font-semibold text-white">{dev.issuesClosed}</span>
                  </div>
                </div>

                {/* AI scores */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/40 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-primary" />
                      AI Productivity Index
                    </span>
                    <span className="font-black text-primary">{dev.aiProductivityScore}%</span>
                  </div>
                  <Progress value={dev.aiProductivityScore} className="h-1 bg-white/5" />
                  
                  <div className="flex justify-between items-center text-xs mt-2">
                    <span className="text-white/40">Current Streak</span>
                    <span className="font-semibold text-emerald-400">🔥 {dev.streak} days</span>
                  </div>
                </div>

                {/* Sparkline trend */}
                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1">
                  <span className="text-[9px] text-white/30 uppercase">Commit Trend</span>
                  <Sparkline data={dev.trend} stroke={index === 0 ? "#10B981" : "#7C3AED"} />
                </div>

              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
