"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export function UserMenu() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      window.location.href = "/";
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/dashboard"
        className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-surface/50 px-3 py-1.5 transition-colors hover:bg-surface"
      >
        <Image
          src={user.avatar}
          alt={user.username}
          width={28}
          height={28}
          className="rounded-full"
          unoptimized
        />
        <span className="text-sm font-medium text-white/90">
          {user.name ?? user.username}
        </span>
      </Link>

      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="gap-2 border-white/10 bg-transparent text-white/80 hover:bg-surface hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        {isLoggingOut ? "Logging out..." : "Logout"}
      </Button>
    </div>
  );
}

export function UserProfileCard() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-surface/50 p-6 backdrop-blur-sm">
      <div className="flex items-start gap-4">
        <Image
          src={user.avatar}
          alt={user.username}
          width={72}
          height={72}
          className="rounded-full border border-white/10"
          unoptimized
        />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-semibold">
            {user.name ?? user.username}
          </h2>
          <p className="text-sm text-white/60">@{user.username}</p>
          {user.email && (
            <p className="mt-1 truncate text-sm text-white/50">{user.email}</p>
          )}
          <a
            href={user.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors"
          >
            View GitHub profile
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
