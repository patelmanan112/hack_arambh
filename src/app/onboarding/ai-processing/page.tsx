"use client"
import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion"
import { useRouter } from "next/navigation"
import { 
  Check, AlertCircle, Database, GitBranch, GitPullRequest, 
  MessageSquare, Users, FileText, Zap, ChevronRight, BrainCircuit,
  Box, Share2, Layers, Cpu, ShieldCheck
} from "lucide-react"
import { cn } from "@/lib/utils"
import { API_BASE_URL, getToken } from "@/lib/api"

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
interface ProcessingLog {
  timestamp: string;
  message: string;
}

interface ProcessingStats {
  repositories: number;
  files: number;
  pullRequests: number;
  issues: number;
  commits: number;
  contributors: number;
  chunks: number;
}

interface JobData {
  status: "Queued" | "Running" | "Completed" | "Failed";
  progress: number;
  currentStep: string;
  statistics?: ProcessingStats;
  logs?: ProcessingLog[];
}

// ──────────────────────────────────────────────
// Animated Number Component
// ──────────────────────────────────────────────
function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { bounce: 0, duration: 800 })
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString())
  
  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return <motion.span>{display}</motion.span>
}

// ──────────────────────────────────────────────
// Stepper
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
                  "flex h-7 w-7 items-center justify-center rounded-full border-[1.5px] text-[11px] font-semibold transition-colors duration-500",
                  step.status === "complete" ? "bg-primary border-primary text-white" :
                  step.status === "current"  ? "bg-primary/15 border-primary text-primary shadow-[0_0_15px_rgba(124,58,237,0.3)]" :
                  "bg-white/[0.04] border-white/[0.12] text-white/30"
                )}
              >
                {step.status === "complete" ? <Check className="h-3.5 w-3.5" /> : step.id}
              </span>
              <span
                className={cn(
                  "hidden md:block text-xs font-medium transition-colors duration-500",
                  step.status === "complete" ? "text-white/70" :
                  step.status === "current"  ? "text-primary shadow-primary" : "text-white/30"
                )}
              >
                {step.name}
              </span>
            </div>
            {idx !== steps.length - 1 && (
              <div className="ml-4 mr-4 h-px w-full bg-white/[0.08]">
                {idx < 3 && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: idx * 0.2 }}
                    className="h-full bg-primary" 
                  />
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
// Central AI Brain Animation
// ──────────────────────────────────────────────
function AIBrain({ progress, isDone }: { progress: number; isDone: boolean }) {
  return (
    <div className="relative flex items-center justify-center w-64 h-64 mx-auto my-8">
      {/* Dynamic Background Glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          background: isDone 
            ? "radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0) 70%)"
            : "radial-gradient(circle, rgba(124,58,237,0.25) 0%, rgba(124,58,237,0) 70%)",
          scale: isDone ? [1, 1.5, 1] : [1, 1.2, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orbiting Particles */}
      {!isDone && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-full h-full border border-primary/20 rounded-full"
              style={{ rotate: i * 60 }}
              animate={{ rotate: 360 + i * 60 }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute -top-1.5 left-1/2 w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_rgba(124,58,237,0.8)]" />
            </motion.div>
          ))}
        </>
      )}

      {/* The Brain Core */}
      <motion.div 
        className={cn(
          "relative z-10 w-32 h-32 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 shadow-2xl transition-all duration-700",
          isDone ? "bg-emerald-500/20 border-emerald-500/50 shadow-emerald-500/20" : "bg-primary/20 border-primary/50 shadow-primary/20"
        )}
        animate={{ scale: isDone ? [1, 1.1, 1] : [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {isDone ? (
          <Check className="w-16 h-16 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
        ) : (
          <BrainCircuit className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
        )}
      </motion.div>
    </div>
  )
}

// ──────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────
export default function AIProcessingPage() {
  const router = useRouter()
  
  const [jobId, setJobId] = useState<string | null>(null)
  const [jobData, setJobData] = useState<JobData>({
    status: "Queued",
    progress: 0,
    currentStep: "Initializing...",
    statistics: { repositories: 0, files: 0, pullRequests: 0, issues: 0, commits: 0, contributors: 0, chunks: 0 },
    logs: []
  })
  const [isStarting, setIsStarting] = useState(true)
  const [startError, setStartError] = useState<string | null>(null)
  const [isDone, setIsDone] = useState(false)
  
  const startedRef = useRef(false)
  const logsEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [jobData.logs])

  // Fire off the job
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const init = async () => {
      try {
        const token = getToken()
        const res = await fetch(`${API_BASE_URL}/github/selected-repositories`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (!res.ok) throw new Error("Could not load selected repositories")
        const selData = await res.json()
        const repos: string[] = selData.data?.selected ?? []

        if (repos.length === 0) {
          router.push("/onboarding/select-repositories")
          return
        }

        let workspaceId = localStorage.getItem("recalliq_workspace_id")
        if (!workspaceId) {
          const wsRes = await fetch(`${API_BASE_URL}/workspaces`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          })
          if (wsRes.ok) {
            const wsData = await wsRes.json()
            if (wsData.success && wsData.data?.workspaces?.length > 0) {
              workspaceId = wsData.data.workspaces[0].id
              if (workspaceId) localStorage.setItem("recalliq_workspace_id", workspaceId)
            }
          }
        }

        if (!workspaceId) throw new Error("No workspace found. Please complete the workspace setup step first.")

        // Just fire the first one for the overall dashboard if there are multiple.
        // In a real scenario, the backend might handle multiple repos in one job,
        // or we aggregate them. Here we track the first repo's job to drive the UI.
        const mainRepo = repos[0]
        
        const procRes = await fetch(`${API_BASE_URL}/repository/process`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ workspaceId, repositoryId: mainRepo }),
        })
        
        const data = await procRes.json()
        if (data.success) {
          setJobId(data.data.jobId)
        } else {
          throw new Error(data.error?.message || "Failed to start job")
        }
      } catch (err: any) {
        setStartError(err.message || "Unknown error")
      } finally {
        setIsStarting(false)
      }
    }

    init()
  }, [router])

  // Poll job status
  useEffect(() => {
    if (!jobId || isDone) return
    
    let pollInterval: NodeJS.Timeout

    const poll = async () => {
      try {
        const token = getToken()
        const res = await fetch(`${API_BASE_URL}/repository/job/${jobId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (!res.ok) return
        const { data } = await res.json()
        
        setJobData(data)

        if (data.status === "Completed") {
          setIsDone(true)
          clearInterval(pollInterval)
          setTimeout(() => router.push("/dashboard"), 3500) // Auto redirect after 3.5s
        } else if (data.status === "Failed") {
          setStartError(data.message)
          clearInterval(pollInterval)
        }
      } catch (err) {
        console.error("Polling error", err)
      }
    }

    poll()
    pollInterval = setInterval(poll, 1000) // Fast polling for real-time feel

    return () => clearInterval(pollInterval)
  }, [jobId, isDone, router])

  const stats = jobData.statistics || { repositories: 0, files: 0, pullRequests: 0, issues: 0, commits: 0, contributors: 0, chunks: 0 }
  const logs = jobData.logs || []
  
  const pipelineSteps = [
    "Connecting to GitHub",
    "Repository synchronized",
    "Reading README",
    "Pull Requests",
    "Commits",
    "Issues",
    "Contributors",
    "Chunking Documents",
    "Generating embeddings",
    "Creating vector index",
    "Building Hindsight memory",
    "Initializing cascadeflow runtime",
    "Engineering Knowledge Ready"
  ]
  
  const currentStepIndex = pipelineSteps.findIndex(s => jobData.currentStep?.includes(s) || s.includes(jobData.currentStep))
  const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col font-sans text-foreground selection:bg-primary/30">
      
      {/* Ambient backgrounds */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px] opacity-70 mix-blend-screen" />
        <div className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[120px] opacity-60 mix-blend-screen" />
        
        <AnimatePresence>
          {isDone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-emerald-500/10 rounded-full blur-[150px] mix-blend-screen"
            />
          )}
        </AnimatePresence>
      </div>

      <header className="relative z-50 w-full border-b border-white/5 bg-[#09090B]/80 backdrop-blur-xl px-6 py-4 sticky top-0">
        <div className="max-w-5xl mx-auto">
          <ConnectStepper />
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Error overlay */}
        {startError && (
          <div className="col-span-full mb-8 rounded-xl border border-red-500/20 bg-red-500/5 p-6 flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-300">Processing error</p>
              <p className="text-sm text-red-400/70 mt-1">{startError}</p>
            </div>
          </div>
        )}

        {/* =========================================
            LEFT PANEL: Timeline
            ========================================= */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-6 h-full flex flex-col shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-6">Processing Pipeline</h3>
            <div className="relative flex-1">
              <div className="absolute top-4 bottom-4 left-[15px] w-px bg-white/10" />
              
              <div className="space-y-6 relative z-10">
                {pipelineSteps.map((step, idx) => {
                  const isPast = idx < activeIndex || isDone
                  const isCurrent = idx === activeIndex && !isDone
                  
                  return (
                    <div key={step} className="flex items-start gap-4 group">
                      <div className={cn(
                        "w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-500 z-10 bg-[#09090B]",
                        isPast ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]" :
                        isCurrent ? "border-primary bg-primary/20 text-primary shadow-[0_0_15px_rgba(124,58,237,0.4)]" :
                        "border-white/10 text-white/20"
                      )}>
                        {isPast ? <Check className="w-4 h-4" /> : 
                         isCurrent ? <div className="w-2 h-2 rounded-full bg-primary animate-ping" /> : 
                         <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
                      </div>
                      <div className="pt-1.5">
                        <p className={cn(
                          "text-sm font-medium transition-colors duration-300",
                          isPast ? "text-white/70" :
                          isCurrent ? "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" :
                          "text-white/30"
                        )}>
                          {step}
                        </p>
                        {isCurrent && (
                          <motion.p 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-xs text-primary/80 mt-1"
                          >
                            Processing...
                          </motion.p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            CENTER PANEL: Brain & Current Task
            ========================================= */}
        <div className="col-span-1 lg:col-span-6 flex flex-col gap-6 items-center justify-start pt-4">
          
          <div className="text-center w-full">
            <motion.h1 
              className="text-4xl font-bold tracking-tight text-white mb-3"
              animate={{ opacity: isStarting ? 0.5 : 1 }}
            >
              {isDone 
                ? <span className="bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">Engineering Intelligence Successfully Created</span> 
                : "Building your Engineering Intelligence..."}
            </motion.h1>
            <p className="text-white/50 text-lg">
              {isDone 
                ? "RecallIQ is now ready to answer questions about your engineering knowledge."
                : "RecallIQ is transforming your GitHub repositories into an intelligent organizational memory."}
            </p>
            {!isDone && (
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Estimated time: 15–40 seconds
              </div>
            )}
          </div>

          <AIBrain progress={jobData.progress} isDone={isDone} />

          {/* Current Task Card */}
          <motion.div 
            layout
            className="w-full max-w-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-2xl p-6 shadow-2xl relative overflow-hidden"
          >
            {/* Progress background fill */}
            <motion.div 
              className="absolute left-0 top-0 bottom-0 bg-primary/[0.03] z-0"
              animate={{ width: `${jobData.progress}%` }}
              transition={{ ease: "easeOut" }}
            />
            
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Current Task</p>
                  <h2 className="text-xl font-bold text-white">
                    {isDone ? "Knowledge Base Ready" : jobData.currentStep}
                  </h2>
                </div>
                <span className="text-3xl font-light text-white/80">
                  <AnimatedNumber value={jobData.progress} />%
                </span>
              </div>
              
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden shadow-inner mb-4">
                <motion.div 
                  className={cn("h-full rounded-full relative", isDone ? "bg-emerald-500" : "bg-gradient-to-r from-primary to-blue-500")}
                  animate={{ width: `${jobData.progress}%` }}
                  transition={{ ease: "easeOut" }}
                >
                  {!isDone && (
                    <motion.div 
                      className="absolute inset-0 bg-white/20"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </motion.div>
              </div>

              {/* Streaming Logs Viewer */}
              <div className="bg-black/40 border border-white/5 rounded-lg p-3 font-mono text-xs h-32 overflow-y-auto custom-scrollbar flex flex-col shadow-inner">
                {logs.length === 0 ? (
                  <span className="text-white/20">Waiting for logs...</span>
                ) : (
                  logs.map((log, i) => {
                    const date = new Date(log.timestamp)
                    const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        key={i} 
                        className="mb-1.5 flex gap-3 leading-relaxed"
                      >
                        <span className="text-white/30 shrink-0">[{time}]</span>
                        <span className={cn(
                          log.message.toLowerCase().includes("failed") || log.message.toLowerCase().includes("error") ? "text-red-400" : 
                          log.message.toLowerCase().includes("ready") || log.message.toLowerCase().includes("completed") ? "text-emerald-400" :
                          "text-white/70"
                        )}>
                          {log.message}
                        </span>
                      </motion.div>
                    )
                  })
                )}
                <div ref={logsEndRef} />
              </div>
            </div>
          </motion.div>

        </div>

        {/* =========================================
            RIGHT PANEL: Live Statistics & Extras
            ========================================= */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
          
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" /> Live Statistics
            </h3>
            
            <div className="space-y-4">
              <StatRow label="Repositories" value={stats.repositories} icon={<GitBranch className="w-4 h-4 text-emerald-400" />} />
              <StatRow label="Files Indexed" value={stats.files} icon={<FileText className="w-4 h-4 text-blue-400" />} />
              <StatRow label="Pull Requests" value={stats.pullRequests} icon={<GitPullRequest className="w-4 h-4 text-purple-400" />} />
              <StatRow label="Issues" value={stats.issues} icon={<MessageSquare className="w-4 h-4 text-amber-400" />} />
              <StatRow label="Commits" value={stats.commits} icon={<GitBranch className="w-4 h-4 text-rose-400" />} />
              <StatRow label="Contributors" value={stats.contributors} icon={<Users className="w-4 h-4 text-indigo-400" />} />
              <div className="h-px w-full bg-white/10 my-2" />
              <StatRow 
                label="Knowledge Chunks" 
                value={stats.chunks} 
                icon={<Box className="w-4 h-4 text-cyan-400" />} 
                loading={stats.chunks === 0 && !isDone}
              />
              <StatRow 
                label="Vector Storage" 
                value={stats.chunks > 0 ? "Initializing..." : "Waiting..."} 
                icon={<Layers className="w-4 h-4 text-pink-400" />} 
                customValue={isDone ? "Ready" : stats.chunks > 0 ? "Initializing..." : "Waiting..."}
              />
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-5 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2 text-sm">
              <Share2 className="w-4 h-4 text-primary" /> Building AI Memory
            </h4>
            <p className="text-xs text-white/50 leading-relaxed mb-4">
              Hindsight is learning your engineering decisions, architecture discussions, and repository history to create a long-term organizational memory.
            </p>
            <div className="flex gap-2">
              <Badge text="Context Links" ready={isDone} />
              <Badge text="Semantic Graph" ready={isDone} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-5 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2 text-sm">
              <Cpu className="w-4 h-4 text-blue-500" /> Optimizing cascadeflow
            </h4>
            <p className="text-xs text-white/50 leading-relaxed mb-4">
              Preparing intelligent routing, model orchestration, and latency optimization before AI becomes available.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Badge text="Model Routing" ready={isDone} />
              <Badge text="Quality Gates" ready={isDone} />
              <Badge text="Audit Trail" ready={isDone} />
            </div>
          </div>

        </div>
      </main>

      {/* Global CSS overrides for custom scrollbar inside the component */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}} />
    </div>
  )
}

function StatRow({ label, value, icon, loading, customValue }: { label: string; value: number | string; icon: React.ReactNode, loading?: boolean, customValue?: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-sm text-white/70">{label}</span>
      </div>
      <div className="text-sm font-semibold text-white">
        {customValue ? (
          <span className={customValue === "Ready" ? "text-emerald-400" : "text-white/40"}>{customValue}</span>
        ) : loading ? (
          <span className="text-white/30 italic">Generating...</span>
        ) : typeof value === 'number' ? (
          <AnimatedNumber value={value} />
        ) : (
          value
        )}
      </div>
    </div>
  )
}

function Badge({ text, ready }: { text: string; ready: boolean }) {
  return (
    <div className={cn(
      "px-2 py-1 rounded text-[10px] font-medium border flex items-center gap-1.5 transition-colors",
      ready ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-white/5 border-white/10 text-white/40"
    )}>
      {ready ? <Check className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3 opacity-50" />}
      {text}
    </div>
  )
}
