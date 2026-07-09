import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import RepositoryModel from '../models/Repository.model.js';
import PullRequestModel from '../models/PullRequest.model.js';
import IssueModel from '../models/Issue.model.js';
import CommitModel from '../models/Commit.model.js';
import ContributorModel from '../models/Contributor.model.js';
import RepositoryDocumentModel from '../models/RepositoryDocument.model.js';
import ProcessingJobModel from '../models/ProcessingJob.model.js';
import type { AuthUser } from '../types/user.js';

export class WorkspaceController {
  /**
   * GET /api/workspace/:id/overview
   * Returns aggregated knowledge base stats for a workspace.
   */
  getOverview = async (req: Request, res: Response): Promise<void> => {
    const user = req.user as AuthUser | undefined;
    if (!user) {
      res.status(401).json({ success: false, error: { message: 'Not authenticated', code: 'UNAUTHORIZED' } });
      return;
    }

    const { id: workspaceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      res.status(400).json({ success: false, error: { message: 'Invalid workspaceId.' } });
      return;
    }

    try {
      // Get all repos in this workspace
      const repos = await RepositoryModel.find({ workspaceId }).lean();
      const repoIds = repos.map((r) => r._id);

      // Parallel count aggregation
      const [prCount, issueCount, commitCount, contributorCount, readmeCount, recentJobs] = await Promise.all([
        PullRequestModel.countDocuments({ repositoryId: { $in: repoIds } }),
        IssueModel.countDocuments({ repositoryId: { $in: repoIds } }),
        CommitModel.countDocuments({ repositoryId: { $in: repoIds } }),
        ContributorModel.countDocuments({ repositoryId: { $in: repoIds } }),
        RepositoryDocumentModel.countDocuments({ repositoryId: { $in: repoIds }, type: 'README' }),
        ProcessingJobModel.find({ workspaceId })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
      ]);

      res.json({
        success: true,
        data: {
          overview: {
            repositoryCount: repos.length,
            commitCount,
            prCount,
            issueCount,
            contributorCount,
            readmeCount,
            repositories: repos.map((r) => ({
              id: r._id,
              name: r.name,
              fullName: r.fullName,
              url: r.url,
              description: r.description,
            })),
            recentJobs: recentJobs.map((j) => ({
              jobId: j._id,
              repositoryFullName: j.repositoryFullName,
              status: j.status,
              progress: j.progress,
              message: j.message,
              createdAt: j.createdAt,
            })),
          },
        },
      });
    } catch (error: any) {
      console.error('[WorkspaceController] Error fetching overview:', error);
      res.status(500).json({ success: false, error: { message: 'Failed to fetch workspace overview' } });
    }
  };
}
