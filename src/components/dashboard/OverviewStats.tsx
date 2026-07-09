"use client"

import { Card, CardContent } from "@/components/ui/Card"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { GitPullRequest, GitCommit, Users, Database } from "lucide-react"

const data = [
  { value: 400 }, { value: 300 }, { value: 550 },
  { value: 450 }, { value: 600 }, { value: 700 }, { value: 850 }
]

const stats = [
  {
    name: "Pull Requests",
    value: "1,248",
    trend: "+12.5%",
    icon: GitPullRequest,
    color: "#7C3AED", // primary
  },
  {
    name: "Commits",
    value: "14,592",
    trend: "+24.1%",
    icon: GitCommit,
    color: "#3B82F6", // blue
  },
  {
    name: "Meetings Analyzed",
    value: "342",
    trend: "+8.2%",
    icon: Users,
    color: "#10B981", // green
  },
  {
    name: "Knowledge Chunks",
    value: "1.2M",
    trend: "+32.4%",
    icon: Database,
    color: "#F59E0B", // amber
  },
]

export function OverviewStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
      {stats.map((stat, i) => (
        <Card key={stat.name} className="group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-foreground/60">
                <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                <span className="text-sm font-medium">{stat.name}</span>
              </div>
              <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold text-white tracking-tight group-hover:scale-105 transition-transform origin-left">
                  {stat.value}
                </div>
                <div className="text-xs text-foreground/40 mt-1">vs last week</div>
              </div>
              
              <div className="h-12 w-24 opacity-60 group-hover:opacity-100 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={stat.color} 
                      strokeWidth={2} 
                      dot={false}
                      style={{ filter: `drop-shadow(0 4px 6px ${stat.color}40)` }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
