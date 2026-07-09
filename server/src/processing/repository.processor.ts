import mongoose from 'mongoose';
import { GitHubService } from '../github/github.service.js';
import ProcessingJobModel from '../models/ProcessingJob.model.js';
import RepositoryModel from '../models/Repository.model.js';
import PullRequestModel from '../models/PullRequest.model.js';
import IssueModel from '../models/Issue.model.js';
import CommitModel from '../models/Commit.model.js';
import ContributorModel from '../models/Contributor.model.js';
import RepositoryDocumentModel from '../models/RepositoryDocument.model.js';
import { extractCleanText } from '../utils/markdown.util.js';

export class RepositoryProcessor {
  private githubService: GitHubService;

  constructor(token: string) {
    this.githubService = new GitHubService(token);
  }

  async processRepository(jobId: string, repoFullName: string, workspaceId: string) {
    try {
      const [owner, repo] = repoFullName.split('/');

      // 10% - Connecting
      await this.updateJob(jobId, 'Running', 10, 'Connecting Repository');

      // Check if repo exists in DB
      let repository = await RepositoryModel.findOne({ fullName: repoFullName, workspaceId });
      
      const repoDetails = await this.githubService.getRepository(owner, repo);
      if (!repository) {
        repository = await RepositoryModel.create({
          githubId: repoDetails.id,
          name: repoDetails.name,
          fullName: repoDetails.full_name,
          owner: repoDetails.owner.login,
          workspaceId: new mongoose.Types.ObjectId(workspaceId),
          url: repoDetails.html_url,
          description: repoDetails.description ?? undefined,
          isPrivate: repoDetails.private,
        });
      }
      
      const repoId = repository._id as mongoose.Types.ObjectId;

      // 25% - Reading README
      await this.updateJob(jobId, 'Running', 25, 'Reading README');
      const readmeText = await this.githubService.getReadme(owner, repo);
      if (readmeText) {
        const cleanText = extractCleanText(readmeText);
        await RepositoryDocumentModel.findOneAndUpdate(
          { repositoryId: repoId, type: 'README' },
          { originalContent: readmeText, cleanText: cleanText },
          { upsert: true, new: true }
        );
      }

      // 40% - Fetching PR
      await this.updateJob(jobId, 'Running', 40, 'Fetching PRs');
      const prs = await this.githubService.getPullRequests(owner, repo);
      for (const pr of prs) {
        await PullRequestModel.findOneAndUpdate(
          { repositoryId: repoId, prNumber: pr.number },
          {
            title: pr.title,
            description: pr.body || '',
            author: pr.user?.login || 'Unknown',
            labels: pr.labels.map((l: any) => l.name),
            commentsCount: 0, // Simplified for now
            mergedDate: pr.merged_at,
            state: pr.state,
            url: pr.html_url
          },
          { upsert: true }
        );
      }

      // 60% - Fetching Commits
      await this.updateJob(jobId, 'Running', 60, 'Fetching Commits');
      const commits = await this.githubService.getCommits(owner, repo);
      for (const commit of commits) {
        await CommitModel.findOneAndUpdate(
          { repositoryId: repoId, sha: commit.sha },
          {
            commitMessage: commit.commit.message,
            author: commit.commit.author?.name || 'Unknown',
            date: commit.commit.author?.date || new Date(),
            branch: 'main', // Simplified, getting actual branch requires more logic
            url: commit.html_url
          },
          { upsert: true }
        );
      }

      // 80% - Fetching Issues
      await this.updateJob(jobId, 'Running', 80, 'Fetching Issues');
      const issues = await this.githubService.getIssues(owner, repo);
      for (const issue of issues) {
        if (!issue.pull_request) { // Skip PRs as they are also considered issues by GitHub API
          await IssueModel.findOneAndUpdate(
            { repositoryId: repoId, title: issue.title, createdDate: issue.created_at },
            {
              description: issue.body || '',
              commentsCount: issue.comments,
              labels: issue.labels.map((l: any) => typeof l === 'string' ? l : l.name),
              status: issue.state,
              assignee: issue.assignee?.login,
              closedDate: issue.closed_at,
            },
            { upsert: true }
          );
        }
      }

      // Contributors
      await this.updateJob(jobId, 'Running', 90, 'Fetching Contributors');
      const contributors = await this.githubService.getContributors(owner, repo);
      if (contributors) {
        for (const contributor of contributors) {
          if (contributor.login) {
             await ContributorModel.findOneAndUpdate(
               { repositoryId: repoId, githubUsername: contributor.login },
               {
                 avatar: contributor.avatar_url,
                 commitsCount: contributor.contributions || 0,
               },
               { upsert: true }
             );
          }
        }
      }

      // 100% - Completed
      await this.updateJob(jobId, 'Completed', 100, 'Completed');

    } catch (error: any) {
      console.error(`[RepositoryProcessor] Error processing repository: ${error.message}`);
      await this.updateJob(jobId, 'Failed', 0, `Failed: ${error.message}`);
    }
  }

  private async updateJob(jobId: string, status: 'Queued' | 'Running' | 'Completed' | 'Failed', progress: number, message: string) {
    await ProcessingJobModel.findByIdAndUpdate(jobId, { status, progress, message });
  }
}
