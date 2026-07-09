export type OAuthProviderName =
  | "github"
  | "google"
  | "jira"
  | "slack"
  | "microsoft"
  | "discord"
  | "spotify";

export interface AuthUser {
  id: string;
  username: string;
  name: string | null;
  email: string | null;
  avatar: string;
  profileUrl: string;
  provider: OAuthProviderName;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
