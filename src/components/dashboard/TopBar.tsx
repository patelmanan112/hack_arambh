"use client"

import { Search, Bell, Activity } from "lucide-react"

export function TopBar() {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/5 bg-surface/40 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-foreground/40"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-foreground focus:ring-0 sm:text-sm placeholder:text-foreground/40 outline-none"
            placeholder="Search decisions, PRS, developers... (Cmd+K)"
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-foreground/80">
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
  )
}
