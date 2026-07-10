"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts"
import type { DashboardData } from "@/lib/api"
import { Activity, GitCommit, GitPullRequest, Code2, Users, PieChart as PieChartIcon } from "lucide-react"

export function ChartsGroup({ data }: { data: DashboardData["charts"] }) {
  const COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* 1. Commit Activity (Area Chart) */}
      <Card className="border border-white/5 bg-surface/30">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Commit Activity (30 Days)
          </CardTitle>
          <CardDescription>Daily commit volume across all repositories</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.commitActivity}>
              <defs>
                <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={12} tickMargin={10} minTickGap={30} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="commits" stroke="#7C3AED" strokeWidth={2} fillOpacity={1} fill="url(#colorCommits)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2. Top Contributors (Bar Chart) */}
      <Card className="border border-white/5 bg-surface/30">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Top Contributors
          </CardTitle>
          <CardDescription>Most active developers by commit count</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.topContributors} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" fontSize={12} width={80} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
              />
              <Bar dataKey="commits" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3. Language Distribution (Pie Chart) */}
      <Card className="border border-white/5 bg-surface/30">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            Repository Languages
          </CardTitle>
          <CardDescription>Language distribution across workspace</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          {data.languageDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.languageDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.languageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-foreground/40 text-sm">No language data available</div>
          )}
        </CardContent>
      </Card>

      {/* 4. PR Analytics (Bar Chart) */}
      <Card className="border border-white/5 bg-surface/30">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-purple-400" />
            Pull Request Analytics
          </CardTitle>
          <CardDescription>Status of pull requests</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.prAnalytics} margin={{ top: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="state" stroke="rgba(255,255,255,0.3)" fontSize={12} tickFormatter={(val) => val.toUpperCase()} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                {data.prAnalytics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={
                    entry.state === 'open' ? '#F59E0B' : 
                    entry.state === 'merged' ? '#7C3AED' : '#EF4444'
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
