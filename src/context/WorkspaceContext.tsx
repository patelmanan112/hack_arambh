"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface WorkspaceState {
  workspaceId: string | null;
  selectedRepositories: string[];
  processingJobId: string | null;
}

interface WorkspaceContextValue extends WorkspaceState {
  setWorkspaceId: (id: string | null) => void;
  setSelectedRepositories: (repos: string[]) => void;
  setProcessingJobId: (id: string | null) => void;
  clearWorkspace: () => void;
  isHydrated: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

const LOCAL_STORAGE_KEY = "recalliq_onboarding_state";

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WorkspaceState>({
    workspaceId: null,
    selectedRepositories: [],
    processingJobId: null,
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Hydrate from localStorage on initial mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<WorkspaceState>;
        setState((prev) => ({ ...prev, ...parsed }));
        console.log("[WorkspaceProvider] Workspace Restored from localStorage:", parsed);
      } else {
        // Also check for the old legacy key just in case, to migrate them
        const legacyWorkspaceId = localStorage.getItem("recalliq_workspace_id");
        if (legacyWorkspaceId) {
          setState((prev) => ({ ...prev, workspaceId: legacyWorkspaceId }));
          localStorage.removeItem("recalliq_workspace_id"); // clean up legacy
          console.log("[WorkspaceProvider] Workspace Restored (Legacy Migration):", legacyWorkspaceId);
        } else {
          console.log("[WorkspaceProvider] Workspace Missing");
        }
      }
    } catch (err) {
      console.warn("[WorkspaceProvider] Failed to parse localStorage state", err);
      console.log("[WorkspaceProvider] Workspace Missing");
    } finally {
      setIsHydrated(true);
      console.log("[WorkspaceProvider] Workspace Loaded");
    }
  }, []);

  // 2. Sync to localStorage whenever state changes
  useEffect(() => {
    if (!isHydrated) return; // Don't overwrite localStorage before hydration
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    console.log("[WorkspaceProvider] Workspace Saved:", state);
  }, [state, isHydrated]);

  const setWorkspaceId = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, workspaceId: id }));
    if (id) console.log("[WorkspaceProvider] Workspace Created:", id);
  }, []);

  const setSelectedRepositories = useCallback((repos: string[]) => {
    setState((prev) => ({ ...prev, selectedRepositories: repos }));
    if (repos.length > 0) console.log("[WorkspaceProvider] Repository Saved:", repos);
  }, []);

  const setProcessingJobId = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, processingJobId: id }));
    if (id) {
      console.log("[WorkspaceProvider] Processing Started");
      console.log("[WorkspaceProvider] Job Created:", id);
    }
  }, []);

  const clearWorkspace = useCallback(() => {
    setState({
      workspaceId: null,
      selectedRepositories: [],
      processingJobId: null,
    });
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    console.log("[WorkspaceProvider] Workspace Cleared");
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        ...state,
        setWorkspaceId,
        setSelectedRepositories,
        setProcessingJobId,
        clearWorkspace,
        isHydrated,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
