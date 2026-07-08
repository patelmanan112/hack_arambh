"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Check } from "lucide-react";

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for small teams getting started.",
      price: "$29",
      period: "/month",
      features: [
        "Up to 5 users",
        "3 repositories",
        "10,000 memories",
        "Basic analytics",
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
    },
    {
      name: "Professional",
      description: "For growing engineering teams.",
      price: "$79",
      period: "/month",
      popular: true,
      features: [
        "Up to 20 users",
        "10 repositories",
        "100,000 memories",
        "Advanced analytics",
        "Meeting intelligence",
      ],
      buttonText: "Get Started",
      buttonVariant: "default" as const,
    },
    {
      name: "Enterprise",
      description: "For large organizations.",
      price: "Custom",
      period: "",
      features: [
        "Unlimited users",
        "Unlimited repositories",
        "Unlimited memories",
        "Advanced security",
        "Dedicated support",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
    },
  ];

  return (
    <section className="py-24 bg-background relative z-10" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span className="text-xs font-semibold tracking-wider text-primary uppercase">Simple Pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif mb-6">Choose the plan that's right for you.</h2>
          <div className="inline-flex items-center p-1 bg-surface rounded-full border border-border">
            <button className="px-6 py-2 rounded-full bg-background text-sm font-medium shadow-sm">Monthly</button>
            <button className="px-6 py-2 rounded-full text-sm font-medium text-foreground/60 hover:text-foreground transition-colors">Yearly (Save 20%)</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`rounded-2xl border ${plan.popular ? 'border-primary/50 bg-primary/5' : 'border-border bg-surface/50'} p-8 flex flex-col relative`}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary text-primary-foreground border-transparent">Most Popular</Badge>
                </div>
              )}
              
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-sm text-foreground/60 mb-6 min-h-[40px]">{plan.description}</p>
              
              <div className="mb-8 flex items-baseline">
                <span className="text-4xl font-serif font-bold tracking-tight">{plan.price}</span>
                <span className="text-sm text-foreground/60 ml-1">{plan.period}</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={plan.buttonVariant} 
                className={`w-full ${plan.buttonVariant === 'outline' ? 'border-border hover:bg-surface' : ''}`}
              >
                {plan.buttonText}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
