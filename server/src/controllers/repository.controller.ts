import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import ProcessingJobModel from '../models/ProcessingJob.model.js';
import { RepositoryProcessor } from '../processing/repository.processor.js';
import type { AuthUser } from '../types/user.js';

export class RepositoryController {
  /**
   * POST /api/repository/process
   * Kicks off background ingestion of a GitHub repository into MongoDB.
   * Body: { workspaceId: string, repositoryId: string (owner/repo) }
   */
  processRepository = async (req: Request, res: Response): Promise<void> => {
    const user = req.user as AuthUser | undefined;
    if (!user) {
      res.status(401).json({ success: false, error: { message: 'Not authenticated', code: 'UNAUTHORIZED' } });
      return;
    }

    const token = req.githubAccessToken;

    if (!token) {
      console.warn("[repository] processRepository failed: githubAccessToken is missing");
      res.status(401).json({ success: false, error: { message: 'GitHub access token not found. Please reconnect GitHub.', code: 'NO_GITHUB_TOKEN' } });
      return;
    }

    const { workspaceId, repositoryId } = req.body as { workspaceId?: string; repositoryId?: string };

    if (!workspaceId || !repositoryId) {
      res.status(400).json({ success: false, error: { message: 'workspaceId and repositoryId are required.' } });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      res.status(400).json({ success: false, error: { message: 'workspaceId must be a valid ObjectId.' } });
      return;
    }

    if (!repositoryId.includes('/')) {
      res.status(400).json({ success: false, error: { message: 'repositoryId must be in owner/repo format.' } });
      return;
    }

    try {
      // Create a processing job record before starting async work
      const job = await ProcessingJobModel.create({
        workspaceId: new mongoose.Types.ObjectId(workspaceId),
        repositoryFullName: repositoryId,
        status: 'Queued',
        progress: 0,
        message: 'Job queued',
      });

      const processor = new RepositoryProcessor(token);

      // Fire-and-forget — the job document tracks progress
      processor.processRepository(job._id.toString(), repositoryId, workspaceId).catch(console.error);

      res.status(202).json({
        success: true,
        data: {
          status: 'processing',
          jobId: job._id,
          message: 'Repository processing started. Poll /api/repository/job/:jobId for progress.',
        },
      });
    } catch (error: any) {
      console.error('[RepositoryController] Error starting processing:', error);
      res.status(500).json({ success: false, error: { message: 'Failed to start processing' } });
    }
  };

  /**
   * GET /api/repository/job/:jobId
   * Poll the progress of a repository processing job.
   */
  getJobStatus = async (req: Request, res: Response): Promise<void> => {
    const user = req.user as AuthUser | undefined;
    if (!user) {
      res.status(401).json({ success: false, error: { message: 'Not authenticated', code: 'UNAUTHORIZED' } });
      return;
    }

    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      res.status(400).json({ success: false, error: { message: 'Invalid jobId.' } });
      return;
    }

    try {
      const job = await ProcessingJobModel.findById(jobId).lean();
      if (!job) {
        res.status(404).json({ success: false, error: { message: 'Job not found.' } });
        return;
      }

      res.json({
        success: true,
        data: {
          jobId: job._id,
          status: job.status,
          progress: job.progress,
          message: job.message,
          currentStep: job.currentStep,
          repositoryFullName: job.repositoryFullName,
          statistics: job.statistics,
          logs: job.logs,
          createdAt: job.createdAt,
          updatedAt: job.updatedAt,
        },
      });
    } catch (error: any) {
      console.error('[RepositoryController] Error fetching job status:', error);
      res.status(500).json({ success: false, error: { message: 'Failed to fetch job status' } });
    }
  };

  /**
   * GET /api/repository/:repoId/data
   * Retrieve processed repository data (PRs, commits, issues, README, contributors).
   */
  getRepositoryData = async (req: Request, res: Response): Promise<void> => {
    const user = req.user as AuthUser | undefined;
    if (!user) {
      res.status(401).json({ success: false, error: { message: 'Not authenticated', code: 'UNAUTHORIZED' } });
      return;
    }

    const { repoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(repoId)) {
      res.status(400).json({ success: false, error: { message: 'Invalid repoId.' } });
      return;
    }

    try {
      const [
        { default: RepositoryModel },
        { default: PullRequestModel },
        { default: IssueModel },
        { default: CommitModel },
        { default: ContributorModel },
        { default: RepositoryDocumentModel },
      ] = await Promise.all([
        import('../models/Repository.model.js'),
        import('../models/PullRequest.model.js'),
        import('../models/Issue.model.js'),
        import('../models/Commit.model.js'),
        import('../models/Contributor.model.js'),
        import('../models/RepositoryDocument.model.js'),
      ]);

      const repoObjectId = new mongoose.Types.ObjectId(repoId);
      const filter = { repositoryId: repoObjectId };

      const [repository, pullRequests, issues, commits, contributors, documents] = await Promise.all([
        RepositoryModel.findById(repoObjectId).lean(),
        PullRequestModel.find(filter).sort({ createdAt: -1 }).limit(50).lean(),
        IssueModel.find(filter).sort({ createdAt: -1 }).limit(50).lean(),
        CommitModel.find(filter).sort({ date: -1 }).limit(50).lean(),
        ContributorModel.find(filter).sort({ commitsCount: -1 }).lean(),
        RepositoryDocumentModel.find(filter).lean(),
      ]);

      if (!repository) {
        res.status(404).json({ success: false, error: { message: 'Repository not found.' } });
        return;
      }

      res.json({
        success: true,
        data: {
          repository,
          pullRequests,
          issues,
          commits,
          contributors,
          documents,
        },
      });
    } catch (error: any) {
      console.error('[RepositoryController] Error fetching repository data:', error);
      res.status(500).json({ success: false, error: { message: 'Failed to fetch repository data' } });
    }
  };
}
