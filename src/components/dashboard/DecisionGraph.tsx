"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { motion } from "framer-motion"
import { Shield, MessageCircle, Users, FileText, GitPullRequest, GitCommit, Rocket } from "lucide-react"

const nodes = [
  { id: "auth", label: "Authentication", icon: Shield, color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: "slack", label: "Slack Discussion", icon: MessageCircle, color: "text-purple-400", bg: "bg-purple-400/10" },
  { id: "meet", label: "Meeting Decision", icon: Users, color: "text-green-400", bg: "bg-green-400/10" },
  { id: "notion", label: "Notion ADR", icon: FileText, color: "text-white", bg: "bg-white/10" },
  { id: "pr", label: "GitHub PR", icon: GitPullRequest, color: "text-orange-400", bg: "bg-orange-400/10" },
  { id: "commit", label: "Merged Commit", icon: GitCommit, color: "text-red-400", bg: "bg-red-400/10" },
  { id: "prod", label: "Production", icon: Rocket, color: "text-primary", bg: "bg-primary/20" },
]

export function DecisionGraph() {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 overflow-hidden">
      <CardHeader>
        <CardTitle>Engineering Decision Graph</CardTitle>
      </CardHeader>
      <CardContent className="pb-8">
        <div className="relative w-full max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2 mt-4 px-4 overflow-x-auto hide-scrollbar pb-6">
          {nodes.map((node, index) => (
            <div key={node.id} className="flex flex-col sm:flex-row items-center relative z-10 group cursor-pointer">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`w-14 h-14 rounded-2xl ${node.bg} border border-white/10 flex items-center justify-center backdrop-blur-md shadow-lg transition-colors group-hover:border-${node.color.replace('text-', '')}`}
                style={{
                  boxShadow: index === nodes.length - 1 ? '0 0 30px rgba(124,58,237,0.3)' : 'none'
                }}
              >
                <node.icon className={`w-6 h-6 ${node.color}`} />
              </motion.div>
              
              <div className="absolute top-16 sm:top-auto sm:-bottom-8 text-center w-24 sm:w-20 -ml-5 sm:ml-0">
                <span className="text-[10px] font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                  {node.label}
                </span>
              </div>

              {index < nodes.length - 1 && (
                <div className="w-1 h-6 sm:w-8 sm:h-1 sm:mx-2 bg-gradient-to-b sm:bg-gradient-to-r from-white/10 to-white/30 rounded-full my-2 sm:my-0 relative overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 bg-primary opacity-50"
                    animate={{
                      x: ['-100%', '100%'],
                      y: ['-100%', '100%'] // for vertical on mobile
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * 0.2
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
