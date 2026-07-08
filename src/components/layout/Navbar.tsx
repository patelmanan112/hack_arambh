"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { UserMenu } from "@/components/auth/UserMenu";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <div className="w-4 h-6 bg-white rounded-full"></div>
            <div className="w-4 h-6 bg-white/60 rounded-full"></div>
            <div className="w-4 h-6 bg-white/30 rounded-full"></div>
          </div>
          <span className="text-xl font-medium tracking-tight">RecallIQ</span>
        </Link>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
        <Link href="#product" className="hover:text-white transition-colors">Product</Link>
        <span className="w-1 h-1 rounded-full bg-white/20"></span>
        <Link href="#resources" className="hover:text-white transition-colors">Resources</Link>
        <span className="w-1 h-1 rounded-full bg-white/20"></span>
        <Link href="#support" className="hover:text-white transition-colors">Support</Link>
      </div>

      <div className="flex items-center gap-4">
        {!isLoading && isAuthenticated ? (
          <UserMenu />
        ) : (
          <>
            <Link href="/login" className="text-sm font-medium hover:text-white/80 transition-colors hidden sm:block">
              Login
            </Link>
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary-hover text-white border-none rounded-full px-6">
                Register
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
