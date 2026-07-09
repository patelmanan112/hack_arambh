"use client";
import React from "react";
import { motion } from "framer-motion";

export function RepositorySkeleton() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10" />
          <div className="space-y-1.5">
            <div className="h-4 w-36 bg-white/10 rounded" />
            <div className="h-3 w-20 bg-white/[0.06] rounded" />
          </div>
        </div>
        <div className="w-5 h-5 rounded bg-white/10" />
      </div>
      <div className="h-3 w-full bg-white/[0.06] rounded mb-1.5" />
      <div className="h-3 w-3/4 bg-white/[0.06] rounded mb-4" />
      <div className="flex gap-3">
        <div className="h-3 w-14 bg-white/[0.06] rounded" />
        <div className="h-3 w-14 bg-white/[0.06] rounded" />
        <div className="h-3 w-20 bg-white/[0.06] rounded" />
      </div>
    </div>
  );
}

export function RepositorySkeletonList() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <RepositorySkeleton />
        </motion.div>
      ))}
    </div>
  );
}
