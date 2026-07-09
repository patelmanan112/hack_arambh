export interface GitHubRepo {
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

export type SortOption = "updated" | "stars" | "name" | "size";
export type FilterOption = "all" | "public" | "private" | "forked";

export interface RepoFilters {
  search: string;
  filter: FilterOption;
  sort: SortOption;
  language: string;
}
