"use client";

import React, { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserProfileCard } from "@/components/auth/UserMenu";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

function DashboardContent() {
  const searchParams = useSearchParams();
  const { user, logout, refreshUser } = useAuth();
  const authSuccess = searchParams.get("auth") === "success";

  useEffect(() => {
    if (authSuccess) {
      void refreshUser();
    }
  }, [authSuccess, refreshUser]);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <header className="border-b border-white/5 bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-xl font-medium tracking-tight">
              RecallIQ
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-white/10 bg-transparent text-white/80 hover:bg-surface"
            >
              Logout
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-6 py-12">
          {authSuccess && (
            <div className="mb-6 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary-foreground">
              Successfully signed in with GitHub.
            </div>
          )}

          <div className="mb-8">
            <h1 className="font-serif text-4xl tracking-tight">
              Dashboard
            </h1>
            <p className="mt-2 text-white/60">
              Welcome{user?.name ? `, ${user.name}` : ""}! You are authenticated.
            </p>
          </div>

          <UserProfileCard />

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <InfoCard label="GitHub ID" value={user?.id ?? "—"} />
            <InfoCard label="Username" value={user?.username ?? "—"} />
            <InfoCard label="Provider" value={user?.provider ?? "—"} />
            <InfoCard label="Email" value={user?.email ?? "Not provided"} />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-surface/30 p-4">
      <p className="text-xs uppercase tracking-wider text-white/40">{label}</p>
      <p className="mt-1 truncate text-sm font-medium">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
