"use client";

import React from "react";
import { motion } from "framer-motion";

export function TrustedBySection() {
  const logos = [
    { name: "GitHub", text: "GitHub" },
    { name: "MongoDB", text: "MongoDB" },
    { name: "Qdrant", text: "Qdrant" },
    { name: "Groq", text: "Groq" },
    { name: "Next.js", text: "Next.js" },
    { name: "Vercel", text: "Vercel" },
  ];

  return (
    <section className="py-20 border-t border-border/40 relative z-20">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-white/50 mb-8 font-medium">Trusted by engineering teams at</p>
        
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60">
          {logos.map((logo, idx) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="text-xl font-serif font-bold tracking-tight text-white/80 grayscale hover:grayscale-0 transition-all cursor-pointer"
            >
              {logo.text}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
