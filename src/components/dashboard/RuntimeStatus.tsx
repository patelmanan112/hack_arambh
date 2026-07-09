"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Activity, Server, Cpu, Database } from "lucide-react"

export function RuntimeStatus() {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="w-5 h-5 text-primary" />
          AI Runtime Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface border border-white/5 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-foreground/60 text-xs mb-2">
              <Activity className="w-3.5 h-3.5" />
              Latency
            </div>
            <div className="text-2xl font-semibold text-white">124<span className="text-sm text-foreground/40 font-normal">ms</span></div>
          </div>
          <div className="bg-surface border border-white/5 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-foreground/60 text-xs mb-2">
              <Cpu className="w-3.5 h-3.5" />
              Current Model
            </div>
            <div className="text-sm font-semibold text-white mt-1">cascadeflow-v2</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-primary" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Vector DB</span>
                <span className="text-xs text-foreground/50">Processing Queue: 0</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-green-400">Syncing</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-foreground/70">
              <span>Token Usage (Today)</span>
              <span>1.2M / 2M</span>
            </div>
            <div className="w-full h-1.5 bg-surface-hover rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-purple-400 w-[60%] rounded-full shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
