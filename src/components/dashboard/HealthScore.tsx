"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Progress } from "@/components/ui/Progress"

export function HealthScore() {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
      <CardHeader>
        <CardTitle className="text-lg">Engineering Health Score</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center w-48 h-48 mb-6 group">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-white/5"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className="text-primary transition-all duration-1000 ease-out"
              strokeWidth="8"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * 94) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
              style={{ filter: "drop-shadow(0 0 8px rgba(124,58,237,0.5))" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-5xl font-bold text-white tracking-tighter group-hover:scale-110 transition-transform duration-300">
              94
            </span>
            <span className="text-sm font-medium text-green-400 mt-1">Excellent</span>
          </div>
        </div>

        <div className="w-full space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground/80">Repository Health</span>
              <span className="text-white font-medium">92%</span>
            </div>
            <Progress value={92} className="h-1.5" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground/80">Documentation</span>
              <span className="text-white font-medium">88%</span>
            </div>
            <Progress value={88} className="h-1.5 [&>div]:bg-blue-500" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground/80">Security</span>
              <span className="text-white font-medium">98%</span>
            </div>
            <Progress value={98} className="h-1.5 [&>div]:bg-green-500" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground/80">Meeting Coverage</span>
              <span className="text-white font-medium">100%</span>
            </div>
            <Progress value={100} className="h-1.5 [&>div]:bg-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
