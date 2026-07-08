import type { ApiResponse, AuthStatusResponse, AuthUser } from "@/types/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "/api";

/** OAuth login must hit the backend directly — Next.js rewrites break 302 redirects. */
const OAUTH_BASE_URL =
  process.env.NEXT_PUBLIC_OAUTH_URL?.replace(/\/$/, "") ?? API_BASE_URL;

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

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  let payload: ApiResponse<T>;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError("Invalid server response", response.status);
  }

  if (!response.ok || !payload.success) {
    const message =
      !payload.success
        ? payload.error.message
        : "Request failed";

    const code = !payload.success ? payload.error.code : undefined;

    throw new ApiError(message, response.status, code);
  }

  return payload.data;
}

export const authApi = {
  getStatus: () => request<AuthStatusResponse>("/auth/status"),

  getMe: () => request<{ user: AuthUser }>("/auth/me"),

  logout: () =>
    request<{ message: string }>("/auth/logout", {
      method: "POST",
    }),

  getLoginUrl: (provider: "github" = "github") =>
    `${OAUTH_BASE_URL}/auth/${provider}`,
};

export { ApiError };
