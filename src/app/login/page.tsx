"use client";

import React, { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { GitHubLoginButton } from "@/components/auth/GitHubLoginButton";
import { useAuth } from "@/context/AuthContext";

function LoginContent() {
  const searchParams = useSearchParams();
  const { loginWithGitHub, isAuthenticated, isLoading, error, clearError } =
    useAuth();

  const authError = searchParams.get("error");

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      window.location.href = "/dashboard";
    }
  }, [isAuthenticated, isLoading]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(55,130,116,0.15),_transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex -space-x-2">
              <div className="h-4 w-4 rounded-full bg-white" />
              <div className="h-4 w-4 rounded-full bg-white/60" />
              <div className="h-4 w-4 rounded-full bg-white/30" />
            </div>
            <span className="text-xl font-medium tracking-tight">RecallIQ</span>
          </Link>
        </div>

        <div className="rounded-3xl border border-white/10 bg-surface/60 p-8 backdrop-blur-md shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="font-serif text-3xl tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm text-white/60">
              Sign in to access your RecallIQ workspace
            </p>
          </div>

          {(authError || error) && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {authError === "auth_failed"
                ? "GitHub authentication failed. Please try again."
                : error}
            </div>
          )}

          <GitHubLoginButton
            onClick={() => {
              clearError();
              loginWithGitHub();
            }}
          />

          <p className="mt-6 text-center text-xs text-white/40">
            By continuing, you agree to our terms of service and privacy policy.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-white/50">
          <Link href="/" className="hover:text-white transition-colors">
            ← Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
