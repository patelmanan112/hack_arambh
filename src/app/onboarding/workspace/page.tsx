"use client"
import React from "react"
import { motion } from "framer-motion"
import { Stepper } from "@/components/onboarding/Stepper"
import { WorkspaceForm } from "@/components/onboarding/WorkspaceForm"
import { OnboardingIllustration } from "@/components/onboarding/OnboardingIllustration"
import { ShieldCheck } from "lucide-react"

export default function CreateWorkspacePage() {
  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col font-sans text-foreground selection:bg-primary/30">
      {/* Ambient background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Sticky top stepper bar */}
      <header className="relative z-50 w-full border-b border-white/5 bg-[#09090B]/80 backdrop-blur-xl px-6 py-4 sticky top-0">
        <div className="max-w-5xl mx-auto">
          <Stepper />
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center lg:items-stretch max-w-7xl mx-auto w-full p-6 sm:p-10 lg:px-16 lg:py-12 gap-12 lg:gap-20">

        {/* Left — Form Panel */}
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="w-full lg:w-[480px] shrink-0 flex flex-col justify-center"
        >
          {/* Card */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-md p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-8">
              {/* Logo mark */}
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="flex -space-x-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <div className="h-2.5 w-2.5 rounded-full bg-primary/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-primary/30" />
                </div>
                <span className="text-sm font-semibold tracking-tight text-white/70">RecallIQ</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                Create your workspace
              </h1>
              <p className="text-sm text-white/50 leading-relaxed">
                Let's set up your engineering workspace. This takes about 30 seconds.
              </p>
            </div>

            <WorkspaceForm />
          </div>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-5 flex items-start gap-3 text-sm text-white/40 px-1"
          >
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p>
              This workspace will securely connect your engineering repositories and build your AI knowledge base.
            </p>
          </motion.div>
        </motion.section>

        {/* Right — Illustration */}
        <motion.section
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="hidden lg:flex flex-1 items-center justify-center"
        >
          <div className="w-full max-w-[520px] aspect-square">
            <OnboardingIllustration />
          </div>
        </motion.section>
      </main>
    </div>
  )
}
