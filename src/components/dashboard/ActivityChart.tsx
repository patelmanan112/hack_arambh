"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "1", commits: 4000, prs: 2400, meetings: 2400 },
  { name: "5", commits: 3000, prs: 1398, meetings: 2210 },
  { name: "10", commits: 2000, prs: 9800, meetings: 2290 },
  { name: "15", commits: 2780, prs: 3908, meetings: 2000 },
  { name: "20", commits: 1890, prs: 4800, meetings: 2181 },
  { name: "25", commits: 2390, prs: 3800, meetings: 2500 },
  { name: "30", commits: 3490, prs: 4300, meetings: 2100 },
]

export function ActivityChart() {
  return (
    <Card className="col-span-1 md:col-span-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
      <CardHeader>
        <CardTitle>Engineering Activity</CardTitle>
        <CardDescription>30-day velocity and knowledge generation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPrs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(24, 24, 27, 0.8)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(12px)'
                }}
              />
              <Area type="monotone" dataKey="commits" stroke="#7C3AED" strokeWidth={2} fillOpacity={1} fill="url(#colorCommits)" />
              <Area type="monotone" dataKey="prs" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorPrs)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
