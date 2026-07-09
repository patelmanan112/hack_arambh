import { Octokit } from '@octokit/rest';
import { createGitHubClient } from './github.client.js';

export class GitHubService {
  private octokit: Octokit;

  constructor(token: string) {
    this.octokit = createGitHubClient(token);
  }

  async getRepository(owner: string, repo: string) {
    const { data } = await this.octokit.repos.get({ owner, repo });
    return data;
  }

  async getReadme(owner: string, repo: string): Promise<string | null> {
    try {
      const { data } = await this.octokit.repos.getReadme({
        owner,
        repo,
        mediaType: { format: 'raw' }
      });
      return data as unknown as string;
    } catch (error: any) {
      if (error.status === 404) return null;
      throw error;
    }
  }

  async getPullRequests(owner: string, repo: string) {
    const { data } = await this.octokit.pulls.list({
      owner,
      repo,
      state: 'all',
      per_page: 100
    });
    return data;
  }

  async getIssues(owner: string, repo: string) {
    const { data } = await this.octokit.issues.listForRepo({
      owner,
      repo,
      state: 'all',
      per_page: 100
    });
    return data;
  }

  async getCommits(owner: string, repo: string) {
    const { data } = await this.octokit.repos.listCommits({
      owner,
      repo,
      per_page: 100
    });
    return data;
  }

  async getContributors(owner: string, repo: string) {
    const { data } = await this.octokit.repos.listContributors({
      owner,
      repo,
      per_page: 100
    });
    return data;
  }
}
