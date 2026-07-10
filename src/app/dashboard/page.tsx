"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  mockRepositories, 
  aiExecutiveSummary, 
  contributorIntelligence, 
  repositoryHealth, 
  recentTimeline, 
  aiInsights,
  ExtendedRepo
} from "@/lib/mockData"
import { HealthScore } from "@/components/dashboard/HealthScore"
import { OverviewStats } from "@/components/dashboard/OverviewStats"
import { RuntimeStatus } from "@/components/dashboard/RuntimeStatus"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Progress } from "@/components/ui/Progress"
import { 
  Sparkles, Search, Filter, RefreshCw, GitBranch, 
  FolderGit2, Star, GitFork, CircleDot, Clock, Lock, Globe, 
  FileText, Users, Play, ShieldAlert, ArrowRight, Zap, Check, 
  ChevronRight, ExternalLink, Download, MessageSquare, AlertTriangle,
  Lightbulb, ShieldCheck, Heart, Pin, HeartHandshake, Eye, BarChart2
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Sparkline SVG Component for repository activity
function Sparkline({ data, stroke = "#7C3AED" }: { data: number[]; stroke?: string }) {
  const width = 120
  const height = 32
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((val - min) / range) * (height - 6) - 3 // pad 3px top/bottom
    return `${x},${y}`
  }).join(" ")
  
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}

export default function DashboardPage() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [selectedHealth, setSelectedHealth] = useState("all")
  const [selectedRisk, setSelectedRisk] = useState("all")
  const [showPinnedOnly, setShowPinnedOnly] = useState(false)
  const [favorites, setFavorites] = useState<Set<number>>(new Set([1])) // Default recall-iq-app
  const [pinnedRepos, setPinnedRepos] = useState<Set<number>>(new Set([1, 2])) // Pinned by default
  const [isSyncing, setIsSyncing] = useState(false)

  // Sync animation handler
  const handleSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
    }, 2000)
  }

  // Filter Logic
  const filteredRepositories = useMemo(() => {
    return mockRepositories.filter((repo) => {
      const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesLanguage = selectedLanguage === "all" || repo.language === selectedLanguage
      
      const matchesHealth = selectedHealth === "all" || 
        (selectedHealth === "high" && repo.health_score >= 90) ||
        (selectedHealth === "medium" && repo.health_score >= 75 && repo.health_score < 90) ||
        (selectedHealth === "low" && repo.health_score < 75)

      const matchesRisk = selectedRisk === "all" || repo.risk_indicator === selectedRisk
      const matchesPinned = !showPinnedOnly || pinnedRepos.has(repo.id)

      return matchesSearch && matchesLanguage && matchesHealth && matchesRisk && matchesPinned
    })
  }, [searchQuery, selectedLanguage, selectedHealth, selectedRisk, showPinnedOnly, pinnedRepos])

  // Get unique languages for filter dropdown
  const uniqueLanguages = useMemo(() => {
    const langs = new Set<string>()
    mockRepositories.forEach(r => r.language && langs.add(r.language))
    return Array.from(langs)
  }, [])

  // Favorite toggle helper
  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const next = new Set(favorites)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setFavorites(next)
  }

  // Pinned toggle helper
  const togglePinned = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const next = new Set(pinnedRepos)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setPinnedRepos(next)
  }

  return (
    <div className="flex flex-col gap-8 pb-16">
      
      {/* 1. HERO SECTION: 12-Column Grid for AI Summary + Health Score */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* AI Executive Summary: Visually Dominant (8 columns) */}
        <Card className="lg:col-span-8 relative overflow-hidden flex flex-col justify-between group bg-gradient-to-br from-surface/60 via-surface/40 to-primary/5 border border-white/5 shadow-2xl h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/5 rounded-full blur-[60px] pointer-events-none" />
          
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-widest bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                AI Executive Summary
              </span>
              <span className="text-xs text-foreground/40">
                Freshness Index: 98%
              </span>
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight text-white leading-tight mt-4 text-glow max-w-2xl">
              "Repository activity increased by 24% this week. Authentication work accounts for 41% of commits."
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-2 flex flex-col gap-6">
            <p className="text-foreground/75 leading-relaxed text-sm max-w-3xl">
              Documentation quality decreased slightly (-5%). Three pull requests require urgent review to unblock staging. 
              Overall engineering health improved from <span className="text-primary font-bold">84</span> to <span className="text-emerald-400 font-bold">91</span> following 
              reductions in PR code footprint size. Caching systems remain fully optimal.
            </p>
            
            {/* Quick Metrics Cards inside Executive Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-2">
              {aiExecutiveSummary.metrics.map((metric) => (
                <div key={metric.label} className="bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl p-3 flex flex-col justify-between transition-colors">
                  <span className="text-[10px] text-foreground/40 leading-normal font-medium tracking-wide uppercase">
                    {metric.label}
                  </span>
                  <span className={`text-base font-bold mt-1.5 ${
                    metric.positive ? "text-emerald-400" : "text-amber-400"
                  }`}>
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-4 border-t border-white/5 pt-4">
              <Link href="/dashboard/copilot" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white border-none shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all">
                  <MessageSquare className="w-4 h-4 mr-2" /> Ask RecallIQ AI
                </Button>
              </Link>
              <Link href="/dashboard/intelligence" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-white/10 bg-white/5 text-white hover:bg-white/10">
                  Deep Dive Analytics <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Engineering Health Score (4 columns) */}
        <HealthScore />
      </div>

      {/* 2. METRIC OVERVIEW ROW (Reusing existing components/stats but keeping standard structure) */}
      <OverviewStats />

      {/* 3. QUICK ACTIONS BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-surface/30 backdrop-blur-xl">
        <div className="flex items-center gap-2 shrink-0">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Quick Actions</span>
        </div>
        <div className="flex w-full sm:w-auto overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 gap-2 hide-scrollbar">
          <Link href="/dashboard/intelligence">
            <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 text-xs text-white">
              <BarChart2 className="w-3.5 h-3.5 mr-1.5 text-primary" />
              Analyze Repository
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 text-xs text-white" onClick={() => alert("Report generation started...")}>
            <FileText className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
            Generate Engineering Report
          </Button>
          <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 text-xs text-white" onClick={() => window.open("https://github.com", "_blank")}>
            <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-foreground/60" />
            Open GitHub
          </Button>
          <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 text-xs text-white" onClick={handleSync}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-emerald-400 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing..." : "Sync & Refresh"}
          </Button>
          <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 text-xs text-white" onClick={() => alert("Exported JSON metadata report.")}>
            <Download className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
            Export Data
          </Button>
        </div>
      </div>

      {/* 4. REPOSITORY SEARCH & LIST SECTION */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-primary" />
              Active Workspace Repositories
            </h2>
            <p className="text-xs text-foreground/50 mt-1">
              Search and filter repositories currently imported into your AI memory cache.
            </p>
          </div>
          
          {/* Quick filter checkboxes */}
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

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white/[0.01] border border-white/5 p-3 rounded-xl">
          {/* Text Search */}
          <div className="relative col-span-1 sm:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
            <input
              type="text"
              placeholder="Instant Search by repo name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-white/15 hover:border-white/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-all"
            />
          </div>

          {/* Language Selector */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-surface border border-white/15 hover:border-white/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg px-3 py-2 text-sm text-foreground/80 outline-none transition-all cursor-pointer appearance-none"
            >
              <option value="all">Language: All</option>
              {uniqueLanguages.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Health Score Selector */}
          <div className="relative">
            <select
              value={selectedHealth}
              onChange={(e) => setSelectedHealth(e.target.value)}
              className="w-full bg-surface border border-white/15 hover:border-white/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg px-3 py-2 text-sm text-foreground/80 outline-none transition-all cursor-pointer appearance-none"
            >
              <option value="all">Health Score: All</option>
              <option value="high">Health: High (90+)</option>
              <option value="medium">Health: Medium (75-89)</option>
              <option value="low">Health: Critical (&lt;75)</option>
            </select>
          </div>
        </div>

        {/* Repository Cards Grid */}
        {filteredRepositories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <FolderGit2 className="w-12 h-12 text-foreground/20 mb-4" />
            <h3 className="text-lg font-medium text-white">No repositories match your criteria</h3>
            <p className="text-xs text-foreground/40 max-w-sm mt-1">
              Try adjusting your filters or clearing the search query to find your repository.
            </p>
            <Button variant="outline" size="sm" className="mt-4 border-white/10 hover:bg-white/5" onClick={() => {
              setSearchQuery("")
              setSelectedLanguage("all")
              setSelectedHealth("all")
              setSelectedRisk("all")
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
                  {pinnedRepos.has(repo.id) && (
                    <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                      <div className="absolute transform rotate-45 bg-primary/20 text-primary border-b border-primary/20 text-[9px] font-bold text-center py-0.5 w-24 -right-6 top-3">
                        PINNED
                      </div>
                    </div>
                  )}

                  <CardContent className="p-6">
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={repo.owner.avatar_url}
                          alt={repo.owner.login}
                          className="w-5 h-5 rounded-full shrink-0"
                        />
                        <span className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
                          {repo.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 relative z-10">
                        <button 
                          onClick={(e) => togglePinned(repo.id, e)}
                          className={`p-1.5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors ${
                            pinnedRepos.has(repo.id) ? "text-primary bg-primary/10" : "text-white/40 hover:text-white"
                          }`}
                          title="Pin Repository"
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => toggleFavorite(repo.id, e)}
                          className={`p-1.5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors ${
                            favorites.has(repo.id) ? "text-rose-400 bg-rose-500/10 border-rose-500/10" : "text-white/40 hover:text-white"
                          }`}
                          title="Add to Favorites"
                        >
                          <Heart className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                      {repo.language && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-foreground/70 border border-white/5">
                          {repo.language}
                        </span>
                      )}
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-semibold border flex items-center gap-1",
                        repo.health_score >= 90 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        repo.health_score >= 75 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                        "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      )}>
                        Health: {repo.health_score}%
                      </span>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-semibold border",
                        repo.risk_indicator === "Low" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        repo.risk_indicator === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                        "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      )}>
                        Risk: {repo.risk_indicator}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-foreground/50 border border-white/5">
                        {repo.private ? <Lock className="w-2.5 h-2.5 inline mr-1" /> : <Globe className="w-2.5 h-2.5 inline mr-1" />}
                        {repo.private ? "Private" : "Public"}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-white/50 mb-4 line-clamp-2 leading-relaxed min-h-[32px]">
                      {repo.description || "No description provided."}
                    </p>

                    {/* AI Summary Section */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5 mb-4 text-[11px] leading-normal text-foreground/70 italic border-l-2 border-l-primary/60">
                      <span className="font-semibold text-primary not-italic inline-flex items-center gap-0.5 mr-1">
                        <Sparkles className="w-3 h-3" /> RecallIQ AI:
                      </span>
                      "{repo.ai_summary}"
                    </div>

                    {/* Repo metrics counts row */}
                    <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-3 text-[11px] text-white/40">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        <span>Stars: <b>{repo.stargazers_count}</b></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" />
                        <span>Forks: <b>{repo.forks_count}</b></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>Devs: <b>{repo.contributors_count}</b></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CircleDot className="w-3 h-3 text-amber-500" />
                        <span>Issues: <b>{repo.open_issues_count}</b></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitBranch className="w-3 h-3 text-blue-400" />
                        <span>Branch: <b>{repo.default_branch}</b></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>Pushed: <b>{repo.updated_at.includes("T") ? "2h ago" : repo.updated_at}</b></span>
                      </div>
                    </div>

                    {/* Latest Commit Snippet */}
                    <div className="bg-black/30 border border-white/5 rounded-lg p-2 mt-3.5 text-[10px] text-white/50 flex flex-col gap-1">
                      <div className="flex justify-between items-center text-white/30">
                        <span>LATEST COMMIT</span>
                        <span className="font-mono">{repo.latest_commit.sha}</span>
                      </div>
                      <span className="truncate text-white/70 font-medium">"{repo.latest_commit.message}"</span>
                      <span className="text-[9px]">by {repo.latest_commit.author} • {repo.latest_commit.date.includes("T") ? "2h ago" : repo.latest_commit.date}</span>
                    </div>

                    {/* Activity sparkline + button */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-3.5 mt-3.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] text-white/30 uppercase font-medium">Repository Activity</span>
                        <Sparkline data={repo.repository_activity} stroke={repo.health_score >= 90 ? "#10B981" : "#7C3AED"} />
                      </div>
                      
                      <Link href={`/dashboard/intelligence?repo=${repo.name}`}>
                        <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/5 h-8 text-xs px-3">
                          Analytics <ChevronRight className="w-3 h-3 ml-0.5" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 5. SPLIT SECTION LAYOUT: Left (8 columns) Health Cards & Leaderboard | Right (4 columns) Timeline & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: 8 Columns */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Repository Health Cards */}
          <Card className="border border-white/5 bg-surface/30">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-rose-500" />
                Repository Health Diagnostics
              </CardTitle>
              <CardDescription className="text-foreground/50">
                Detailed metrics diagnosing the quality framework and architectural stability.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {repositoryHealth.map((health) => {
                  const isLow = health.score < 80;
                  const isMedium = health.score >= 80 && health.score < 90;
                  const isHigh = health.score >= 90;
                  
                  return (
                    <div key={health.title} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/10 transition-all flex flex-col gap-3 group">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white">{health.title}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                            health.trend.includes("+") || health.trend.includes("Stable")
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-rose-500/10 text-rose-400"
                          }`}>
                            {health.trend}
                          </span>
                          <span className={`text-sm font-bold ${
                            isHigh ? "text-emerald-400" : isMedium ? "text-amber-400" : "text-rose-400"
                          }`}>
                            {health.score}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            isHigh ? "bg-emerald-500" : isMedium ? "bg-amber-500" : "bg-rose-500"
                          )} 
                          style={{ width: `${health.score}%` }} 
                        />
                      </div>
                      
                      <p className="text-[11px] text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
                        <b>Advice:</b> {health.recommendation}
                      </p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Contributor Intelligence Leaderboard */}
          <Card className="border border-white/5 bg-surface/30">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Contributor Intelligence Leaderboard
              </CardTitle>
              <CardDescription className="text-foreground/50">
                Activity score, streaks, and AI-predicted development productivity indicators.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contributorIntelligence.map((dev, i) => (
                  <div key={dev.name} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all gap-4 group">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={dev.avatarUrl}
                          alt={dev.name}
                          className="w-10 h-10 rounded-full object-cover border border-white/10 group-hover:border-primary transition-colors"
                        />
                        {i === 0 && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-background flex items-center justify-center text-[8px] font-black text-black">
                            👑
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                          {dev.name}
                        </h4>
                        <span className="text-xs text-foreground/50">{dev.role}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-center shrink-0">
                      <div>
                        <span className="block text-[10px] text-white/30 uppercase">Commits</span>
                        <span className="text-sm font-bold text-white mt-0.5 block">{dev.commits}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-white/30 uppercase">PRs</span>
                        <span className="text-sm font-bold text-white mt-0.5 block">{dev.prs}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-white/30 uppercase">Reviews</span>
                        <span className="text-sm font-bold text-white mt-0.5 block">{dev.reviews}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-white/30 uppercase">Issues</span>
                        <span className="text-sm font-bold text-white mt-0.5 block">{dev.issuesClosed}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between sm:justify-end">
                      <div className="text-right shrink-0">
                        <div className="text-[9px] text-white/30 uppercase font-medium">Activity Streak</div>
                        <div className="text-xs font-bold text-emerald-400 mt-0.5 flex items-center gap-1 justify-end">
                          🔥 {dev.streak} days
                        </div>
                      </div>

                      <div className="text-right shrink-0 min-w-[70px]">
                        <div className="text-[9px] text-white/30 uppercase font-medium">AI Prod Score</div>
                        <div className="text-sm font-black text-primary mt-0.5 tracking-tight">
                          {dev.aiProductivityScore}%
                        </div>
                      </div>

                      <div className="hidden sm:block shrink-0">
                        <Sparkline data={dev.trend} stroke="#10B981" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: 4 Columns */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Recent Activity Timeline */}
          <Card className="border border-white/5 bg-surface/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                Recent Engineering Activity
              </CardTitle>
              <CardDescription className="text-foreground/50">
                Live chronological updates across GitHub & CI/CD
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-white/10 ml-3 space-y-6 pb-2">
                {recentTimeline.map((event) => (
                  <div key={event.id} className="relative pl-6 group">
                    <span className="absolute -left-[11px] top-1.5 h-5 w-5 rounded-full bg-[#000000] border border-white/20 flex items-center justify-center group-hover:border-primary transition-colors z-10">
                      <event.icon className={`h-3 w-3 ${event.color}`} />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-relaxed">
                        {event.title}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-foreground/40 mt-1">
                        <span>by {event.author}</span>
                        <span>•</span>
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/timeline" className="block text-center mt-4">
                <Button variant="outline" size="sm" className="w-full border-white/10 hover:bg-white/5 text-xs text-white">
                  View Full Timeline <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* AI Runtime Status */}
          <RuntimeStatus />
        </div>

      </div>

    </div>
  )
}
