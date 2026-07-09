"use client"
import React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, name: "Authentication", status: "complete" },
  { id: 2, name: "Create Workspace", status: "current" },
  { id: 3, name: "Connect GitHub", status: "upcoming" },
  { id: 4, name: "AI Processing", status: "upcoming" },
  { id: 5, name: "Dashboard", status: "upcoming" },
]

export function Stepper() {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol role="list" className="flex items-center justify-between w-full">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={cn(
              "relative flex items-center",
              stepIdx !== steps.length - 1 ? "w-full" : ""
            )}
          >
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Bubble */}
              <div className="relative">
                <motion.span
                  initial={false}
                  animate={{
                    backgroundColor:
                      step.status === "complete"
                        ? "rgba(124,58,237,1)"
                        : step.status === "current"
                        ? "rgba(124,58,237,0.15)"
                        : "rgba(255,255,255,0.04)",
                    borderColor:
                      step.status === "complete"
                        ? "rgba(124,58,237,1)"
                        : step.status === "current"
                        ? "rgba(124,58,237,0.8)"
                        : "rgba(255,255,255,0.12)",
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full border-[1.5px] text-[11px] font-semibold"
                >
                  {step.status === "complete" ? (
                    <Check className="h-3.5 w-3.5 text-white" />
                  ) : (
                    <span
                      className={cn(
                        step.status === "current" ? "text-primary" : "text-white/30"
                      )}
                    >
                      {step.id}
                    </span>
                  )}
                </motion.span>
                {step.status === "current" && (
                  <motion.span
                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border border-primary"
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "hidden md:block text-xs font-medium tracking-wide",
                  step.status === "complete"
                    ? "text-white/70"
                    : step.status === "current"
                    ? "text-primary"
                    : "text-white/30"
                )}
              >
                {step.name}
              </span>
            </div>

            {/* Connector */}
            {stepIdx !== steps.length - 1 && (
              <div className="ml-4 mr-4 h-px w-full relative overflow-hidden">
                <div className="h-full w-full bg-white/8" />
                {stepIdx === 0 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
                    style={{ transformOrigin: "left" }}
                    className="absolute inset-0 bg-primary"
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
