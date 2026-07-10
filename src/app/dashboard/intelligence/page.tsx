"use client"

import React, { useState, useEffect, Suspense } from "react"
import dynamic from "next/dynamic"
import { useSearchParams, useRouter } from "next/navigation"
import { mockRepositories } from "@/lib/mockData"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { 
  Database, GitBranch, GitPullRequest, CircleDot, 
  Users, Code2, History, Zap, Sparkles, ChevronDown, 
  HelpCircle, AlertCircle, RefreshCw
} from "lucide-react"

// Elegant Skeleton Loader for Lazy-Loaded Tabs
function TabSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 bg-white/5 w-1/4 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-32 bg-white/5 rounded-xl" />
        <div className="h-32 bg-white/5 rounded-xl" />
        <div className="h-32 bg-white/5 rounded-xl" />
      </div>
      <div className="h-80 bg-white/5 rounded-xl" />
    </div>
  )
}

// Lazy Load Tab Components
const OverviewTab = dynamic(() => import("@/components/dashboard/intelligence/OverviewTab"), {
  loading: () => <TabSkeleton />,
  ssr: false
})
const CommitsTab = dynamic(() => import("@/components/dashboard/intelligence/CommitsTab"), {
  loading: () => <TabSkeleton />,
  ssr: false
})
const PrsTab = dynamic(() => import("@/components/dashboard/intelligence/PrsTab"), {
  loading: () => <TabSkeleton />,
  ssr: false
})
const IssuesTab = dynamic(() => import("@/components/dashboard/intelligence/IssuesTab"), {
  loading: () => <TabSkeleton />,
  ssr: false
})
const ContributorsTab = dynamic(() => import("@/components/dashboard/intelligence/ContributorsTab"), {
  loading: () => <TabSkeleton />,
  ssr: false
})
const LanguagesTab = dynamic(() => import("@/components/dashboard/intelligence/LanguagesTab"), {
  loading: () => <TabSkeleton />,
  ssr: false
})
const BranchesTab = dynamic(() => import("@/components/dashboard/intelligence/BranchesTab"), {
  loading: () => <TabSkeleton />,
  ssr: false
})
const ReleasesTab = dynamic(() => import("@/components/dashboard/intelligence/ReleasesTab"), {
  loading: () => <TabSkeleton />,
  ssr: false
})
const AiInsightsTab = dynamic(() => import("@/components/dashboard/intelligence/AiInsightsTab"), {
  loading: () => <TabSkeleton />,
  ssr: false
})

function IntelligenceContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // States
  const [selectedRepoName, setSelectedRepoName] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [showRepoDropdown, setShowRepoDropdown] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  // Initialize selected repo from query params or default
  useEffect(() => {
    const repoParam = searchParams?.get("repo")
    if (repoParam && mockRepositories.some(r => r.name === repoParam)) {
      setSelectedRepoName(repoParam)
    } else {
      setSelectedRepoName(mockRepositories[0].name) // Default to first
    }
  }, [searchParams])

  // Get active repo metadata object
  const activeRepo = mockRepositories.find(r => r.name === selectedRepoName) || mockRepositories[0]

  const tabs = [
    { id: "overview", label: "Overview", icon: Database },
    { id: "commits", label: "Commits", icon: History },
    { id: "prs", label: "Pull Requests", icon: GitPullRequest },
    { id: "issues", label: "Issues", icon: CircleDot },
    { id: "contributors", label: "Contributors", icon: Users },
    { id: "languages", label: "Languages", icon: Code2 },
    { id: "branches", label: "Branches", icon: GitBranch },
    { id: "releases", label: "Releases", icon: Zap },
    { id: "ai-insights", label: "AI Insights", icon: Sparkles }
  ]

  const handleRepoSelect = (name: string) => {
    setSelectedRepoName(name)
    setShowRepoDropdown(false)
    // Update URL query parameters
    const params = new URLSearchParams(window.location.search)
    params.set("repo", name)
    router.replace(`/dashboard/intelligence?${params.toString()}`)
  }

  const handleSync = () => {
    setIsSyncing(true)
    setTimeout(() => setIsSyncing(false), 1500)
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Header Selector Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">RecallIQ Intelligence</span>
          
          {/* Custom Repository Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => setShowRepoDropdown(!showRepoDropdown)}
              className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold text-2xl tracking-tight px-4 py-2 rounded-xl transition-all cursor-pointer shadow-lg shadow-black/30"
            >
              <Database className="w-6 h-6 text-primary" />
              <span>{activeRepo.full_name}</span>
              <ChevronDown className="w-5 h-5 text-white/50 ml-2" />
            </button>
            
            {showRepoDropdown && (
              <div className="absolute left-0 mt-2 w-72 rounded-xl border border-white/10 bg-[#0c0c0e] shadow-2xl z-50 p-2 overflow-hidden backdrop-blur-2xl">
                <div className="text-[10px] font-bold text-white/30 px-3 py-1.5 uppercase tracking-wider">Select Repository</div>
                {mockRepositories.map((repo) => (
                  <button
                    key={repo.id}
                    onClick={() => handleRepoSelect(repo.name)}
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
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            className="border-white/10 hover:bg-white/5 text-xs text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-emerald-400 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Refreshing Sync..." : "Sync Repository"}
          </Button>
          <span className="text-[10px] text-white/40 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg">
            Last Sync: 2m ago
          </span>
        </div>
      </div>

      {/* Tabs Switcher Navigation */}
      <div className="flex items-center border-b border-white/5 pb-px overflow-x-auto hide-scrollbar">
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all relative whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? "border-primary text-white" 
                    : "border-transparent text-white/50 hover:text-white/80"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${isActive ? "text-primary animate-pulse" : "text-white/40"}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Lazy-Loaded Tab View Panels */}
      <div className="mt-4">
        {activeTab === "overview" && <OverviewTab repo={activeRepo} />}
        {activeTab === "commits" && <CommitsTab repo={activeRepo} />}
        {activeTab === "prs" && <PrsTab repo={activeRepo} />}
        {activeTab === "issues" && <IssuesTab repo={activeRepo} />}
        {activeTab === "contributors" && <ContributorsTab repo={activeRepo} />}
        {activeTab === "languages" && <LanguagesTab repo={activeRepo} />}
        {activeTab === "branches" && <BranchesTab repo={activeRepo} />}
        {activeTab === "releases" && <ReleasesTab repo={activeRepo} />}
        {activeTab === "ai-insights" && <AiInsightsTab repo={activeRepo} />}
      </div>

    </div>
  )
}

export default function IntelligencePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white/50 animate-pulse">Loading RecallIQ Intelligence...</div>}>
      <IntelligenceContent />
    </Suspense>
  )
}
