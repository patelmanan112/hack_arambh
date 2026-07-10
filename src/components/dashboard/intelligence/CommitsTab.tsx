"use client"

import React from "react"
import { ExtendedRepo, commitAnalytics } from "@/lib/mockData"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area 
} from "recharts"
import { Sparkles, Calendar, Clock, GitCommit, ArrowUpRight } from "lucide-react"

interface TabProps {
  repo: ExtendedRepo
}

export default function CommitsTab({ repo }: TabProps) {
  const data = commitAnalytics

  // Heatmap helper for cell styles
  const getCellClass = (val: number) => {
    if (val > 75) return "bg-primary text-white font-semibold border-primary/50"
    if (val > 55) return "bg-primary/75 text-white/90 border-primary/30"
    if (val > 35) return "bg-primary/45 text-white/80 border-primary/10"
    if (val > 15) return "bg-primary/20 text-white/60 border-white/5"
    return "bg-white/[0.02] text-white/30 border-white/5"
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-white/5 bg-surface/30 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/40 uppercase block">Weekly Volume Average</span>
            <span className="text-2xl font-black text-white mt-1 block">202 <span className="text-xs text-emerald-400 font-bold font-sans">▲ +12%</span></span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <GitCommit className="w-5 h-5" />
          </div>
        </Card>

        <Card className="border border-white/5 bg-surface/30 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/40 uppercase block">Peak Development Window</span>
            <span className="text-2xl font-black text-white mt-1 block">14:00 - 16:00</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Clock className="w-5 h-5" />
          </div>
        </Card>

        <Card className="border border-white/5 bg-surface/30 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/40 uppercase block">Commits Per Day Average</span>
            <span className="text-2xl font-black text-white mt-1 block">28.8 <span className="text-[10px] text-white/30 font-normal">commits/day</span></span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Weekly Commit Volume */}
        <Card className="border border-white/5 bg-surface/30">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-white/70">Weekly Commit Activity</CardTitle>
            <CardDescription className="text-xs text-white/40">12-week velocity of commits merged into {repo.default_branch}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.weeklyCommits} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="commitsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="week" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#09090b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    labelStyle={{ color: "rgba(255,255,255,0.5)", fontSize: "11px" }}
                  />
                  <Area type="monotone" dataKey="commits" name="Commits" stroke="#7C3AED" strokeWidth={2} fillOpacity={1} fill="url(#commitsGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 2. Peak Hours Analysis */}
        <Card className="border border-white/5 bg-surface/30">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-white/70">Peak Development Hours</CardTitle>
            <CardDescription className="text-xs text-white/40">Distribution of commit times across the 24-hour cycle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.peakHours} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="hour" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#09090b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    labelStyle={{ color: "rgba(255,255,255,0.5)", fontSize: "11px" }}
                  />
                  <Bar dataKey="commits" name="Commits" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap & AI Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Heatmap Matrix Grid (8 Columns) */}
        <Card className="border border-white/5 bg-surface/30 lg:col-span-8 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-white/70">Commit Density Heatmap</CardTitle>
            <CardDescription className="text-xs text-white/40">Intensity metrics based on weekdays and schedule blocks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto min-w-full">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="py-2 text-white/40 font-semibold w-16">Day</th>
                    <th className="py-2 text-white/40 font-semibold text-center">Morning (08:00-12:00)</th>
                    <th className="py-2 text-white/40 font-semibold text-center">Afternoon (12:00-16:00)</th>
                    <th className="py-2 text-white/40 font-semibold text-center">Evening (16:00-20:00)</th>
                    <th className="py-2 text-white/40 font-semibold text-center">Night (20:00-08:00)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.heatmap.map((row) => (
                    <tr key={row.day} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors">
                      <td className="py-3 font-semibold text-white/80">{row.day}</td>
                      <td className="p-1">
                        <div className={`p-2.5 rounded-lg border text-center transition-all ${getCellClass(row.Morning)}`}>
                          {row.Morning}
                        </div>
                      </td>
                      <td className="p-1">
                        <div className={`p-2.5 rounded-lg border text-center transition-all ${getCellClass(row.Afternoon)}`}>
                          {row.Afternoon}
                        </div>
                      </td>
                      <td className="p-1">
                        <div className={`p-2.5 rounded-lg border text-center transition-all ${getCellClass(row.Evening)}`}>
                          {row.Evening}
                        </div>
                      </td>
                      <td className="p-1">
                        <div className={`p-2.5 rounded-lg border text-center transition-all ${getCellClass(row.Night)}`}>
                          {row.Night}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Commit AI Summary (4 Columns) */}
        <Card className="border border-white/5 bg-surface/30 lg:col-span-4 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-white/70 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              Commit Velocity AI
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <p className="text-xs text-white/60 italic leading-relaxed pl-3 border-l-2 border-primary">
              "{data.aiSummary}"
            </p>
            <div className="bg-white/[0.02] border border-white/5 p-3 rounded-lg mt-6 text-[11px] text-white/40 flex flex-col gap-1.5">
              <div className="flex justify-between">
                <span>Active Branch Merge Check</span>
                <span className="font-semibold text-emerald-400">94% Success</span>
              </div>
              <div className="flex justify-between">
                <span>Integration Cycle Time</span>
                <span className="font-semibold text-white">45m</span>
              </div>
              <div className="flex justify-between">
                <span>Regression Alerts</span>
                <span className="font-semibold text-emerald-400">0 Flags</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
