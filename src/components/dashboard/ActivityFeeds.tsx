"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { GitCommit, GitPullRequest, CircleDot, Clock } from "lucide-react"
import type { DashboardData } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"

export function ActivityFeeds({ activity }: { activity: DashboardData["recentActivity"] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      
      {/* 1. Recent Commits */}
      <Card className="border border-white/5 bg-surface/30 flex flex-col h-[400px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-blue-400" />
            Recent Commits
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto hide-scrollbar space-y-4 pr-2">
          {activity.commits.length === 0 ? (
            <div className="text-xs text-foreground/40 text-center py-8">No recent commits</div>
          ) : (
            activity.commits.map((commit) => (
              <div key={commit.id} className="flex flex-col gap-1 border-b border-white/5 pb-3 last:border-0">
                <a href={commit.url} target="_blank" rel="noreferrer" className="text-sm text-foreground hover:text-primary transition-colors line-clamp-1">
                  {commit.message}
                </a>
                <div className="flex items-center justify-between text-[11px] text-foreground/50">
                  <span>{commit.author} • {commit.repository.split('/')[1]}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {formatDistanceToNow(new Date(commit.date), { addSuffix: true })}</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* 2. Recent Pull Requests */}
      <Card className="border border-white/5 bg-surface/30 flex flex-col h-[400px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <GitPullRequest className="w-4 h-4 text-purple-400" />
            Recent Pull Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto hide-scrollbar space-y-4 pr-2">
          {activity.prs.length === 0 ? (
            <div className="text-xs text-foreground/40 text-center py-8">No recent pull requests</div>
          ) : (
            activity.prs.map((pr) => (
              <div key={pr.id} className="flex flex-col gap-1 border-b border-white/5 pb-3 last:border-0">
                <a href={pr.url} target="_blank" rel="noreferrer" className="text-sm text-foreground hover:text-primary transition-colors line-clamp-1">
                  {pr.title}
                </a>
                <div className="flex items-center justify-between text-[11px] text-foreground/50">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${pr.state === 'open' ? 'bg-amber-500' : pr.state === 'merged' ? 'bg-purple-500' : 'bg-red-500'}`} />
                    <span>{pr.author}</span>
                  </div>
                  <span>{formatDistanceToNow(new Date(pr.date), { addSuffix: true })}</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* 3. Recent Issues */}
      <Card className="border border-white/5 bg-surface/30 flex flex-col h-[400px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <CircleDot className="w-4 h-4 text-emerald-400" />
            Recent Issues
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto hide-scrollbar space-y-4 pr-2">
          {activity.issues.length === 0 ? (
            <div className="text-xs text-foreground/40 text-center py-8">No recent issues</div>
          ) : (
            activity.issues.map((issue) => (
              <div key={issue.id} className="flex flex-col gap-1 border-b border-white/5 pb-3 last:border-0">
                <span className="text-sm text-foreground line-clamp-1">
                  {issue.title}
                </span>
                <div className="flex items-center justify-between text-[11px] text-foreground/50">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold border ${issue.status === 'open' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                      {issue.status}
                    </span>
                    <span>{issue.author}</span>
                  </div>
                  <span>{formatDistanceToNow(new Date(issue.date), { addSuffix: true })}</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      
    </div>
  )
}
