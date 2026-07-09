"use client"
import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Check, AlertCircle, Database, GitBranch, GitPullRequest, MessageSquare, Users, FileText, Zap, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { API_BASE_URL } from "@/lib/api"

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
interface ProcessingStep {
  id: string
  label: string
  icon: React.ReactNode
  progress: number
  status: "pending" | "running" | "done" | "error"
}

// ──────────────────────────────────────────────
// Stepper (same as select-repositories)
// ──────────────────────────────────────────────
const steps = [
  { id: 1, name: "Authentication",   status: "complete" },
  { id: 2, name: "Create Workspace", status: "complete" },
  { id: 3, name: "Connect GitHub",   status: "complete"  },
  { id: 4, name: "AI Processing",    status: "current" },
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
                {idx < 3 && (
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

// ──────────────────────────────────────────────
// Animated ring around the brain icon
// ──────────────────────────────────────────────
function PulsingOrb({ done }: { done: boolean }) {
  return (
    <div className="relative flex items-center justify-center w-32 h-32 mx-auto mb-8">
      {/* Outer glow rings */}
      {!done && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full border border-primary/30"
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border border-primary/20"
            animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </>
      )}
      {/* Core */}
      <div className={cn(
        "relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-700",
        done
          ? "bg-emerald-500/20 border-2 border-emerald-500/60"
          : "bg-primary/20 border-2 border-primary/50"
      )}>
        {done ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Check className="w-8 h-8 text-emerald-400" />
          </motion.div>
        ) : (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Database className="w-8 h-8 text-primary" />
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// Single repo processing card
// ──────────────────────────────────────────────
function RepoProcessingCard({
  repoName,
  jobId,
  onComplete,
}: {
  repoName: string
  jobId: string | null
  onComplete: () => void
}) {
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { id: "connect",     label: "Connecting Repository",  icon: <GitBranch className="w-3.5 h-3.5" />,       progress: 10, status: "pending" },
    { id: "readme",      label: "Reading README",          icon: <FileText className="w-3.5 h-3.5" />,        progress: 25, status: "pending" },
    { id: "prs",         label: "Fetching Pull Requests",  icon: <GitPullRequest className="w-3.5 h-3.5" />,  progress: 40, status: "pending" },
    { id: "commits",     label: "Fetching Commits",        icon: <GitBranch className="w-3.5 h-3.5" />,       progress: 60, status: "pending" },
    { id: "issues",      label: "Fetching Issues",         icon: <MessageSquare className="w-3.5 h-3.5" />,   progress: 80, status: "pending" },
    { id: "contributors",label: "Fetching Contributors",   icon: <Users className="w-3.5 h-3.5" />,           progress: 90, status: "pending" },
    { id: "complete",    label: "Knowledge Base Ready",    icon: <Zap className="w-3.5 h-3.5" />,             progress: 100, status: "pending" },
  ])
  const [overallProgress, setOverallProgress] = useState(0)
  const [status, setStatus] = useState<"queued" | "running" | "completed" | "failed">("queued")
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const completedRef = useRef(false)

  useEffect(() => {
    if (!jobId) return

    const pollJob = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/repository/job/${jobId}`, { credentials: "include" })
        if (!res.ok) return
        const data = await res.json()
        const job = data.data

        const progress: number = job.progress ?? 0
        const jobStatus: string = job.status ?? "Running"

        setOverallProgress(progress)
        setStatus(jobStatus.toLowerCase() as "queued" | "running" | "completed" | "failed")

        // Update individual step statuses
        setProcessingSteps((prev) =>
          prev.map((step) => {
            if (jobStatus === "Failed") return { ...step, status: step.status === "running" ? "error" : step.status }
            if (step.progress < progress) return { ...step, status: "done" }
            if (step.progress === progress) return { ...step, status: "running" }
            return { ...step, status: "pending" }
          })
        )

        if ((jobStatus === "Completed" || progress >= 100) && !completedRef.current) {
          completedRef.current = true
          if (pollRef.current) clearInterval(pollRef.current)
          // Mark all steps done
          setProcessingSteps((prev) => prev.map((s) => ({ ...s, status: "done" })))
          setOverallProgress(100)
          setTimeout(onComplete, 800)
        }

        if (jobStatus === "Failed" && pollRef.current) {
          clearInterval(pollRef.current)
        }
      } catch (e) {
        console.error("Poll error", e)
      }
    }

    pollJob()
    pollRef.current = setInterval(pollJob, 1500)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [jobId, onComplete])

  const shortName = repoName.split("/")[1] || repoName

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex items-center gap-3 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
          <GitBranch className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{shortName}</p>
          <p className="text-[11px] text-white/40">{repoName}</p>
        </div>
        <span className={cn(
          "text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide",
          status === "completed" ? "bg-emerald-500/15 text-emerald-400" :
          status === "failed"    ? "bg-red-500/15 text-red-400" :
          status === "running"   ? "bg-primary/15 text-primary" :
          "bg-white/[0.06] text-white/40"
        )}>
          {status}
        </span>
      </div>

      {/* Progress bar */}
      <div className="px-5 pt-3 pb-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-white/40">Progress</span>
          <span className="text-[11px] font-semibold text-white/70">{overallProgress}%</span>
        </div>
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className={cn(
              "h-full rounded-full",
              status === "completed" ? "bg-emerald-500" :
              status === "failed"    ? "bg-red-500" :
              "bg-primary"
            )}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="px-5 py-3 space-y-1.5">
        {processingSteps.map((step) => (
          <div key={step.id} className="flex items-center gap-2.5">
            <div className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300",
              step.status === "done"    ? "bg-emerald-500/20 text-emerald-400" :
              step.status === "running" ? "bg-primary/20 text-primary" :
              step.status === "error"   ? "bg-red-500/20 text-red-400" :
              "bg-white/[0.04] text-white/20"
            )}>
              {step.status === "done" ? (
                <Check className="w-3 h-3" />
              ) : step.status === "running" ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  {step.icon}
                </motion.div>
              ) : step.status === "error" ? (
                <AlertCircle className="w-3 h-3" />
              ) : (
                step.icon
              )}
            </div>
            <span className={cn(
              "text-xs transition-colors duration-300",
              step.status === "done"    ? "text-white/60" :
              step.status === "running" ? "text-white font-medium" :
              step.status === "error"   ? "text-red-400" :
              "text-white/25"
            )}>
              {step.label}
            </span>
            {step.status === "running" && (
              <motion.span
                className="ml-auto text-[10px] text-primary/70"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                processing…
              </motion.span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ──────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────
export default function AIProcessingPage() {
  const router = useRouter()
  const [selectedRepos, setSelectedRepos] = useState<string[]>([])
  const [jobMap, setJobMap] = useState<Record<string, string | null>>({}) // repoFullName → jobId
  const [completedCount, setCompletedCount] = useState(0)
  const [allDone, setAllDone] = useState(false)
  const [startError, setStartError] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(true)
  const startedRef = useRef(false)

  // Fetch selected repos from the backend session, then fire off processing
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const init = async () => {
      try {
        // 1. Get selected repos from session
        const res = await fetch(`${API_BASE_URL}/github/selected-repositories`, { credentials: "include" })
        if (!res.ok) throw new Error("Could not load selected repositories")
        const selData = await res.json()
        const repos: string[] = selData.data?.selected ?? []

        if (repos.length === 0) {
          router.push("/onboarding/select-repositories")
          return
        }

        setSelectedRepos(repos)
        setIsStarting(false)

        // 2. Get workspace ID
        let workspaceId = localStorage.getItem("recalliq_workspace_id")

        if (!workspaceId) {
          // Fallback: fetch user's workspaces from the API
          const wsRes = await fetch(`${API_BASE_URL}/workspaces`, { credentials: "include" })
          if (wsRes.ok) {
            const wsData = await wsRes.json()
            if (wsData.success && wsData.data?.workspaces?.length > 0) {
              const fetchedId = wsData.data.workspaces[0].id
              if (fetchedId) {
                workspaceId = fetchedId
                // Store it for future use
                localStorage.setItem("recalliq_workspace_id", fetchedId)
              }
            }
          }
        }

        if (!workspaceId) {
          setStartError("No workspace found. Please complete the workspace setup step first.")
          setIsStarting(false)
          return
        }

        // 3. Fire off a processing job for each selected repo
        const initialJobMap: Record<string, string | null> = {}
        repos.forEach((r) => { initialJobMap[r] = null })
        setJobMap(initialJobMap)

        await Promise.allSettled(
          repos.map(async (repoFullName) => {
            try {
              const res = await fetch(`${API_BASE_URL}/repository/process`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ workspaceId, repositoryId: repoFullName }),
              })
              const data = await res.json()
              if (data.success) {
                setJobMap((prev) => ({ ...prev, [repoFullName]: data.data.jobId }))
              } else {
                console.error(`Failed to start job for ${repoFullName}:`, data.error?.message)
              }
            } catch (err) {
              console.error(`Error starting job for ${repoFullName}:`, err)
            }
          })
        )
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error"
        setStartError(message)
        setIsStarting(false)
      }
    }

    init()
  }, [router])

  const handleRepoComplete = () => {
    setCompletedCount((prev) => {
      const next = prev + 1
      if (next >= selectedRepos.length) {
        setAllDone(true)
      }
      return next
    })
  }

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col font-sans text-foreground">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-40 -right-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        {allDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px]"
          />
        )}
      </div>

      {/* Stepper Header */}
      <header className="relative z-50 w-full border-b border-white/5 bg-[#09090B]/80 backdrop-blur-xl px-6 py-4 sticky top-0">
        <div className="max-w-5xl mx-auto">
          <ConnectStepper />
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-3xl mx-auto px-6 py-12">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <PulsingOrb done={allDone} />

          <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
            {allDone
              ? "Knowledge Base Ready!"
              : isStarting
              ? "Preparing your repositories…"
              : "Building your Engineering Knowledge Base"}
          </h1>
          <p className="text-white/50 text-base max-w-xl mx-auto">
            {allDone
              ? "All repositories have been indexed. Your AI is now ready to answer engineering questions."
              : "RecallIQ is reading your repositories, extracting commits, pull requests, issues, and documentation."}
          </p>

          {/* Global progress indicator */}
          {!allDone && selectedRepos.length > 0 && (
            <div className="mt-6 inline-flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-full px-5 py-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-white/60">
                <span className="text-white font-semibold">{completedCount}</span>
                <span className="text-white/40"> / </span>
                <span className="text-white font-semibold">{selectedRepos.length}</span>
                <span className="ml-1">repositories indexed</span>
              </span>
            </div>
          )}
        </motion.div>

        {/* Error state */}
        <AnimatePresence>
          {startError && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 rounded-xl border border-red-500/20 bg-red-500/5 p-6 flex items-start gap-4"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-300">Processing error</p>
                <p className="text-sm text-red-400/70 mt-1">{startError}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Repo cards */}
        {!isStarting && !startError && (
          <div className="space-y-4">
            <AnimatePresence>
              {selectedRepos.map((repoFullName) => (
                <RepoProcessingCard
                  key={repoFullName}
                  repoName={repoFullName}
                  jobId={jobMap[repoFullName] ?? null}
                  onComplete={handleRepoComplete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Loading skeleton while initialising */}
        {isStarting && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] h-48 animate-pulse" />
            ))}
          </div>
        )}

        {/* CTA when all done */}
        <AnimatePresence>
          {allDone && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 flex flex-col items-center gap-4"
            >
              {/* Stats row */}
              <div className="flex items-center gap-6 text-sm text-white/50 mb-2">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{selectedRepos.length} repos indexed</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Knowledge base built</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>AI ready</span>
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2.5 bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-primary/25"
              >
                Go to Dashboard
                <ChevronRight className="w-4 h-4" />
              </motion.button>

              <p className="text-xs text-white/30">
                Your knowledge base updates automatically when you push new commits.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
