import type { ApiResponse, AuthStatusResponse, AuthUser } from "@/types/auth";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "/api";

/** OAuth login must hit the backend directly — Next.js rewrites break 302 redirects. */
const OAUTH_BASE_URL =
  process.env.NEXT_PUBLIC_OAUTH_URL?.replace(/\/$/, "") ?? API_BASE_URL;

// ─── JWT token storage ────────────────────────────────────────────────────────

const TOKEN_KEY = "recalliq_jwt";

function readTokenFromUrl(): string | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const tokenFromUrl = params.get("token");

  if (tokenFromUrl) {
    setToken(tokenFromUrl);

    const url = new URL(window.location.href);
    url.searchParams.delete("token");
    window.history.replaceState({}, "", url.toString());
    return tokenFromUrl;
  }

  return null;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  const storedToken = localStorage.getItem(TOKEN_KEY);
  if (storedToken) return storedToken;

  return readTokenFromUrl();
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

// ─── Errors ──────────────────────────────────────────────────────────────────

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── Core fetch helper ───────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let payload: ApiResponse<T>;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError("Invalid server response", response.status);
  }

  if (!response.ok || !payload.success) {
    const message = !payload.success ? payload.error.message : "Request failed";
    const code = !payload.success ? payload.error.code : undefined;
    throw new ApiError(message, response.status, code);
  }

  return payload.data;
}

// ─── Auth API ────────────────────────────────────────────────────────────────

export const authApi = {
  getStatus: () => request<AuthStatusResponse>("/auth/status"),

  getMe: () => request<{ user: AuthUser }>("/auth/me"),

  logout: async () => {
    const result = await request<{ message: string }>("/auth/logout", {
      method: "POST",
    });
    clearToken();
    return result;
  },

  getLoginUrl: (provider: "github" = "github") =>
    `${OAUTH_BASE_URL}/auth/${provider}`,
};

// ─── Dashboard API ───────────────────────────────────────────────────────────

export interface DashboardData {
  overview: {
    repositoryCount: number;
    commitCount: number;
    prCount: number;
    issueCount: number;
    contributorCount: number;
    starsCount: number;
    forksCount: number;
    healthScore: number;
  };
  repositories: Array<{
    id: string;
    githubId: number;
    name: string;
    fullName: string;
    owner: string;
    url: string;
    language?: string;
    stargazersCount: number;
    forksCount: number;
    openIssuesCount: number;
    contributorsCount: number;
    updatedAt: string;
    healthScore: number;
  }>;
  recentActivity: {
    commits: Array<{ id: string; sha: string; message: string; author: string; date: string; url: string; repository: string; }>;
    prs: Array<{ id: string; title: string; author: string; state: string; date: string; url: string; repository: string; }>;
    issues: Array<{ id: string; title: string; status: string; author: string; date: string; repository: string; }>;
  };
  charts: {
    commitActivity: Array<{ date: string; commits: number; }>;
    languageDistribution: Array<{ name: string; value: number; percentage: number; }>;
    topContributors: Array<{ name: string; avatar: string; commits: number; prs: number; }>;
    issueAnalytics: Array<{ status: string; count: number; }>;
    prAnalytics: Array<{ state: string; count: number; }>;
  };
}

export const dashboardApi = {
  getWorkspaceDashboard: (workspaceId: string) => 
    request<DashboardData>(`/dashboard/workspace/${workspaceId}`),
};

export { ApiError, request };
