"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export function FaqSection() {
  const faqs = [
    {
      question: "What is RecallIQ?",
      answer: "RecallIQ is an AI-powered Engineering Intelligence Platform that transforms your organization's engineering knowledge into a searchable, intelligent memory. It connects with GitHub, your meeting notes, and documentation to provide instant answers and automate workflows."
    },
    {
      question: "How does RecallIQ work?",
      answer: "We ingest data from your connected tools (like GitHub, issue trackers, and meeting transcripts), chunk it, and store it in a vector database (Qdrant). Our Hindsight Memory engine and CascadeFlow runtime then use advanced LLMs to retrieve and synthesize this information into actionable insights."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We employ enterprise-grade security, including SOC2 compliance, end-to-end encryption for data at rest and in transit, and strict role-based access controls to ensure your engineering data remains private and secure."
    },
    {
      question: "Can I use RecallIQ with private repositories?",
      answer: "Yes. RecallIQ is designed to work securely with both public and private repositories. You retain full control over which repositories and data sources are connected to the platform."
    }
  ];

  return (
    <section className="py-24 bg-background relative z-10" id="faq">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-serif mb-12">FAQ</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <FaqItem key={idx} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl bg-surface/30 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <span className="font-medium text-sm md:text-base">{question}</span>
        <span className="flex-shrink-0 ml-4">
          {isOpen ? (
            <Minus className="w-4 h-4 text-primary" />
          ) : (
            <Plus className="w-4 h-4 text-foreground/50" />
          )}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 pt-0 text-sm text-foreground/60 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
