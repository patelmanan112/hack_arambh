"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"

const contributors = [
  { name: "Rahul", role: "Frontend Lead", avatar: "R", score: 98, expertise: ["React", "Tailwind"] },
  { name: "Manan", role: "AI Engineer", avatar: "M", score: 96, expertise: ["Python", "LLMs"] },
  { name: "Aman", role: "Backend Eng", avatar: "A", score: 92, expertise: ["Node.js", "Redis"] },
  { name: "Sarah", role: "DevOps", avatar: "S", score: 89, expertise: ["Docker", "AWS"] },
]

export function TopContributors() {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
      <CardHeader>
        <CardTitle>Top Contributors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {contributors.map((user, i) => (
            <div key={user.name} className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-10 w-10 border border-white/10 group-hover:border-primary transition-colors">
                    <AvatarFallback className="bg-gradient-to-br from-surface to-surface-hover text-white">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {i === 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium leading-none text-foreground group-hover:text-primary transition-colors">
                    {user.name}
                  </p>
                  <p className="text-xs text-foreground/50 mt-1">{user.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex gap-1">
                  {user.expertise.map(exp => (
                    <span key={exp} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-foreground/70">
                      {exp}
                    </span>
                  ))}
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">{user.score}</div>
                  <div className="text-[10px] text-green-400">Score</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
