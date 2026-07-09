"use client"
import React, { useState, useMemo, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, AlertCircle, RefreshCcw } from "lucide-react"

import { RepositoryCard } from "@/components/RepositoryCard"
import { RepositoryList } from "@/components/RepositoryList"
import { RepositoryFilters } from "@/components/RepositoryFilters"
import { RepositorySearch } from "@/components/RepositorySearch"
import { RepositorySelectionFooter } from "@/components/RepositorySelectionFooter"
import { RepositorySkeleton } from "@/components/RepositorySkeleton"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { API_BASE_URL, getToken, setToken } from "@/lib/api"

import type { GitHubRepo, FilterOption, SortOption, GetReposResponse } from "@/types/github"

const steps = [
  { id: 1, name: "Authentication",   status: "complete" },
  { id: 2, name: "Create Workspace", status: "complete" },
  { id: 3, name: "Connect GitHub",   status: "current"  },
  { id: 4, name: "AI Processing",    status: "upcoming" },
  { id: 5, name: "Dashboard",        status: "upcoming" },
]

function ConnectStepper() {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center justify-between w-full">
        {steps.map((step, idx) => (
          <li
            key={step.name}
            className={cn("relative flex items-center", idx !== steps.length - 1 ? "w-full" : "")}
          >
            <div className="flex items-center gap-2.5 shrink-0">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-[1.5px] text-[11px] font-semibold",
                  step.status === "complete" ? "bg-primary border-primary text-white" :
                  step.status === "current"  ? "bg-primary/15 border-primary text-primary" :
                  "bg-white/[0.04] border-white/[0.12] text-white/30"
                )}
              >
                {step.status === "complete" ? <Check className="h-3.5 w-3.5" /> : step.id}
              </span>
              <span
                className={cn(
                  "hidden md:block text-xs font-medium",
                  step.status === "complete" ? "text-white/70" :
                  step.status === "current"  ? "text-primary" : "text-white/30"
                )}
              >
                {step.name}
              </span>
            </div>
            {idx !== steps.length - 1 && (
              <div className="ml-4 mr-4 h-px w-full bg-white/[0.08]">
                {idx < 2 && (
                  <div className="h-full w-full bg-primary" />
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// ── Inner component that uses useSearchParams (must be inside <Suspense>) ──────
function SelectRepositoriesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<FilterOption>("all")
  const [sort, setSort] = useState<SortOption>("updated")
  const [language, setLanguage] = useState("all")
  const [selectedRepos, setSelectedRepos] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<{ login?: string; avatar_url?: string } | null>(null)
  const [tokenReady, setTokenReady] = useState(false)

  // Capture JWT from URL query param (redirected here after OAuth callback)
  useEffect(() => {
    const tokenFromUrl = searchParams?.get("token")
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
      // Remove token from URL bar (security — avoid token leaking in browser history)
      const url = new URL(window.location.href)
      url.searchParams.delete("token")
      window.history.replaceState({}, "", url.toString())
    }
    setTokenReady(true)
  }, [searchParams])

  // Fetch Repos — only after token is ready
  const { data, isLoading, error, refetch } = useQuery<GetReposResponse, Error>({
    queryKey: ["github-repos"],
    queryFn: async () => {
      const token = getToken()
      if (!token) throw new Error("Authentication required")

      const res = await fetch(`${API_BASE_URL}/github/repos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        throw new Error(errData?.error?.message || "Failed to fetch repositories")
      }
      return res.json()
    },
    enabled: tokenReady,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })

  const repos = data?.data?.repositories || []

  // Extract user details from the first repo
  useEffect(() => {
    if (repos.length > 0 && !user) {
      setUser({
        login: repos[0].owner.login,
        avatar_url: repos[0].owner.avatar_url,
      })
    }
  }, [repos, user])

  const availableLanguages = useMemo(() => {
    const langs = new Set<string>()
    repos.forEach((r) => { if (r.language) langs.add(r.language) })
    return Array.from(langs).sort()
  }, [repos])

  const filteredRepos = useMemo(() => {
    let result = [...repos]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (r) => r.name.toLowerCase().includes(q) || (r.description && r.description.toLowerCase().includes(q))
      )
    }
    if (filter === "public") result = result.filter((r) => !r.private)
    if (filter === "private") result = result.filter((r) => r.private)
    if (filter === "forked") result = result.filter((r) => r.fork)
    if (language !== "all") result = result.filter((r) => r.language === language)
    result.sort((a, b) => {
      if (sort === "updated") return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      if (sort === "stars") return b.stargazers_count - a.stargazers_count
      if (sort === "size") return b.size - a.size
      if (sort === "name") return a.name.localeCompare(b.name)
      return 0
    })
    return result
  }, [repos, search, filter, sort, language])

  const handleToggleRepo = (repoFullName: string) => {
    setSelectedRepos((prev) => {
      const next = new Set(prev)
      if (next.has(repoFullName)) next.delete(repoFullName)
      else next.add(repoFullName)
      return next
    })
  }

  const handleSelectAll = (visibleRepos: GitHubRepo[]) => {
    setSelectedRepos((prev) => {
      const next = new Set(prev)
      const allVisibleSelected = visibleRepos.every((r) => next.has(r.full_name))
      if (allVisibleSelected) visibleRepos.forEach((r) => next.delete(r.full_name))
      else visibleRepos.forEach((r) => next.add(r.full_name))
      return next
    })
  }

  const handleClearSelection = () => setSelectedRepos(new Set())

  const handleContinue = async () => {
    if (selectedRepos.size === 0) return
    setIsSubmitting(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE_URL}/github/select-repositories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ repositories: Array.from(selectedRepos) }),
      })
      if (!res.ok) throw new Error("Failed to save selection")
      router.push("/onboarding/ai-processing")
    } catch (err) {
      console.error(err)
      alert("Something went wrong. Please try again.")
      setIsSubmitting(false)
    }
  }

  const totalSelectedSizeKb = useMemo(() => {
    let size = 0
    repos.forEach((r) => { if (selectedRepos.has(r.full_name)) size += r.size })
    return size
  }, [repos, selectedRepos])

  return (
    <>
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Select repositories</h1>
              <p className="text-white/50 text-lg max-w-2xl">
                Choose which repositories RecallIQ should index into your AI knowledge base.
              </p>
            </div>
            {user && (
              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] rounded-full pl-2 pr-4 py-1.5 backdrop-blur-md">
                <img src={user.avatar_url} alt={user.login} className="w-7 h-7 rounded-full border border-white/20" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-white">{user.login}</span>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-500">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <p className="text-[10px] text-white/40 uppercase font-semibold tracking-wider">Connected</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 border-b border-white/10 pb-6">
            <RepositorySearch value={search} onChange={setSearch} />
          </div>
          
          <RepositoryFilters
            filter={filter}
            setFilter={setFilter}
            sort={sort}
            setSort={setSort}
            language={language}
            setLanguage={setLanguage}
            availableLanguages={availableLanguages}
          />
        </motion.div>

        {isLoading ? (
          <RepositorySkeleton />
        ) : error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center max-w-lg mx-auto mt-20">
            <AlertCircle className="w-12 h-12 text-red-500/80 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Failed to load repositories</h3>
            <p className="text-white/60 mb-6 text-sm">{error.message}</p>
            <Button onClick={() => refetch()} variant="outline" className="gap-2">
              <RefreshCcw className="w-4 h-4" /> Try Again
            </Button>
          </div>
        ) : (
          <RepositoryList
            repositories={filteredRepos}
            selectedRepos={selectedRepos}
            onToggleRepo={handleToggleRepo}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
          />
        )}
      </main>

      {!isLoading && !error && (
        <RepositorySelectionFooter
          selectedCount={selectedRepos.size}
          totalSelectedSizeKb={totalSelectedSizeKb}
          onContinue={handleContinue}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  )
}

// ── Page wrapper with Suspense boundary (required for useSearchParams) ─────────
export default function SelectRepositoriesPage() {
  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col font-sans text-foreground">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-40 -right-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Header / Stepper */}
      <header className="relative z-50 w-full border-b border-white/5 bg-[#09090B]/80 backdrop-blur-xl px-6 py-4 sticky top-0">
        <div className="max-w-5xl mx-auto">
          <ConnectStepper />
        </div>
      </header>

      {/* Wrap in Suspense — required by Next.js for useSearchParams() */}
      <Suspense fallback={<RepositorySkeleton />}>
        <SelectRepositoriesContent />
      </Suspense>
    </div>
  )
}
