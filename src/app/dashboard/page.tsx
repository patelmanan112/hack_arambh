"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { dashboardApi } from "@/lib/api"
import { useWorkspace } from "@/context/WorkspaceContext"

import { HealthScore } from "@/components/dashboard/HealthScore"
import { OverviewStats } from "@/components/dashboard/OverviewStats"
import { RuntimeStatus } from "@/components/dashboard/RuntimeStatus"
import { ChartsGroup } from "@/components/dashboard/ChartsGroup"
import { ActivityFeeds } from "@/components/dashboard/ActivityFeeds"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Progress } from "@/components/ui/Progress"
import { Skeleton } from "@/components/ui/Skeleton"
import { 
  Sparkles, Search, Filter, RefreshCw, GitBranch, 
  FolderGit2, Star, GitFork, CircleDot, Clock, Lock, Globe, 
  FileText, Users, Play, ShieldAlert, ArrowRight, Zap, Check, 
  ChevronRight, ExternalLink, Download, MessageSquare, AlertTriangle,
  Lightbulb, ShieldCheck, Heart, Pin, HeartHandshake, Eye, BarChart2,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const { workspaceId, isHydrated } = useWorkspace()
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [selectedHealth, setSelectedHealth] = useState("all")
  const [showPinnedOnly, setShowPinnedOnly] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [pinnedRepos, setPinnedRepos] = useState<Set<string>>(new Set())
  const [isSyncing, setIsSyncing] = useState(false)

  // Fetch Dashboard Data
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard", workspaceId],
    queryFn: () => dashboardApi.getWorkspaceDashboard(workspaceId!),
    enabled: isHydrated && !!workspaceId,
    staleTime: 30000,
  })

  const handleSync = async () => {
    setIsSyncing(true)
    await refetch()
    setIsSyncing(false)
  }

  const dashboardData = data

  // Filter Logic
  const filteredRepositories = useMemo(() => {
    if (!dashboardData?.repositories) return []
    return dashboardData.repositories.filter((repo) => {
      const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesLanguage = selectedLanguage === "all" || repo.language === selectedLanguage
      
      const matchesHealth = selectedHealth === "all" || 
        (selectedHealth === "high" && repo.healthScore >= 90) ||
        (selectedHealth === "medium" && repo.healthScore >= 75 && repo.healthScore < 90) ||
        (selectedHealth === "low" && repo.healthScore < 75)

      const matchesPinned = !showPinnedOnly || pinnedRepos.has(repo.id)

      return matchesSearch && matchesLanguage && matchesHealth && matchesPinned
    })
  }, [dashboardData?.repositories, searchQuery, selectedLanguage, selectedHealth, showPinnedOnly, pinnedRepos])

  const uniqueLanguages = useMemo(() => {
    if (!dashboardData?.repositories) return []
    const langs = new Set<string>()
    dashboardData.repositories.forEach(r => r.language && langs.add(r.language))
    return Array.from(langs)
  }, [dashboardData?.repositories])

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const next = new Set(favorites)
    next.has(id) ? next.delete(id) : next.add(id)
    setFavorites(next)
  }

  const togglePinned = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const next = new Set(pinnedRepos)
    next.has(id) ? next.delete(id) : next.add(id)
    setPinnedRepos(next)
  }

  if (!isHydrated) return null

  if (!workspaceId) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <FolderGit2 className="w-16 h-16 text-foreground/20" />
        <h2 className="text-2xl font-bold">No Workspace Selected</h2>
        <p className="text-foreground/50">Please create or select a workspace to view the dashboard.</p>
        <Link href="/onboarding">
          <Button>Setup Workspace</Button>
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-64 bg-surface/30 rounded-xl"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-surface/30 rounded-xl"></div>)}
        </div>
        <div className="h-96 bg-surface/30 rounded-xl"></div>
      </div>
    )
  }

  if (isError || !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
        <AlertCircle className="w-16 h-16 text-rose-500" />
        <h2 className="text-2xl font-bold">Error Loading Dashboard</h2>
        <p className="text-foreground/50 max-w-md">{error?.message || "Failed to load dashboard data."}</p>
        <Button onClick={() => refetch()} variant="outline">Try Again</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 pb-16">
      
      {/* 1. HERO SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <Card className="lg:col-span-8 relative overflow-hidden flex flex-col justify-between group bg-gradient-to-br from-surface/60 via-surface/40 to-primary/5 border border-white/5 shadow-2xl h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/5 rounded-full blur-[60px] pointer-events-none" />
          
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-widest bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                Workspace Intelligence
              </span>
              <span className="text-xs text-foreground/40">
                Freshness Index: 98%
              </span>
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight text-white leading-tight mt-4 text-glow max-w-2xl">
              "Analyzing {dashboardData.overview.repositoryCount} repositories with {dashboardData.overview.commitCount} commits."
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-2 flex flex-col gap-6">
            <p className="text-foreground/75 leading-relaxed text-sm max-w-3xl">
              Your workspace health score is <span className="text-primary font-bold">{dashboardData.overview.healthScore}</span>. 
              Active contributors: {dashboardData.overview.contributorCount}. Open Issues: {dashboardData.overview.issueCount}.
            </p>
            
            <div className="flex items-center gap-3 mt-4 border-t border-white/5 pt-4">
              <Link href="/dashboard/copilot" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white border-none shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all">
                  <MessageSquare className="w-4 h-4 mr-2" /> Ask RecallIQ AI
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Health Score */}
        <div className="lg:col-span-4">
          <HealthScore score={dashboardData.overview.healthScore} />
        </div>
      </div>

      {/* 2. METRIC OVERVIEW ROW */}
      <OverviewStats overview={dashboardData.overview} />

      {/* 3. QUICK ACTIONS BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-surface/30 backdrop-blur-xl">
        <div className="flex items-center gap-2 shrink-0">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Quick Actions</span>
        </div>
        <div className="flex w-full sm:w-auto overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 gap-2 hide-scrollbar">
          <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 text-xs text-white" onClick={handleSync}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-emerald-400 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing..." : "Sync & Refresh"}
          </Button>
        </div>
      </div>

      {/* CHARTS */}
      <ChartsGroup data={dashboardData.charts} />

      {/* ACTIVITY FEEDS */}
      <ActivityFeeds activity={dashboardData.recentActivity} />

      {/* 4. REPOSITORY SEARCH & LIST SECTION */}
      <div className="space-y-6 mt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-primary" />
              Active Workspace Repositories
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowPinnedOnly(!showPinnedOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                showPinnedOnly 
                  ? "bg-primary/20 border-primary text-white" 
                  : "bg-white/5 border-white/10 text-white/60 hover:text-white"
              }`}
            >
              <Pin className="w-3.5 h-3.5" />
              Pinned ({pinnedRepos.size})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/[0.01] border border-white/5 p-3 rounded-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by repo name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-white/15 hover:border-white/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-surface border border-white/15 hover:border-white/20 focus:border-primary/50 rounded-lg px-3 py-2 text-sm text-foreground/80 outline-none cursor-pointer appearance-none"
            >
              <option value="all">Language: All</option>
              {uniqueLanguages.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <select
              value={selectedHealth}
              onChange={(e) => setSelectedHealth(e.target.value)}
              className="w-full bg-surface border border-white/15 hover:border-white/20 focus:border-primary/50 rounded-lg px-3 py-2 text-sm text-foreground/80 outline-none cursor-pointer appearance-none"
            >
              <option value="all">Health Score: All</option>
              <option value="high">Health: High (90+)</option>
              <option value="medium">Health: Medium (75-89)</option>
              <option value="low">Health: Critical (&lt;75)</option>
            </select>
          </div>
        </div>

        {filteredRepositories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <FolderGit2 className="w-12 h-12 text-foreground/20 mb-4" />
            <h3 className="text-lg font-medium text-white">No repositories match your criteria</h3>
            <Button variant="outline" size="sm" className="mt-4 border-white/10 hover:bg-white/5" onClick={() => {
              setSearchQuery("")
              setSelectedLanguage("all")
              setSelectedHealth("all")
              setShowPinnedOnly(false)
            }}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredRepositories.map((repo, idx) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group relative rounded-xl border border-white/5 bg-surface/30 hover:bg-surface/50 hover:border-white/15 transition-all duration-300 shadow-md flex flex-col justify-between overflow-hidden"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
                          {repo.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={(e) => togglePinned(repo.id, e)} className={`p-1.5 rounded-lg border border-white/5 hover:bg-white/10 ${pinnedRepos.has(repo.id) ? "text-primary bg-primary/10" : "text-white/40"}`}><Pin className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                      {repo.language && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-foreground/70 border border-white/5">
                          {repo.language}
                        </span>
                      )}
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-semibold border flex items-center gap-1",
                        repo.healthScore >= 90 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        repo.healthScore >= 75 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                        "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      )}>
                        Health: {repo.healthScore}%
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-3 text-[11px] text-white/40">
                      <div className="flex items-center gap-1"><Star className="w-3 h-3" /><span><b>{repo.stargazersCount}</b></span></div>
                      <div className="flex items-center gap-1"><GitFork className="w-3 h-3" /><span><b>{repo.forksCount}</b></span></div>
                      <div className="flex items-center gap-1"><CircleDot className="w-3 h-3" /><span><b>{repo.openIssuesCount}</b></span></div>
                    </div>
                  </CardContent>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
