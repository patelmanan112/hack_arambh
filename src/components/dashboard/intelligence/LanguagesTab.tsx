"use client"

import React, { useState } from "react"
import { ExtendedRepo, languageAnalytics } from "@/lib/mockData"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Sparkles, Code2, Cpu, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface TabProps {
  repo: ExtendedRepo
}

const COLORS = ["#3178c6", "#3572A5", "#dea584", "#00ADD8", "#8b949e"]

export default function LanguagesTab({ repo }: TabProps) {
  const data = languageAnalytics
  const [activeIndex, setActiveIndex] = useState(0)

  const activeLang = data[activeIndex] || data[0]

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Languages Donut (5 Columns) */}
        <Card className="border border-white/5 bg-surface/30 lg:col-span-5 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-white/70">Language Composition</CardTitle>
            <CardDescription className="text-xs text-white/40">Lines of code distribution within active directories</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="percentage"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#09090b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm font-bold text-white/40 uppercase">Dominant</span>
                <span className="text-lg font-black text-white">{data[0].name}</span>
              </div>
            </div>

            {/* Custom legends that trigger active index on hover */}
            <div className="flex flex-col gap-1.5 w-full mt-4 text-xs">
              {data.map((entry, index) => (
                <button
                  key={entry.name}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
                    activeIndex === index 
                      ? "bg-white/5 border-white/10 text-white" 
                      : "bg-transparent border-transparent text-white/40 hover:text-white/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="font-semibold">{entry.name}</span>
                  </div>
                  <span>{entry.percentage}%</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Language Details (7 Columns) */}
        <Card className="border border-white/5 bg-surface/30 lg:col-span-7 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-white/70 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary" />
                Language Intelligence: {activeLang.name}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                activeLang.trend === "up" ? "bg-emerald-500/10 text-emerald-400" :
                activeLang.trend === "down" ? "bg-rose-500/10 text-rose-400" :
                "bg-white/5 text-white/40"
              }`}>
                {activeLang.trend === "up" && <TrendingUp className="w-3.5 h-3.5" />}
                {activeLang.trend === "down" && <TrendingDown className="w-3.5 h-3.5" />}
                {activeLang.trend === "stable" && <Minus className="w-3.5 h-3.5" />}
                Growth: {activeLang.growth}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
            
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl border border-white/5 bg-black/40">
                <span className="text-[10px] text-white/30 uppercase font-medium">Lines of Code</span>
                <span className="text-xl font-bold text-white block mt-1">{activeLang.loc}</span>
              </div>
              <div className="p-3.5 rounded-xl border border-white/5 bg-black/40">
                <span className="text-[10px] text-white/30 uppercase font-medium">Active Repositories</span>
                <span className="text-xl font-bold text-white block mt-1">{activeLang.repos} repos</span>
              </div>
              <div className="p-3.5 rounded-xl border border-white/5 bg-black/40">
                <span className="text-[10px] text-white/30 uppercase font-medium">LOC Composition</span>
                <span className="text-xl font-bold text-white block mt-1">{activeLang.percentage}%</span>
              </div>
            </div>

            <div className="space-y-2 flex-1 mt-6">
              <span className="text-xs text-white/40 uppercase font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                AI Diagnostics & Notes
              </span>
              <p className="text-sm text-white/70 leading-relaxed italic pl-3 border-l border-primary">
                "{activeLang.explanation}"
              </p>
            </div>
            
            <div className="bg-white/[0.01] border border-white/5 p-3 rounded-lg text-[10px] text-white/30 mt-6 leading-relaxed">
              * Language calculations represent actual source files parsed. Automated library files (e.g. node_modules, vendored C modules) are automatically pruned by RecallIQ sync filters.
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
