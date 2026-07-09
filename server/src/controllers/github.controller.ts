import type { Request, Response } from "express";
import type { AuthUser } from "../types/user.js";
import UserModel from "../models/User.model.js";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  size: number;
  default_branch: string;
  fork: boolean;
  updated_at: string;
  pushed_at: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  visibility: string;
}

export class GitHubController {
  getRepos = async (req: Request, res: Response): Promise<void> => {
    const user = req.user as AuthUser | undefined;
    let token = req.session.githubAccessToken;

    if (!token && user) {
      try {
        const dbUser = await UserModel.findOne({ githubId: user.id });
        if (dbUser?.githubAccessToken) {
          token = dbUser.githubAccessToken;
          req.session.githubAccessToken = token;
          console.log("[github] Restored GitHub access token from MongoDB for user:", user.username);
        }
      } catch (err) {
        console.error("[github] Failed to restore token from DB:", err);
      }
    }

    if (!token) {
      console.warn("[github] getRepos failed: githubAccessToken is missing");
      res.status(401).json({
        success: false,
        error: { message: "GitHub access token not found. Please reconnect GitHub.", code: "NO_GITHUB_TOKEN" },
      });
      return;
    }

    console.log(`[github] Fetching repositories using token: ${token.substring(0, 8)}...`);

    try {
      // Paginate to get all repos (up to 300)
      const allRepos: GitHubRepo[] = [];
      let page = 1;
      const perPage = 100;

      while (page <= 3) {
        const response = await fetch(
          `https://api.github.com/user/repos?per_page=${perPage}&page=${page}&sort=updated&affiliation=owner,collaborator`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/vnd.github.v3+json",
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          res.status(response.status).json({
            success: false,
            error: {
              message: (errorBody as { message?: string }).message ?? "GitHub API error",
              code: "GITHUB_API_ERROR",
            },
          });
          return;
        }

        const repos = (await response.json()) as GitHubRepo[];
        allRepos.push(...repos);

        if (repos.length < perPage) break;
        page++;
      }

      res.json({
        success: true,
        data: {
          repositories: allRepos,
          total: allRepos.length,
        },
      });
    } catch (error) {
      console.error("[github] Error fetching repos:", error);
      res.status(500).json({
        success: false,
        error: { message: "Failed to fetch repositories from GitHub", code: "FETCH_ERROR" },
      });
    }
  };

  selectRepositories = async (req: Request, res: Response): Promise<void> => {
    const user = req.user as AuthUser | undefined;
    if (!user) {
      res.status(401).json({ success: false, error: { message: "Not authenticated", code: "UNAUTHORIZED" } });
      return;
    }

    const { repositories } = req.body as { repositories?: string[] };

    if (!Array.isArray(repositories) || repositories.length === 0) {
      res.status(400).json({
        success: false,
        error: { message: "repositories must be a non-empty array of repo full_names", code: "INVALID_BODY" },
      });
      return;
    }

    // Store in session for next steps (in production this would go to DB)
    req.session.selectedRepositories = repositories;

    res.json({
      success: true,
      data: { selected: repositories, count: repositories.length },
    });
  };

  getSelectedRepositories = (req: Request, res: Response): void => {
    const selected = req.session.selectedRepositories ?? [];
    res.json({ success: true, data: { selected } });
  };
}
