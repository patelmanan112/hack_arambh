"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, GitFork, AlertCircle, Clock, GitBranch, Lock, Globe, Code2, HardDrive } from "lucide-react";
import type { GitHubRepo } from "@/types/github";
import { cn } from "@/lib/utils";

interface RepositoryCardProps {
  repo: GitHubRepo;
  isSelected: boolean;
  onToggle: (fullName: string) => void;
  index: number;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f7df1e", Python: "#3572A5",
  Rust: "#dea584", Go: "#00ADD8", Java: "#b07219", "C++": "#f34b7d",
  C: "#555555", "C#": "#178600", Ruby: "#701516", PHP: "#4F5D95",
  Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB", Shell: "#89e051",
  HTML: "#e34c26", CSS: "#563d7c", Vue: "#41b883", default: "#8b949e",
};

function formatSize(kb: number): string {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = Date.now();
  const diff = now - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function RepositoryCard({ repo, isSelected, onToggle, index }: RepositoryCardProps) {
  const langColor = LANGUAGE_COLORS[repo.language ?? ""] ?? LANGUAGE_COLORS.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: "easeOut" }}
      onClick={() => onToggle(repo.full_name)}
      className={cn(
        "group relative rounded-xl border p-5 cursor-pointer transition-all duration-200",
        "hover:shadow-lg",
        isSelected
          ? "border-primary/50 bg-primary/[0.06] shadow-[0_0_20px_rgba(124,58,237,0.12)]"
          : "border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
      )}
    >
      {/* Selected glow */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-xl bg-primary/[0.04] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="relative flex items-start gap-3">
        {/* Checkbox */}
        <div className="mt-0.5 shrink-0">
          <motion.div
            animate={{ scale: isSelected ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "w-5 h-5 rounded-md border-[1.5px] flex items-center justify-center transition-colors duration-200",
              isSelected ? "bg-primary border-primary" : "border-white/20 bg-white/[0.04] group-hover:border-white/40"
            )}
          >
            {isSelected && (
              <motion.svg
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-3 h-3 text-white"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            )}
          </motion.div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={repo.owner.avatar_url}
                alt={repo.owner.login}
                className="w-5 h-5 rounded-full shrink-0"
              />
              <span className="text-sm font-semibold text-white truncate">{repo.name}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {repo.fork && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                  Fork
                </span>
              )}
              <span className={cn(
                "text-[10px] px-1.5 py-0.5 rounded border font-medium flex items-center gap-1",
                repo.private
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              )}>
                {repo.private ? <Lock className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
                {repo.private ? "Private" : "Public"}
              </span>
            </div>
          </div>

          {/* Description */}
          {repo.description && (
            <p className="text-xs text-white/50 mb-3 line-clamp-2 leading-relaxed">
              {repo.description}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-white/40">
            {repo.language && (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: langColor }} />
                <span>{repo.language}</span>
              </span>
            )}
            {repo.stargazers_count > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {repo.stargazers_count.toLocaleString()}
              </span>
            )}
            {repo.forks_count > 0 && (
              <span className="flex items-center gap-1">
                <GitFork className="w-3 h-3" />
                {repo.forks_count.toLocaleString()}
              </span>
            )}
            {repo.open_issues_count > 0 && (
              <span className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {repo.open_issues_count}
              </span>
            )}
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3" />
              {formatSize(repo.size)}
            </span>
            <span className="flex items-center gap-1">
              <GitBranch className="w-3 h-3" />
              {repo.default_branch}
            </span>
            <span className="flex items-center gap-1 ml-auto">
              <Clock className="w-3 h-3" />
              {formatDate(repo.updated_at)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
