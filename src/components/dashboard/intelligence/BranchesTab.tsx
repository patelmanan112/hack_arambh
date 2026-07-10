"use client"

import React from "react"
import { ExtendedRepo } from "@/lib/mockData"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { GitBranch, GitPullRequest, Clock, Check, ArrowLeftRight, Trash2 } from "lucide-react"

interface TabProps {
  repo: ExtendedRepo
}

const mockBranches = [
  { name: "main", ahead: 0, behind: 0, latestCommit: "feat: integrate cascadeflow v2 vector agent sync", author: "Manan", date: "2h ago", activePr: false },
  { name: "develop", ahead: 4, behind: 0, latestCommit: "refactor: design component library layout tokens", author: "Rahul", date: "1d ago", activePr: true, prTitle: "Merge develop to main" },
  { name: "feature/auth-refresh", ahead: 2, behind: 12, latestCommit: "fix: reduce retry backoff multiplier in vector DB pipeline", author: "Aman", date: "3d ago", activePr: true, prTitle: "Fix JWT expiration" },
  { name: "feature/actions-cache", ahead: 1, behind: 15, latestCommit: "chore: update node versions in actions config", author: "Sarah", date: "5d ago", activePr: false }
]

export default function BranchesTab({ repo }: TabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <Card className="border border-white/5 bg-surface/30">
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-white/70 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-primary" />
            Repository Branches
          </CardTitle>
          <CardDescription className="text-xs text-white/40">Active development branches and synchronization state relative to <b>{repo.default_branch}</b></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockBranches.map((branch) => {
              const isMain = branch.name === repo.default_branch
              
              return (
                <div 
                  key={branch.name}
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-white group-hover:text-primary transition-colors font-mono">
                        {branch.name}
                      </span>
                      {isMain && (
                        <span className="text-[9px] px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/20 font-bold">
                          DEFAULT
                        </span>
                      )}
                      {branch.activePr && (
                        <span className="text-[9px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold flex items-center gap-0.5">
                          <GitPullRequest className="w-2.5 h-2.5" /> PR ACTIVE
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-white/40 mt-2 flex-wrap">
                      <span className="truncate">"{branch.latestCommit}"</span>
                      <span>•</span>
                      <span>by {branch.author}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {branch.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end shrink-0">
                    {/* Ahead / Behind stats */}
                    <div className="flex items-center gap-3 text-xs">
                      <div className="text-right">
                        <span className="text-[10px] text-white/30 block uppercase">Ahead</span>
                        <span className={`font-bold mt-0.5 block ${branch.ahead > 0 ? "text-emerald-400" : "text-white/40"}`}>
                          {branch.ahead}
                        </span>
                      </div>
                      <div className="w-px h-6 bg-white/10" />
                      <div className="text-right">
                        <span className="text-[10px] text-white/30 block uppercase">Behind</span>
                        <span className={`font-bold mt-0.5 block ${branch.behind > 0 ? "text-amber-500" : "text-white/40"}`}>
                          {branch.behind}
                        </span>
                      </div>
                    </div>

                    {/* Actions buttons */}
                    <div className="flex items-center gap-2">
                      {branch.activePr ? (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs px-3">
                          View PR
                        </Button>
                      ) : !isMain ? (
                        <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/5 h-8 text-xs px-3">
                          <GitPullRequest className="w-3.5 h-3.5 mr-1.5" /> Open PR
                        </Button>
                      ) : (
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded">
                          <Check className="w-3 h-3" /> Synced
                        </span>
                      )}

                      {!isMain && (
                        <button 
                          className="p-2 rounded-lg border border-transparent text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete Branch"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
