"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0 bg-background">
        <Image
          src="/hero-bg.png"
          alt="Hero Background"
          fill
          priority
          quality={100}
          unoptimized
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/50 border border-white/10 backdrop-blur-sm mb-8"
        >
          <span className="text-xs font-medium text-white/80">
            Exciting Update: Enhancing our runtime integration with new AI providers!
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-serif max-w-4xl tracking-tight leading-[1.1] mb-6"
        >
          The AI teammate that <br className="hidden md:block" />
          never forgets.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mb-10 font-sans leading-relaxed"
        >
          RecallIQ transforms engineering knowledge into a searchable, intelligent memory. Ask questions, automate workflows, remember decisions, and accelerate development.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Button size="lg" className="rounded-full bg-primary hover:bg-primary-hover text-white px-8 h-14 text-base">
            Request a demo today! <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button size="lg" variant="secondary" className="rounded-full px-8 h-14 text-base bg-white text-black hover:bg-white/90">
            Schedule a demo
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
