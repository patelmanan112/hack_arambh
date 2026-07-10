"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { 
  Shield, MessageCircle, Users, FileText, GitPullRequest, 
  GitCommit, Rocket, ArrowRight, Zap, RefreshCw, Cpu, ExternalLink
} from "lucide-react"

interface Node {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  bg: string;
  description: string;
  meta: {
    author: string;
    date: string;
    details: string;
    detailsLabel: string;
  };
}

const nodes: Node[] = [
  { 
    id: "auth", 
    label: "Authentication", 
    icon: Shield, 
    color: "text-blue-400 border-blue-500/20", 
    bg: "bg-blue-500/10",
    description: "Core authentication schema definition using JWT token verification.",
    meta: {
      author: "Rahul & Aman",
      date: "3d ago",
      detailsLabel: "Architectural Scope",
      details: "Decoupled server session store. Switched to JWT bearer auth inside localStorage client-side. Integrated Passport.js routes."
    }
  },
  { 
    id: "slack", 
    label: "Slack Discussion", 
    icon: MessageCircle, 
    color: "text-purple-400 border-purple-500/20", 
    bg: "bg-purple-500/10",
    description: "Team thread discussing JWT token refresh vs long-lived sessions.",
    meta: {
      author: "Manan, Rahul",
      date: "2d ago",
      detailsLabel: "Slack Transcripts Log",
      details: "Rahul: 'We should use local storage and a token query string parameter for onboarding redirects.'\nManan: 'Agree. If we redirect directly, Passport handles OAuth 302, but JWT saves automatically.'"
    }
  },
  { 
    id: "meet", 
    label: "Meeting Decision", 
    icon: Users, 
    color: "text-green-400 border-green-500/20", 
    bg: "bg-green-500/10",
    description: "Sprint alignment meeting validating security and deployment velocity.",
    meta: {
      author: "Full Team",
      date: "2d ago",
      detailsLabel: "Decisions Approved",
      details: "1. Approved single review check for minor features.\n2. Scheduled vector operations engine deployment for Wednesday."
    }
  },
  { 
    id: "notion", 
    label: "Notion ADR", 
    icon: FileText, 
    color: "text-white border-white/20", 
    bg: "bg-white/5",
    description: "ADR #14: Stateless JSON Web Token authentication guidelines.",
    meta: {
      author: "Aman",
      date: "1d ago",
      detailsLabel: "ADR Contents Summary",
      details: "Context: Need stateless scaling. Decision: Implement JWT expiration check on frontend reload. Status: Approved. Consequence: Frontend must redirect on 401 ApiError."
    }
  },
  { 
    id: "pr", 
    label: "GitHub PR", 
    icon: GitPullRequest, 
    color: "text-orange-400 border-orange-500/20", 
    bg: "bg-orange-500/10",
    description: "Pull Request #245: stateless auth endpoints and context integration.",
    meta: {
      author: "Manan",
      date: "1d ago",
      detailsLabel: "Code Diff footprint",
      details: "+1,250 lines -450 lines. Files changed: 8. Reviews approved by Sarah, Rahul. Test coverage at 92.4%."
    }
  },
  { 
    id: "commit", 
    label: "Merged Commit", 
    icon: GitCommit, 
    color: "text-red-400 border-red-500/20", 
    bg: "bg-red-500/10",
    description: "Commit f9b2a8d: feat: integrate cascadeflow v2 vector sync.",
    meta: {
      author: "Manan",
      date: "2h ago",
      detailsLabel: "Git log trace",
      details: "Parent: a5e9d2c. Branches impacted: main, develop. Verified by CI pipeline runner #892."
    }
  },
  { 
    id: "prod", 
    label: "Production", 
    icon: Rocket, 
    color: "text-primary border-primary/20", 
    bg: "bg-primary/20",
    description: "Kubernetes container deployment of release version v1.2.0.",
    meta: {
      author: "Sarah (CI/CD)",
      date: "10m ago",
      detailsLabel: "Deploy Status metrics",
      details: "Container running optimal. CPU usage 12%. Network latencies 95ms. Auto-rollback checks set."
    }
  }
]

export default function DecisionGraphPage() {
  const [selectedNodeId, setSelectedNodeId] = useState("auth")

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0]
  const NodeIcon = selectedNode.icon

  return (
    <div className="flex flex-col gap-6 pb-12 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary" />
          Engineering Decision Graph
        </h2>
        <p className="text-xs text-foreground/50 mt-1">
          Trace how Slack messages, Notion documentation, and design specifications propagate into code changes and production releases.
        </p>
      </div>

      {/* Interactive Graph Display Card */}
      <Card className="border border-white/5 bg-surface/30 p-6 overflow-hidden">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-sm font-semibold text-white/50 uppercase">Knowledge propagation pathway</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="relative w-full flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 mt-4 px-2 pb-6 overflow-x-auto hide-scrollbar">
            {nodes.map((node, index) => {
              const isSelected = selectedNodeId === node.id
              const Icon = node.icon
              
              return (
                <div 
                  key={node.id} 
                  onClick={() => setSelectedNodeId(node.id)}
                  className="flex flex-col md:flex-row items-center relative z-10 group cursor-pointer"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-14 h-14 rounded-2xl ${node.bg} border flex items-center justify-center backdrop-blur-md transition-all duration-300 ${
                      isSelected 
                        ? "border-primary shadow-[0_0_20px_rgba(124,58,237,0.4)] scale-110" 
                        : "border-white/10 group-hover:border-white/20"
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${node.color.split(" ")[0]} ${isSelected ? "animate-pulse" : ""}`} />
                  </motion.div>
                  
                  <div className="absolute top-16 md:top-auto md:-bottom-8 text-center w-24 md:w-20 -ml-5 md:ml-0">
                    <span className={`text-[10px] font-semibold transition-colors ${
                      isSelected ? "text-white" : "text-foreground/50 group-hover:text-foreground"
                    }`}>
                      {node.label}
                    </span>
                  </div>

                  {index < nodes.length - 1 && (
                    <div className="w-1 h-6 md:w-8 md:h-1 md:mx-2 bg-gradient-to-b md:bg-gradient-to-r from-white/5 to-white/20 rounded-full my-2 md:my-0 relative overflow-hidden">
                      <motion.div 
                        className="absolute inset-0 bg-primary opacity-50"
                        animate={{
                          x: ["-100%", "100%"],
                          y: ["-100%", "100%"]
                        }}
                        transition={{
                          duration: 2.0,
                          repeat: Infinity,
                          ease: "linear",
                          delay: index * 0.25
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Node Deep-dive Details Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedNodeId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border border-white/5 bg-surface/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${selectedNode.bg} border border-white/10 flex items-center justify-center`}>
                    <NodeIcon className={`w-5 h-5 ${selectedNode.color.split(" ")[0]}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedNode.label} Node Details</h3>
                    <p className="text-xs text-white/50">{selectedNode.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-white/40 shrink-0">
                  <span>Author: <b>{selectedNode.meta.author}</b></span>
                  <span>•</span>
                  <span>Created: <b>{selectedNode.meta.date}</b></span>
                </div>
              </div>

              {/* Detail Contents */}
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-white/30 uppercase font-semibold block mb-2">
                    {selectedNode.meta.detailsLabel}
                  </span>
                  
                  <div className="p-4 rounded-xl border border-white/5 bg-black/40 font-mono text-xs text-white/80 whitespace-pre-line leading-relaxed">
                    {selectedNode.meta.details}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 text-xs text-white">
                    Inspect Semantic Links
                  </Button>
                  <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 text-xs text-white">
                    Open Source Context <ExternalLink className="w-3 h-3 ml-1.5" />
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

    </div>
  )
}
