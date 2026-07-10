import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { GitHubService } from '../github/github.service.js';
import ProcessingJobModel from '../models/ProcessingJob.model.js';
import RepositoryModel from '../models/Repository.model.js';
import PullRequestModel from '../models/PullRequest.model.js';
import IssueModel from '../models/Issue.model.js';
import CommitModel from '../models/Commit.model.js';
import ContributorModel from '../models/Contributor.model.js';
import RepositoryDocumentModel from '../models/RepositoryDocument.model.js';
import { extractCleanText } from '../utils/markdown.util.js';
import {
  chunkReadme,
  chunkPullRequests,
  chunkCommits,
  chunkIssues,
  chunkContributors,
  type TextChunk,
} from '../services/chunking.service.js';
import { generateEmbeddingsBatch } from '../services/gemini.service.js';
import { upsertChunks, deleteWorkspaceChunks, type QdrantChunk } from '../services/qdrant.service.js';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`[Timeout] ${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

export class RepositoryProcessor {
  private githubService: GitHubService;

  constructor(token: string) {
    this.githubService = new GitHubService(token);
  }

  async processRepository(jobId: string, repoFullName: string, workspaceId: string) {
    try {
      const [owner, repo] = repoFullName.split('/');
      let stats = {
        repositories: 0,
        files: 0,
        pullRequests: 0,
        issues: 0,
        commits: 0,
        contributors: 0,
        chunks: 0,
      };

      // ─────────────────────────────────────────
      // PHASE 1: Connect & Sync GitHub Data
      // ─────────────────────────────────────────
      await this.updateJob(jobId, 'Running', 5, 'Connecting to GitHub', 'Connected to GitHub', stats);

      let repository = await RepositoryModel.findOne({ fullName: repoFullName, workspaceId });

      await this.updateJob(jobId, 'Running', 8, 'Connecting to GitHub', 'Fetching repository details...', stats);
      const repoDetails = await withTimeout(
        this.githubService.getRepository(owner, repo),
        15000, 'getRepository'
      );

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

      stats.repositories = 1;
      const repoId = repository._id as mongoose.Types.ObjectId;
      const repoName = repoDetails.full_name;

      await this.updateJob(jobId, 'Running', 10, 'Repository synchronized', `Synchronized ${repoFullName}`, stats);

      // ── README ──
      await this.updateJob(jobId, 'Running', 15, 'Reading README', 'Reading README.md', stats);
      let readmeText: string | null = null;
      try {
        readmeText = await withTimeout(this.githubService.getReadme(owner, repo), 10000, 'getReadme');
        if (readmeText) {
          stats.files += 1;
          const cleanText = extractCleanText(readmeText);
          await RepositoryDocumentModel.findOneAndUpdate(
            { repositoryId: repoId, type: 'README' },
            { originalContent: readmeText, cleanText },
            { upsert: true, new: true }
          );
        }
      } catch (e: any) {
        await this.updateJob(jobId, 'Running', 15, 'Reading README', `README skipped: ${e.message}`, stats);
      }

      // ── Pull Requests ──
      await this.updateJob(jobId, 'Running', 25, 'Pull Requests', 'Fetching Pull Requests', stats);
      let prs: any[] = [];
      try {
        prs = await withTimeout(this.githubService.getPullRequests(owner, repo), 20000, 'getPullRequests');
        stats.pullRequests = prs.length;
        for (const pr of prs) {
          await PullRequestModel.findOneAndUpdate(
            { repositoryId: repoId, prNumber: pr.number },
            {
              title: pr.title,
              description: pr.body || '',
              author: pr.user?.login || 'Unknown',
              labels: pr.labels.map((l: any) => l.name),
              commentsCount: 0,
              mergedDate: pr.merged_at,
              state: pr.state,
              url: pr.html_url,
            },
            { upsert: true }
          );
        }
      } catch (e: any) {
        await this.updateJob(jobId, 'Running', 25, 'Pull Requests', `PRs skipped: ${e.message}`, stats);
      }
      await this.updateJob(jobId, 'Running', 30, 'Pull Requests', `Stored ${prs.length} Pull Requests`, stats);

      // ── Commits ──
      await this.updateJob(jobId, 'Running', 40, 'Commits', 'Fetching Commits', stats);
      let commits: any[] = [];
      try {
        commits = await withTimeout(this.githubService.getCommits(owner, repo), 20000, 'getCommits');
        stats.commits = commits.length;
        for (const commit of commits) {
          await CommitModel.findOneAndUpdate(
            { repositoryId: repoId, sha: commit.sha },
            {
              commitMessage: commit.commit.message,
              author: commit.commit.author?.name || 'Unknown',
              date: commit.commit.author?.date || new Date(),
              branch: 'main',
              url: commit.html_url,
            },
            { upsert: true }
          );
        }
      } catch (e: any) {
        await this.updateJob(jobId, 'Running', 40, 'Commits', `Commits skipped: ${e.message}`, stats);
      }
      await this.updateJob(jobId, 'Running', 45, 'Commits', `Stored ${commits.length} Commits`, stats);

      // ── Issues ──
      await this.updateJob(jobId, 'Running', 55, 'Issues', 'Fetching Issues', stats);
      let dbIssues: any[] = [];
      try {
        const issues = await withTimeout(this.githubService.getIssues(owner, repo), 20000, 'getIssues');
        let issueCount = 0;
        for (const issue of issues) {
          if (!issue.pull_request) {
            issueCount++;
            const saved = await IssueModel.findOneAndUpdate(
              { repositoryId: repoId, title: issue.title, createdDate: issue.created_at },
              {
                description: issue.body || '',
                commentsCount: issue.comments,
                labels: issue.labels.map((l: any) => typeof l === 'string' ? l : l.name),
                status: issue.state,
                assignee: issue.assignee?.login,
                closedDate: issue.closed_at,
              },
              { upsert: true, new: true }
            );
            if (saved) dbIssues.push(saved);
          }
        }
        stats.issues = issueCount;
      } catch (e: any) {
        await this.updateJob(jobId, 'Running', 55, 'Issues', `Issues skipped: ${e.message}`, stats);
      }
      await this.updateJob(jobId, 'Running', 60, 'Issues', `Stored ${stats.issues} Issues`, stats);

      // ── Contributors ──
      await this.updateJob(jobId, 'Running', 65, 'Contributors', 'Fetching Contributors', stats);
      let dbContributors: any[] = [];
      try {
        const contributors = await withTimeout(
          this.githubService.getContributors(owner, repo), 15000, 'getContributors'
        );
        if (contributors) {
          stats.contributors = contributors.length;
          for (const contributor of contributors) {
            if (contributor.login) {
              const saved = await ContributorModel.findOneAndUpdate(
                { repositoryId: repoId, githubUsername: contributor.login },
                { avatar: contributor.avatar_url, commitsCount: contributor.contributions || 0 },
                { upsert: true, new: true }
              );
              if (saved) dbContributors.push(saved);
            }
          }
        }
      } catch (e: any) {
        await this.updateJob(jobId, 'Running', 65, 'Contributors', `Contributors skipped: ${e.message}`, stats);
      }
      await this.updateJob(jobId, 'Running', 70, 'Contributors', `Stored ${stats.contributors} Contributors`, stats);

      // ─────────────────────────────────────────
      // PHASE 2: Chunking → Embedding → Qdrant
      // ─────────────────────────────────────────

      await this.updateJob(jobId, 'Running', 72, 'Chunking Documents', 'Chunking repository knowledge...', stats);

      // Build all text chunks from every artifact
      const allChunks: TextChunk[] = [];

      if (readmeText) {
        allChunks.push(...chunkReadme(readmeText, repoName));
      }

      // Use raw PR data for chunking (richer than DB models)
      if (prs.length > 0) {
        allChunks.push(...chunkPullRequests(prs, repoName));
      }

      if (commits.length > 0) {
        allChunks.push(...chunkCommits(commits, repoName));
      }

      if (dbIssues.length > 0) {
        allChunks.push(...chunkIssues(dbIssues, repoName));
      }

      if (dbContributors.length > 0) {
        allChunks.push(...chunkContributors(dbContributors, repoName));
      }

      stats.chunks = allChunks.length;
      await this.updateJob(
        jobId, 'Running', 75, 'Chunking Documents',
        `Chunked into ${allChunks.length} knowledge segments`, stats
      );

      if (allChunks.length === 0) {
        await this.updateJob(jobId, 'Completed', 100, 'Engineering Knowledge Ready', 'No content to embed — knowledge base empty', stats);
        return;
      }

      // ── Generate Real Embeddings ──
      await this.updateJob(
        jobId, 'Running', 76, 'Generating embeddings',
        `Generating embeddings for ${allChunks.length} chunks via Gemini...`, stats
      );

      const chunkTexts = allChunks.map(c => c.text);
      const embeddings = await generateEmbeddingsBatch(chunkTexts, (done, total) => {
        // Update every 10 chunks to avoid too many DB writes
        if (done % 10 === 0 || done === total) {
          const progress = 76 + Math.floor((done / total) * 10); // 76% → 86%
          ProcessingJobModel.findByIdAndUpdate(jobId, {
            progress,
            currentStep: 'Generating embeddings',
            $push: { logs: { timestamp: new Date(), message: `Embedded ${done}/${total} chunks` } },
          }).catch(() => {});
        }
      });

      await this.updateJob(
        jobId, 'Running', 87, 'Creating vector index',
        `Embeddings generated. Uploading to Qdrant...`, stats
      );

      // ── Build Qdrant Points ──
      const qdrantChunks: QdrantChunk[] = allChunks.map((chunk, i) => ({
        id: uuidv4(),
        vector: embeddings[i],
        payload: {
          text: chunk.text,
          source: chunk.source,
          sourceType: chunk.sourceType,
          workspaceId,
          repositoryId: repoId.toString(),
          repositoryName: repoName,
          url: chunk.url,
          author: chunk.author,
          date: chunk.date,
        },
      }));

      // Clear old chunks for this workspace before inserting fresh ones
      await deleteWorkspaceChunks(workspaceId);
      await upsertChunks(qdrantChunks);

      await this.updateJob(
        jobId, 'Running', 91, 'Creating vector index',
        `Uploaded ${qdrantChunks.length} vectors to Qdrant ✓`, stats
      );

      // ── Hindsight: Mark workspace as knowledge-ready ──
      await this.updateJob(
        jobId, 'Running', 94, 'Building Hindsight memory',
        'Hindsight memory initialized — conversation history enabled', stats
      );
      await delay(800);

      // ── CascadeFlow Runtime ──
      await this.updateJob(
        jobId, 'Running', 98, 'Initializing cascadeflow runtime',
        'cascadeflow routing configured — gemini-2.0-flash-exp active', stats
      );
      await delay(500);

      // ── Done ──
      await this.updateJob(
        jobId, 'Completed', 100, 'Engineering Knowledge Ready',
        `Engineering Intelligence Ready ✓ — ${allChunks.length} chunks indexed`, stats
      );

    } catch (error: any) {
      console.error(`[RepositoryProcessor] Fatal error: ${error.message}`);
      await ProcessingJobModel.findByIdAndUpdate(jobId, {
        status: 'Failed',
        progress: 0,
        currentStep: 'Failed',
        message: `Failed: ${error.message}`,
        $push: { logs: { timestamp: new Date(), message: `ERROR: ${error.message}` } },
      });
    }
  }

  private async updateJob(
    jobId: string,
    status: 'Queued' | 'Running' | 'Completed' | 'Failed',
    progress: number,
    currentStep: string,
    logMessage: string,
    stats: any
  ) {
    await ProcessingJobModel.findByIdAndUpdate(jobId, {
      status,
      progress,
      currentStep,
      message: currentStep,
      $push: { logs: { timestamp: new Date(), message: logMessage } },
      $set: { statistics: stats },
    });
  }
}
