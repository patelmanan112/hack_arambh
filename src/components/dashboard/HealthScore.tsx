"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Progress } from "@/components/ui/Progress"
import { healthMetrics } from "@/lib/mockData"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { CheckCircle2, AlertCircle, HelpCircle, ArrowUpRight, ArrowDownRight } from "lucide-react"

export function HealthScore() {
  const overallScore = 92;

  return (
    <Card className="col-span-1 lg:col-span-4 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold tracking-tight text-white flex items-center justify-between">
          <span>Engineering Health Score</span>
          <span className="text-xs font-semibold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
            Sprint Status: Optimal
          </span>
        </CardTitle>
        <CardDescription className="text-foreground/50">
          Continuous AI audit across active GitHub repositories
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col pt-4">
        {/* Overall Score Circle Indicator */}
        <div className="flex flex-col items-center justify-center py-4 mb-6 border-b border-white/5">
          <div className="relative flex items-center justify-center w-40 h-40 group">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-white/5"
                strokeWidth="7"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
              <motion.circle
                className="text-primary transition-all duration-1000 ease-out"
                strokeWidth="7"
                strokeDasharray="263.89"
                initial={{ strokeDashoffset: 263.89 }}
                animate={{ strokeDashoffset: 263.89 - (263.89 * overallScore) / 100 }}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
                style={{ filter: "drop-shadow(0 0 12px rgba(124,58,237,0.4))" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-extrabold text-white tracking-tighter group-hover:scale-105 transition-transform duration-300">
                  {overallScore}
                </span>
                <span className="text-lg text-foreground/40 font-normal ml-0.5">/100</span>
              </div>
              <span className="text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Excellent
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Metrics */}
        <div className="space-y-5 flex-1">
          {healthMetrics.map((metric, idx) => {
            const isUp = metric.trend.startsWith("+");
            const isDown = metric.trend.startsWith("-");
            
            return (
              <motion.div 
                key={metric.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * idx }}
                className="space-y-1.5 group/item"
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-foreground/80 font-medium group-hover/item:text-white transition-colors">
                      {metric.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs font-semibold flex items-center px-1.5 py-0.5 rounded-md",
                      isUp ? "text-emerald-400 bg-emerald-500/10" : 
                      isDown ? "text-rose-400 bg-rose-500/10" : 
                      "text-foreground/50 bg-white/5"
                    )}>
                      {isUp && <ArrowUpRight className="w-3 h-3 mr-0.5 shrink-0" />}
                      {isDown && <ArrowDownRight className="w-3 h-3 mr-0.5 shrink-0" />}
                      {metric.trend}
                    </span>
                    <span className="text-xs text-foreground/40">{metric.comparison}</span>
                    <span className="text-white font-semibold ml-1">{metric.score}%</span>
                  </div>
                </div>
                
                {/* Progress bar with dynamic coloring */}
                <Progress 
                  value={metric.score} 
                  className="h-1.5 bg-white/5"
                  indicatorClassName={cn(
                    metric.id === "quality" && "bg-violet-500 shadow-[0_0_8px_rgba(124,58,237,0.4)]",
                    metric.id === "velocity" && "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]",
                    metric.id === "activity" && "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]",
                    metric.id === "docs" && "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]",
                    metric.id === "collab" && "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]",
                    metric.id === "issues" && "bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.4)]"
                  )}
                />
                
                {/* AI Explanation */}
                <p className="text-[11px] text-foreground/50 leading-relaxed font-normal italic pl-2 border-l border-white/10 group-hover/item:border-primary/50 group-hover/item:text-foreground/70 transition-all">
                  "{metric.explanation}"
                </p>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
