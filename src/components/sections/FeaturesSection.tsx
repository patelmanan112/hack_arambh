"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { MessageSquare, GitBranch, Video, CheckSquare, BookOpen, UserCircle, Clock, LineChart } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "AI Engineering Chat",
      description: "Ask anything about your codebase, architecture, decisions, or past conversations.",
      icon: <MessageSquare className="w-5 h-5 text-primary" />,
      delay: 0.1,
    },
    {
      title: "GitHub Integration",
      description: "Seamlessly connect repositories, PRs, issues, commits, wikis, and more.",
      icon: <GitBranch className="w-5 h-5 text-primary" />,
      delay: 0.2,
    },
    {
      title: "Meeting Intelligence",
      description: "Turn meeting notes into summaries, decisions, and action items automatically.",
      icon: <Video className="w-5 h-5 text-primary" />,
      delay: 0.3,
    },
    {
      title: "Task Management",
      description: "Auto-generate tasks from meetings and track them intelligently.",
      icon: <CheckSquare className="w-5 h-5 text-primary" />,
      delay: 0.4,
    },
    {
      title: "Knowledge Base",
      description: "Centralized engineering knowledge with semantic search and long-term memory.",
      icon: <BookOpen className="w-5 h-5 text-primary" />,
      delay: 0.5,
    },
    {
      title: "Developer Profiles",
      description: "AI-powered insights about developers, contributions, expertise, and impact.",
      icon: <UserCircle className="w-5 h-5 text-primary" />,
      delay: 0.6,
    },
    {
      title: "Engineering Timeline",
      description: "Visual timeline of important events, decisions, releases, and milestones.",
      icon: <Clock className="w-5 h-5 text-primary" />,
      delay: 0.7,
    },
    {
      title: "Analytics & Insights",
      description: "Runtime analytics, cost optimization, usage stats, and audit trails.",
      icon: <LineChart className="w-5 h-5 text-primary" />,
      delay: 0.8,
    },
  ];

  return (
    <section className="py-24 bg-background relative z-10" id="product">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span className="text-xs font-semibold tracking-wider text-primary uppercase">Powerful Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif mb-6">Everything your engineering team needs</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: feature.delay }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Card className="h-full hover:bg-surface transition-colors cursor-default group border-border/50">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
