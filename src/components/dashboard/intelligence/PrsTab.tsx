"use client"

import React from "react"
import { ExtendedRepo, prAnalytics } from "@/lib/mockData"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, 
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line 
} from "recharts"
import { Sparkles, GitPullRequest, Hourglass, Scale, AlertTriangle, ExternalLink } from "lucide-react"

interface TabProps {
  repo: ExtendedRepo
}

export default function PrsTab({ repo }: TabProps) {
  const data = prAnalytics

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-white/5 bg-surface/30 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/40 uppercase block">Average Merge Time</span>
            <span className="text-2xl font-black text-white mt-1 block">9.8h <span className="text-xs text-emerald-400 font-bold font-sans">▲ -45%</span></span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Hourglass className="w-5 h-5" />
          </div>
        </Card>

        <Card className="border border-white/5 bg-surface/30 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/40 uppercase block">Average PR Size</span>
            <span className="text-2xl font-black text-white mt-1 block">142 lines <span className="text-xs text-emerald-400 font-bold font-sans">▲ -60%</span></span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Scale className="w-5 h-5" />
          </div>
        </Card>

        <Card className="border border-white/5 bg-surface/30 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/40 uppercase block">Review Bottleneck Index</span>
            <span className="text-2xl font-black text-white mt-1 block">Low <span className="text-xs text-emerald-400 font-bold font-sans">Optimal</span></span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <GitPullRequest className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* PR Ratio & Time trends Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Open vs Closed Donut Chart (4 Columns) */}
        <Card className="border border-white/5 bg-surface/30 lg:col-span-4 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-white/70">PR Ratio Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-[180px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.openVsClosed}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {data.openVsClosed.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#09090b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">178</span>
                <span className="text-[10px] text-white/40 uppercase">Total PRs</span>
              </div>
            </div>
            
            {/* Custom Legend */}
            <div className="flex gap-4 text-xs mt-4">
              {data.openVsClosed.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-white/60">{entry.name}: <b>{entry.value}</b></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Merge and Review Speed Trends (8 Columns) */}
        <Card className="border border-white/5 bg-surface/30 lg:col-span-8">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-white/70">PR Velocity History</CardTitle>
            <CardDescription className="text-xs text-white/40">Correlation between average PR Size and review latency in hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.mergeTimeTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="week" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#09090b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px", color: "#fff" }} />
                  <Line type="monotone" dataKey="time" name="Merge Latency (Hours)" stroke="#7C3AED" strokeWidth={2} dot={{ fill: "#7C3AED" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottlenecks, Longest Open, Largest PRs Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Side: Longest Open & Largest PRs */}
        <div className="flex flex-col gap-6">
          
          {/* Longest Open PRs */}
          <Card className="border border-white/5 bg-surface/30">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-white/70">Longest Open Pull Requests</CardTitle>
              <CardDescription className="text-xs text-white/40">Active pull requests causing code integration latency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.longestOpenPrs.map((pr) => (
                  <div key={pr.title} className="p-3 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] flex items-center justify-between gap-4 transition-colors">
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-white truncate block hover:text-primary cursor-pointer">{pr.title}</span>
                      <span className="text-[10px] text-white/40 mt-1 block">by {pr.author} • size: <span className="font-mono text-purple-400">{pr.size}</span></span>
                    </div>
                    <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded shrink-0">
                      {pr.daysOpen} days open
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Review Bottlenecks Analysis */}
          <Card className="border border-white/5 bg-surface/30">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-white/70 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                PR Bottleneck Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.bottlenecks.map((b) => (
                  <div key={b.factor} className="p-3 rounded-lg border border-white/5 bg-white/[0.01] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white block">{b.factor}</span>
                      <span className="text-[10px] text-white/40 mt-0.5 block">Identified block impact: <b>{b.delay}</b></span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      b.risk === "High" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {b.risk} Risk
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Reviewer Workloads & AI Summary */}
        <div className="flex flex-col gap-6">
          
          {/* Reviewer Workloads Leaderboard */}
          <Card className="border border-white/5 bg-surface/30">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-white/70">Reviewer Workload</CardTitle>
              <CardDescription className="text-xs text-white/40">Breakdown of pending reviews and turnaround efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.reviewerWorkload.map((user) => (
                  <div key={user.name} className="p-3 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] flex items-center justify-between transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary">
                        {user.name[0]}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white">{user.name}</span>
                        <span className="text-[10px] text-white/40 block">avg turnaround: <b>{user.avgTime}</b></span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-xs font-bold text-white block">{user.completed} completed</span>
                      <span className="text-[10px] text-amber-400 font-semibold">{user.active} pending review</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Observation Card */}
          <Card className="border border-white/5 bg-surface/30 flex-1 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-white/70 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                PR Analytics AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <p className="text-xs text-white/60 italic leading-relaxed pl-3 border-l-2 border-primary">
                "{data.aiSummary}"
              </p>
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-lg mt-6 text-[10px] text-white/40 flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <span>PR Acceptance Rate</span>
                  <span className="font-semibold text-emerald-400">89.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>CI/CD Automation Pipeline</span>
                  <span className="font-semibold text-emerald-400">Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Regression Rate</span>
                  <span className="font-semibold text-white">0.02%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  )
}
