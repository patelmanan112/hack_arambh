"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Button } from "@/components/ui/Button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { ArrowRight, Loader2, CheckCircle2, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const workspaceSchema = z.object({
  workspaceName: z.string().min(2, "Workspace name must be at least 2 characters"),
  orgName: z.string().optional(),
  website: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || /^https?:\/\/.+/.test(val),
      "Please enter a valid URL starting with http:// or https://"
    ),
  teamSize: z.string().min(1, "Please select a team size"),
  industry: z.string().min(1, "Please select an industry"),
})

type WorkspaceFormValues = z.infer<typeof workspaceSchema>

interface FieldWrapperProps {
  label: string
  optional?: boolean
  error?: string
  children: React.ReactNode
}

function FieldWrapper({ label, optional, error, children }: FieldWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-1.5"
    >
      <Label className="text-sm font-medium text-white/80">
        {label}{" "}
        {optional && <span className="text-white/30 font-normal">(Optional)</span>}
      </Label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="text-xs text-red-400 mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function WorkspaceForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      workspaceName: "",
      orgName: "",
      website: "",
    },
  })

  const onSubmit = async (data: WorkspaceFormValues) => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: data.workspaceName }),
      })

      const result = await res.json()

      if (!res.ok || !result.success) {
        throw new Error(result.error?.message ?? "Failed to create workspace")
      }

      // Store workspace ID for the AI processing step
      localStorage.setItem("recalliq_workspace_id", result.data.workspace.id)

      setIsSuccess(true)
      await new Promise((resolve) => setTimeout(resolve, 1200))
      router.push("/onboarding/connect-github")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong"
      console.error("[WorkspaceForm] Error:", message)
      alert(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-4 py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
        >
          <CheckCircle2 className="w-16 h-16 text-primary" />
        </motion.div>
        <p className="text-white/60 text-sm">Workspace created! Moving to next step…</p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FieldWrapper label="Workspace Name" error={errors.workspaceName?.message}>
        <Input
          id="workspaceName"
          placeholder="Acme Technologies"
          className={cn(errors.workspaceName && "border-red-500/50 focus-visible:ring-red-500/50")}
          {...register("workspaceName")}
        />
      </FieldWrapper>

      <FieldWrapper label="Organization Name" optional error={errors.orgName?.message}>
        <Input
          id="orgName"
          placeholder="Acme Inc."
          {...register("orgName")}
        />
      </FieldWrapper>

      <FieldWrapper label="Company Website" optional error={errors.website?.message}>
        <Input
          id="website"
          placeholder="https://acme.com"
          className={cn(errors.website && "border-red-500/50 focus-visible:ring-red-500/50")}
          {...register("website")}
        />
      </FieldWrapper>

      <div className="grid grid-cols-2 gap-4">
        <FieldWrapper label="Team Size" error={errors.teamSize?.message}>
          <Select onValueChange={(val) => setValue("teamSize", val, { shouldValidate: true })}>
            <SelectTrigger
              className={cn(errors.teamSize && "border-red-500/50 focus:ring-red-500/50")}
            >
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1 – 10</SelectItem>
              <SelectItem value="11-50">11 – 50</SelectItem>
              <SelectItem value="51-100">51 – 100</SelectItem>
              <SelectItem value="100+">100+</SelectItem>
            </SelectContent>
          </Select>
        </FieldWrapper>

        <FieldWrapper label="Industry" error={errors.industry?.message}>
          <Select onValueChange={(val) => setValue("industry", val, { shouldValidate: true })}>
            <SelectTrigger
              className={cn(errors.industry && "border-red-500/50 focus:ring-red-500/50")}
            >
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="startup">Startup</SelectItem>
              <SelectItem value="saas">SaaS</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
              <SelectItem value="agency">Agency</SelectItem>
              <SelectItem value="opensource">Open Source</SelectItem>
            </SelectContent>
          </Select>
        </FieldWrapper>
      </div>

      <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3">
        <Button
          variant="secondary"
          type="button"
          size="lg"
          className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full flex-1 bg-primary hover:bg-primary-hover text-white font-medium shadow-[0_0_20px_rgba(124,58,237,0.35)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-shadow"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating workspace…
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
