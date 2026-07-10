"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Search, Bell, Activity, Menu, X,
  LayoutDashboard, BrainCircuit, Database, GitPullRequest, 
  History, Settings, TerminalSquare, Network
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

export function TopBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/5 bg-surface/40 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <div className="flex md:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-foreground/70 hover:text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <form className="relative flex flex-1" action="#" method="GET">
            <label htmlFor="search-field" className="sr-only">
              Search
            </label>
            <Search
              className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-foreground/40 hidden sm:block"
              aria-hidden="true"
            />
            <input
              id="search-field"
              className="block h-full w-full border-0 bg-transparent py-0 sm:pl-8 pl-2 pr-0 text-foreground focus:ring-0 sm:text-sm placeholder:text-foreground/40 outline-none"
              placeholder="Search decisions, PRs, developers... (Cmd+K)"
              type="search"
              name="search"
            />
          </form>
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-foreground/80">
              <Activity className="w-3.5 h-3.5 text-green-400" />
              AI Sync: Live
            </div>

            <button
              type="button"
              className="-m-2.5 p-2.5 text-foreground/60 hover:text-foreground transition-colors relative"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-5 w-5" aria-hidden="true" />
              <span className="absolute top-2.5 right-3 h-2 w-2 rounded-full bg-primary ring-2 ring-background animate-pulse" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-background/95 border-r border-white/10 pt-5 pb-4 animate-in slide-in-from-left duration-300 shadow-2xl">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-shrink-0 items-center px-4 mb-6">
              <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
                <BrainCircuit className="h-6 w-6" />
                <span className="text-white">Recall</span>
                <span className="text-primary glow">IQ</span>
              </div>
            </div>
            <div className="h-0 flex-1 overflow-y-auto hide-scrollbar">
              <nav className="space-y-1 px-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-foreground/70 hover:bg-white/5 hover:text-white",
                        "group flex items-center rounded-md px-2 py-2.5 text-base font-medium transition-colors"
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive ? "text-primary" : "text-foreground/50 group-hover:text-primary/80",
                          "mr-4 h-6 w-6 flex-shrink-0 transition-colors"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
            
            <div className="flex flex-shrink-0 border-t border-white/10 p-4">
              <div className="group block flex-shrink-0 w-full">
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center text-sm font-bold shadow-lg shadow-primary/20 text-white">
                    M
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">Manan</p>
                    <p className="text-xs font-medium text-foreground/50">Workspace Admin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
