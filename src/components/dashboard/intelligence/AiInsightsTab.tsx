"use client"

import React from "react"
import { ExtendedRepo, aiInsights } from "@/lib/mockData"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Sparkles, Award, ArrowUpRight, Check } from "lucide-react"

interface TabProps {
  repo: ExtendedRepo
}

export default function AiInsightsTab({ repo }: TabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Overview Intro */}
      <div className="border-b border-white/5 pb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          AI Engineering Insight Reports
        </h3>
        <p className="text-xs text-white/40 mt-1">
          RecallIQ AI analyzes files, commit logs, PR descriptions, and Slack threads to generate technical debt reports, risks, and sprints assessments.
        </p>
      </div>

      {/* Grid of AI Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiInsights.map((insight) => {
          const isHighConfidence = insight.confidence >= 95;
          const isMediumConfidence = insight.confidence >= 90 && insight.confidence < 95;
          const Icon = insight.icon;
          
          return (
            <Card key={insight.title} className="border border-white/5 bg-surface/30 relative overflow-hidden flex flex-col justify-between group hover:border-white/15 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[45px] pointer-events-none" />
              
              <CardContent className="p-6 flex-1 flex flex-col justify-between gap-5">
                
                {/* Header row */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-200">
                      <Icon className="w-4 h-4" />
                    </div>
                    
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                      isHighConfidence ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      isMediumConfidence ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      Confidence: {insight.confidence}%
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                    {insight.title}
                  </h4>

                  <p className="text-xs text-white/60 leading-relaxed font-normal italic pl-2 border-l border-white/10 group-hover:border-primary/50 transition-colors">
                    "{insight.summary}"
                  </p>
                </div>

                {/* References row */}
                <div className="border-t border-white/5 pt-3.5 space-y-2">
                  <span className="text-[9px] text-white/30 uppercase font-medium">Supporting references</span>
                  <div className="flex flex-wrap gap-1.5">
                    {insight.references.map((ref) => (
                      <span key={ref} className="text-[9px] font-mono px-2 py-0.5 bg-black/40 text-primary border border-white/5 rounded">
                        {ref}
                      </span>
                    ))}
                  </div>
                </div>

              </CardContent>
            </Card>
          )
        })}
      </div>

    </div>
  )
}
