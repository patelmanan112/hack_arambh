"use client"

import React from "react"
import { ExtendedRepo } from "@/lib/mockData"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Progress } from "@/components/ui/Progress"
import { 
  Star, GitFork, CircleDot, Clock, Lock, Globe, Users, 
  Sparkles, ShieldAlert, GitBranch, AlertTriangle, FileText, CheckCircle2
} from "lucide-react"

interface TabProps {
  repo: ExtendedRepo
}

export default function OverviewTab({ repo }: TabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
      
      {/* AI Summary Block (8 Columns) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <Card className="border border-white/5 bg-surface/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Sparkles className="w-5 h-5 text-primary" />
              Repository AI Synopsis
            </CardTitle>
            <CardDescription className="text-foreground/50">
              Synthesized knowledge representing repository structure and commit trajectory.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-sm text-foreground/80 leading-relaxed italic border-l-4 border-l-primary">
              "{repo.ai_summary}"
            </div>
            <p className="text-sm leading-relaxed text-foreground/70">
              The project is active with a contribution network of <b>{repo.contributors_count} developer(s)</b>. 
              The default branch is configured as <b>{repo.default_branch}</b>, maintaining a clean workspace. 
              Tests, code reviews, and dependency checks are currently automated. Latest commits focus strictly on semantic feature integrations.
            </p>
          </CardContent>
        </Card>

        {/* Latest Commit Details Card */}
        <Card className="border border-white/5 bg-surface/30">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-white">Latest Integration Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl border border-white/5 bg-black/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0 mt-0.5">
                  {repo.latest_commit.author[0]}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">"{repo.latest_commit.message}"</h4>
                  <span className="text-xs text-white/50 block mt-1">
                    committed by {repo.latest_commit.author} • {repo.latest_commit.date.includes("T") ? "2 hours ago" : repo.latest_commit.date}
                  </span>
                </div>
              </div>
              
              <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0">
                <span className="text-xs font-mono text-primary font-semibold bg-primary/5 px-2.5 py-1 rounded border border-primary/15">
                  {repo.latest_commit.sha}
                </span>
                <span className="text-[10px] text-white/40 sm:mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified build
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Repository Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="border border-white/5 bg-surface/30 p-4 flex flex-col justify-between">
            <span className="text-xs text-white/40 uppercase">Stars</span>
            <div className="flex items-center gap-2 mt-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-2xl font-bold text-white">{repo.stargazers_count}</span>
            </div>
          </Card>
          
          <Card className="border border-white/5 bg-surface/30 p-4 flex flex-col justify-between">
            <span className="text-xs text-white/40 uppercase">Forks</span>
            <div className="flex items-center gap-2 mt-2">
              <GitFork className="w-5 h-5 text-blue-400" />
              <span className="text-2xl font-bold text-white">{repo.forks_count}</span>
            </div>
          </Card>

          <Card className="border border-white/5 bg-surface/30 p-4 flex flex-col justify-between">
            <span className="text-xs text-white/40 uppercase">Open Issues</span>
            <div className="flex items-center gap-2 mt-2">
              <CircleDot className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-bold text-white">{repo.open_issues_count}</span>
            </div>
          </Card>

          <Card className="border border-white/5 bg-surface/30 p-4 flex flex-col justify-between">
            <span className="text-xs text-white/40 uppercase">Contributors</span>
            <div className="flex items-center gap-2 mt-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-2xl font-bold text-white">{repo.contributors_count}</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Repo Health & Risk Indicators (4 Columns) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Risk Card */}
        <Card className="border border-white/5 bg-surface/30 relative overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              Risk Index Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/60">Calculated Risk Level</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                repo.risk_indicator === "Low" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                repo.risk_indicator === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                "bg-rose-500/10 text-rose-400 border-rose-500/20"
              }`}>
                {repo.risk_indicator}
              </span>
            </div>
            
            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-[11px] text-white/60 leading-normal">
              {repo.risk_indicator === "Low" && (
                "Tests and security scans are fully active with no critical regressions. Merges are smooth, indicating stable codebase ownership."
              )}
              {repo.risk_indicator === "Medium" && (
                "Dependencies require minor upgrades. Documentation index freshness has slipped below 80% on CLI modules."
              )}
              {repo.risk_indicator === "High" && (
                "Critical warnings. Inactive repository with outstanding vulnerability alerts. Recommended to immediately archive or migrate files."
              )}
            </div>
          </CardContent>
        </Card>

        {/* Diagnostic Score Card */}
        <Card className="border border-white/5 bg-surface/30">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Diagnostic Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-4">
            <div className="relative flex items-center justify-center w-32 h-32 mb-4">
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
                  className="text-primary"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * repo.health_score) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  style={{ filter: "drop-shadow(0 0 8px rgba(124,58,237,0.5))" }}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{repo.health_score}</span>
                <span className="text-[10px] text-foreground/40 mt-0.5">HEALTH</span>
              </div>
            </div>
            
            <div className="w-full space-y-2 mt-2">
              <div className="flex justify-between text-xs">
                <span className="text-foreground/60">Documentation Integrity</span>
                <span className="font-semibold text-white">90%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-foreground/60">Security Scan Status</span>
                <span className="font-semibold text-emerald-400">98%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-foreground/60">Test Suite Coverage</span>
                <span className="font-semibold text-white">92%</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
      
    </div>
  )
}
