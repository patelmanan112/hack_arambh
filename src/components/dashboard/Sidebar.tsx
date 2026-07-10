"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BrainCircuit,
  Database,
  GitPullRequest,
  History,
  Settings,
  TerminalSquare,
  Network
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Copilot", href: "/dashboard/copilot", icon: BrainCircuit },
  { name: "Engineering Intelligence", href: "/dashboard/intelligence", icon: Database },
  { name: "Decision Graph", href: "/dashboard/graph", icon: Network },
  { name: "Pull Requests", href: "/dashboard/prs", icon: GitPullRequest },
  { name: "Timeline", href: "/dashboard/timeline", icon: History },
  { name: "Runtime", href: "/dashboard/runtime", icon: TerminalSquare },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex h-full w-64 flex-col glass border-r-white/5 shadow-2xl z-20">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <BrainCircuit className="h-6 w-6" />
          <span className="text-foreground">Recall</span>
          <span className="text-primary glow">IQ</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto hide-scrollbar">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                isActive
                  ? "bg-white/10 text-white shadow-inner"
                  : "text-foreground/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200",
                  isActive ? "text-primary" : "text-foreground/50 group-hover:text-primary/80"
                )}
                aria-hidden="true"
              />
              {item.name}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
              )}
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center text-xs font-bold shadow-lg shadow-primary/20">
            M
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none">Manan</span>
            <span className="text-xs text-foreground/50 mt-1">Workspace Admin</span>
          </div>
        </div>
      </div>
    </div>
  )
}
