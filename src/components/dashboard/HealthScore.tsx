"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/Card"
import { ShieldCheck, ShieldAlert, Activity } from "lucide-react"

export function HealthScore({ score }: { score: number }) {
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  const isHealthy = score >= 80
  const isWarning = score >= 60 && score < 80
  const color = isHealthy ? "#10B981" : isWarning ? "#F59E0B" : "#EF4444"
  const bgColor = isHealthy ? "rgba(16, 185, 129, 0.1)" : isWarning ? "rgba(245, 158, 11, 0.1)" : "rgba(239, 68, 68, 0.1)"
  
  return (
    <Card className="h-full border border-white/5 bg-surface/30 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardContent className="p-6 flex items-center justify-between h-full">
        <div className="flex flex-col justify-center gap-1">
          <div className="flex items-center gap-2 mb-2">
            {isHealthy ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> : <ShieldAlert className="w-5 h-5 text-rose-400" />}
            <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Engineering Health</span>
          </div>
          
          <div className="flex items-end gap-3">
            <span className="text-5xl font-black tracking-tighter" style={{ color }}>{score}</span>
            <span className="text-sm text-foreground/40 mb-1 font-medium">/ 100</span>
          </div>

          <p className="text-xs text-foreground/50 mt-2 max-w-[200px]">
            {isHealthy ? "Your workspace is exceptionally healthy and well maintained." :
             isWarning ? "Some repositories need attention (open PRs or issues)." :
             "Critical attention required to maintain code quality."}
          </p>
        </div>

        <div className="relative flex items-center justify-center">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="10"
              fill="transparent"
            />
            <motion.circle
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              cx="64"
              cy="64"
              r={radius}
              stroke={color}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center border border-white/5 shadow-inner" style={{ backgroundColor: bgColor }}>
              <Activity className="w-8 h-8" style={{ color }} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
