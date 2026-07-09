import { motion } from "framer-motion";
import { Star, GitFork, CircleDot, Clock, Lock, Globe } from "lucide-react";
import type { GitHubRepo } from "@/types/github";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface RepositoryCardProps {
  repo: GitHubRepo;
  isSelected: boolean;
  onToggle: (repoFullName: string) => void;
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
}

export function RepositoryCard({ repo, isSelected, onToggle }: RepositoryCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      onClick={() => onToggle(repo.full_name)}
      className={cn(
        "group relative rounded-xl border p-5 cursor-pointer transition-all duration-300",
        "bg-white/[0.02] backdrop-blur-sm overflow-hidden",
        isSelected
          ? "border-primary shadow-[0_0_20px_rgba(124,58,237,0.15)] bg-primary/[0.03]"
          : "border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
      )}
    >
      {/* Glow Effect for Selected */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
      )}

      <div className="relative z-10 flex items-start gap-4">
        {/* Avatar */}
        <div className="shrink-0 pt-1">
          <Image
            src={repo.owner.avatar_url}
            alt={repo.owner.login}
            width={36}
            height={36}
            className="rounded-full ring-2 ring-white/10 group-hover:ring-white/20 transition-all"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-base font-semibold text-white truncate max-w-[80%] group-hover:text-primary transition-colors">
              {repo.name}
            </h3>
            
            {/* Custom Checkbox */}
            <div
              className={cn(
                "w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0",
                isSelected
                  ? "bg-primary border-primary"
                  : "border-white/20 group-hover:border-white/40"
              )}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2.5 h-2.5 bg-white rounded-full"
                />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium border",
                repo.private
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              )}
            >
              {repo.private ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
              {repo.private ? "Private" : "Public"}
            </span>
            {repo.fork && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <GitFork className="w-3 h-3" /> Forked
              </span>
            )}
          </div>

          <p className="text-sm text-white/50 line-clamp-2 mb-4 min-h-[40px]">
            {repo.description || "No description provided."}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/40">
            {repo.language && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary/70" />
                {repo.language}
              </div>
            )}
            <div className="flex items-center gap-1 cursor-help" title={`${repo.stargazers_count} stars`}>
              <Star className="w-3.5 h-3.5" />
              {formatNumber(repo.stargazers_count)}
            </div>
            <div className="flex items-center gap-1 cursor-help" title={`${repo.forks_count} forks`}>
              <GitFork className="w-3.5 h-3.5" />
              {formatNumber(repo.forks_count)}
            </div>
            {repo.open_issues_count > 0 && (
              <div className="flex items-center gap-1 cursor-help" title={`${repo.open_issues_count} open issues`}>
                <CircleDot className="w-3.5 h-3.5 text-amber-500/70" />
                {formatNumber(repo.open_issues_count)}
              </div>
            )}
            <div className="flex items-center gap-1 ml-auto">
              <Clock className="w-3.5 h-3.5" />
              {formatDate(repo.updated_at)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
