"use client"
import React from "react"
import { motion } from "framer-motion"
import { GitBranch, ArrowRight, ShieldCheck, Check } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

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
                {idx < 1 && (
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

export default function ConnectGitHubPage() {
  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col font-sans text-foreground">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Sticky stepper */}
      <header className="relative z-50 w-full border-b border-white/5 bg-[#09090B]/80 backdrop-blur-xl px-6 py-4 sticky top-0">
        <div className="max-w-5xl mx-auto">
          <ConnectStepper />
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md p-8 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <GitBranch className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Connect GitHub</h1>
            <p className="text-sm text-white/50 mb-8 leading-relaxed">
              Grant RecallIQ access to your repositories to start building your AI engineering knowledge base.
            </p>
            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary-hover text-white shadow-[0_0_20px_rgba(124,58,237,0.35)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
            >
              Connect GitHub <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="mt-4 text-xs text-white/30 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Read-only access. We never modify your code.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
