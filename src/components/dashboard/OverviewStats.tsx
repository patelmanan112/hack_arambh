"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/Card"
import { FolderGit2, GitCommit, GitPullRequest, Users } from "lucide-react"

interface OverviewStatsProps {
  overview: {
    repositoryCount: number
    commitCount: number
    prCount: number
    issueCount: number
    contributorCount: number
    starsCount: number
    forksCount: number
  }
}

export function OverviewStats({ overview }: OverviewStatsProps) {
  const stats = [
    {
      title: "Monitored Repos",
      value: overview.repositoryCount,
      icon: <FolderGit2 className="w-5 h-5 text-primary" />,
      color: "border-primary/20",
    },
    {
      title: "Total Commits",
      value: overview.commitCount,
      icon: <GitCommit className="w-5 h-5 text-blue-400" />,
      color: "border-blue-500/20",
    },
    {
      title: "Pull Requests",
      value: overview.prCount,
      icon: <GitPullRequest className="w-5 h-5 text-purple-400" />,
      color: "border-purple-500/20",
    },
    {
      title: "Contributors",
      value: overview.contributorCount,
      icon: <Users className="w-5 h-5 text-emerald-400" />,
      color: "border-emerald-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
        >
          <Card className={`border ${stat.color} bg-surface/30 backdrop-blur-xl relative overflow-hidden group`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-foreground/50 tracking-wider uppercase">
                  {stat.title}
                </span>
                <div className="p-2 rounded-lg bg-surface border border-white/5 shadow-inner">
                  {stat.icon}
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-white tracking-tight">
                  {stat.value.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
