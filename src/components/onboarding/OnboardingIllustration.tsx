"use client"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { GitBranch, BrainCircuit, Database, Cpu, HardDrive } from "lucide-react"

const orbitItems = [
  { icon: GitBranch,    label: "Repos",     radius: 130, angle: 0,   delay: 0.1, color: "#7C3AED" },
  { icon: Database,     label: "Memory",    radius: 145, angle: 72,  delay: 0.2, color: "#3B82F6" },
  { icon: Cpu,          label: "AI",        radius: 130, angle: 144, delay: 0.3, color: "#8B5CF6" },
  { icon: HardDrive,    label: "Storage",   radius: 145, angle: 216, delay: 0.4, color: "#06B6D4" },
  { icon: BrainCircuit, label: "Knowledge", radius: 130, angle: 288, delay: 0.5, color: "#A78BFA" },
]

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

export function OnboardingIllustration() {
  // Generate particles only on the client to avoid SSR hydration mismatch
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 6 + 4,
        delay: Math.random() * 3,
      }))
    )
  }, [])

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center overflow-hidden rounded-2xl bg-[#0E0E12] border border-white/5">
      {/* Particles — rendered only after client mount */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: 0.15,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Purple glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-primary/25 rounded-full blur-[90px] pointer-events-none" />
      {/* Blue accent glow */}
      <div className="absolute top-1/4 right-1/4 w-[180px] h-[180px] bg-blue-500/20 rounded-full blur-[70px] pointer-events-none" />

      {/* Central Hub */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
        className="relative z-10 w-28 h-28 rounded-full bg-[#18181B] border border-white/10 flex items-center justify-center shadow-[0_0_60px_rgba(124,58,237,0.35)]"
      >
        <BrainCircuit className="w-12 h-12 text-primary" />
        {/* Pulse ring 1 */}
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full border border-primary/40"
        />
        {/* Pulse ring 2 */}
        <motion.div
          animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 3, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full border border-primary/20"
        />
      </motion.div>

      {/* Orbit Icons */}
      {orbitItems.map((item) => {
        const x = Math.cos((item.angle * Math.PI) / 180) * item.radius
        const y = Math.sin((item.angle * Math.PI) / 180) * item.radius
        const Icon = item.icon
        return (
          <motion.div
            key={item.label}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{ x, y, opacity: 1, scale: 1 }}
            transition={{ delay: item.delay, duration: 0.8, type: "spring", stiffness: 70 }}
            className="absolute z-20 flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5 + item.delay, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 rounded-xl bg-[#18181B] border border-white/10 flex items-center justify-center shadow-lg backdrop-blur-md"
              style={{ boxShadow: `0 0 20px ${item.color}25` }}
            >
              <Icon className="w-5 h-5" style={{ color: item.color }} />
            </motion.div>
            <span className="text-[10px] text-white/40 font-medium tracking-wider uppercase">
              {item.label}
            </span>
          </motion.div>
        )
      })}

      {/* Decorative orbit ring */}
      <div className="absolute w-[320px] h-[320px] rounded-full border border-white/5 border-dashed pointer-events-none" />
    </div>
  )
}
