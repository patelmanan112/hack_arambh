"use client"

import React, { useState } from "react"
import { mockRepositories } from "@/lib/mockData"
import PrsTab from "@/components/dashboard/intelligence/PrsTab"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Database, GitPullRequest, RefreshCw } from "lucide-react"

export default function PrsPage() {
  const [selectedRepoName, setSelectedRepoName] = useState(mockRepositories[0].name)
  const [showRepoDropdown, setShowRepoDropdown] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const activeRepo = mockRepositories.find(r => r.name === selectedRepoName) || mockRepositories[0]

  const handleSync = () => {
    setIsSyncing(true)
    setTimeout(() => setIsSyncing(false), 1500)
  }

  return (
    <div className="flex flex-col gap-6 pb-12 animate-in fade-in duration-500">
      
      {/* Header Selector Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">RecallIQ Pull Requests</span>
          
          {/* Custom Repository Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => setShowRepoDropdown(!showRepoDropdown)}
              className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold text-xl tracking-tight px-4 py-2 rounded-xl transition-all cursor-pointer shadow-lg shadow-black/30"
            >
              <Database className="w-5 h-5 text-primary" />
              <span>{activeRepo.full_name}</span>
              <ChevronDownIcon className="w-4.5 h-4.5 text-white/50 ml-1.5" />
            </button>
            
            {showRepoDropdown && (
              <div className="absolute left-0 mt-2 w-72 rounded-xl border border-white/10 bg-[#0c0c0e] shadow-2xl z-50 p-2 overflow-hidden backdrop-blur-2xl">
                <div className="text-[10px] font-bold text-white/30 px-3 py-1.5 uppercase tracking-wider">Select Repository</div>
                {mockRepositories.map((repo) => (
                  <button
                    key={repo.id}
                    onClick={() => {
                      setSelectedRepoName(repo.name)
                      setShowRepoDropdown(false)
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between group ${
                      selectedRepoName === repo.name 
                        ? "bg-primary text-white" 
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="font-medium truncate max-w-[80%]">{repo.full_name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      selectedRepoName === repo.name 
                        ? "bg-white/20 text-white" 
                        : "bg-white/5 text-white/40 group-hover:text-white/60"
                    }`}>
                      {repo.language}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSync}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-xs text-white font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing..." : "Sync PR Data"}
          </button>
        </div>
      </div>

      {/* Render the PR analytics view panel */}
      <PrsTab repo={activeRepo} />

    </div>
  )
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
