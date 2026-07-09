"use client";
import React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface RepositorySearchProps {
  value: string;
  onChange: (v: string) => void;
}

export function RepositorySearch({ value, onChange }: RepositorySearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search repositories…"
        className={cn(
          "w-full h-10 pl-10 pr-9 rounded-lg text-sm",
          "bg-white/[0.04] border border-white/[0.08]",
          "text-white placeholder:text-white/30",
          "focus:outline-none focus:ring-1 focus:ring-primary/60 focus:border-primary/40",
          "transition-colors duration-200"
        )}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
