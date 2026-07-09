import { motion, AnimatePresence } from "framer-motion";
import { FolderGit2 } from "lucide-react";
import { RepositoryCard } from "./RepositoryCard";
import type { GitHubRepo } from "@/types/github";

interface RepositoryListProps {
  repositories: GitHubRepo[];
  selectedRepos: Set<string>;
  onToggleRepo: (repoFullName: string) => void;
  onSelectAll: (repos: GitHubRepo[]) => void;
  onClearSelection: () => void;
}

export function RepositoryList({
  repositories,
  selectedRepos,
  onToggleRepo,
  onSelectAll,
  onClearSelection,
}: RepositoryListProps) {
  if (repositories.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <FolderGit2 className="w-8 h-8 text-white/30" />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">No repositories found</h3>
        <p className="text-white/40 max-w-sm">
          Try adjusting your filters or search query to find what you're looking for.
        </p>
      </motion.div>
    );
  }

  const allSelected = repositories.length > 0 && repositories.every((r) => selectedRepos.has(r.full_name));

  return (
    <div className="pb-32">
      {/* Bulk Actions */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <p className="text-sm text-white/40">
          Showing <span className="text-white font-medium">{repositories.length}</span> repositories
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectAll(repositories)}
            className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            {allSelected ? "Selected All" : "Select All Visible"}
          </button>
          <div className="w-px h-4 bg-white/10" />
          <button
            onClick={onClearSelection}
            className="text-sm font-medium text-white/40 hover:text-white transition-colors"
          >
            Clear Selection
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {repositories.map((repo) => (
            <RepositoryCard
              key={repo.id}
              repo={repo}
              isSelected={selectedRepos.has(repo.full_name)}
              onToggle={onToggleRepo}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
