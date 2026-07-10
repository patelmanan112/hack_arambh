"use client"

import React from "react"
import { ExtendedRepo, issueAnalytics } from "@/lib/mockData"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, 
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line 
} from "recharts"
import { Sparkles, CircleDot, AlertCircle, RefreshCw, Clock } from "lucide-react"

interface TabProps {
  repo: ExtendedRepo
}

export default function IssuesTab({ repo }: TabProps) {
  const data = issueAnalytics

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Overview stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-white/5 bg-surface/30 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/40 uppercase block">Average Resolution Time</span>
            <span className="text-2xl font-black text-white mt-1 block">1.2 days <span className="text-xs text-emerald-400 font-bold font-sans">▲ -30%</span></span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
            <Clock className="w-5 h-5" />
          </div>
        </Card>

        <Card className="border border-white/5 bg-surface/30 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/40 uppercase block">Open Backlog Size</span>
            <span className="text-2xl font-black text-white mt-1 block">16 issues <span className="text-xs text-emerald-400 font-bold font-sans">▲ Stable</span></span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <CircleDot className="w-5 h-5" />
          </div>
        </Card>

        <Card className="border border-white/5 bg-surface/30 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/40 uppercase block">Critical Escalations</span>
            <span className="text-2xl font-black text-white mt-1 block">0 active <span className="text-[10px] text-white/30 font-normal">in queue</span></span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <AlertCircle className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Issues charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Label Distribution Donut Chart (4 Columns) */}
        <Card className="border border-white/5 bg-surface/30 lg:col-span-4 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-white/70">Label Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-[180px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.labelDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {data.labelDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#09090b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">100</span>
                <span className="text-[10px] text-white/40 uppercase">Open / Closed</span>
              </div>
            </div>
            
            {/* Custom Label distribution legends */}
            <div className="grid grid-cols-2 gap-2 text-[10px] mt-4 w-full px-2">
              {data.labelDistribution.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5 bg-white/[0.02] border border-white/5 px-2 py-1 rounded">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                  <span className="text-white/60 truncate">{entry.name}: <b>{entry.value}%</b></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Issue opened vs closed trend (8 Columns) */}
        <Card className="border border-white/5 bg-surface/30 lg:col-span-8">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-white/70">Issue Velocity Trend</CardTitle>
            <CardDescription className="text-xs text-white/40">Opened issues vs closed issues resolved per week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[230px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.trends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="week" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#09090b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px", color: "#fff" }} />
                  <Line type="monotone" dataKey="opened" name="Opened Issues" stroke="#F59E0B" strokeWidth={2} dot={{ fill: "#F59E0B" }} />
                  <Line type="monotone" dataKey="closed" name="Closed Issues" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issue aging & AI Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Issue aging bar chart */}
        <Card className="border border-white/5 bg-surface/30">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-white/70">Backlog Issue Aging</CardTitle>
            <CardDescription className="text-xs text-white/40">Open tickets distribution classified by age range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.aging} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="range" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#09090b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                  <Bar dataKey="count" name="Open Tickets" fill="#A78BFA" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI summary */}
        <Card className="border border-white/5 bg-surface/30 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-white/70 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              Issue Management AI
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <p className="text-xs text-white/60 italic leading-relaxed pl-3 border-l-2 border-primary">
              "{data.aiSummary}"
            </p>
            <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-lg mt-6 text-[10px] text-white/40 flex flex-col gap-2">
              <div className="flex justify-between">
                <span>Bug Escape Rate</span>
                <span className="font-semibold text-emerald-400">1.8%</span>
              </div>
              <div className="flex justify-between">
                <span>Backlog Triage Integrity</span>
                <span className="font-semibold text-white">92%</span>
              </div>
              <div className="flex justify-between">
                <span>Weekly Backlog Resolution Burn</span>
                <span className="font-semibold text-emerald-400">-5 Issues Net</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
