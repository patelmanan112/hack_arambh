import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import RepositoryModel from '../models/Repository.model.js';
import PullRequestModel from '../models/PullRequest.model.js';
import IssueModel from '../models/Issue.model.js';
import CommitModel from '../models/Commit.model.js';
import ContributorModel from '../models/Contributor.model.js';
import type { AuthUser } from '../types/user.js';

export class DashboardController {
  getWorkspaceDashboard = async (req: Request, res: Response): Promise<void> => {
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
      const repos = await RepositoryModel.find({ workspaceId }).lean();
      const repoIds = repos.map((r) => r._id);

      if (repos.length === 0) {
        res.json({
          success: true,
          data: {
            overview: {
              repositoryCount: 0,
              commitCount: 0,
              prCount: 0,
              issueCount: 0,
              contributorCount: 0,
              starsCount: 0,
              forksCount: 0,
              healthScore: 0,
            },
            repositories: [],
            recentActivity: { commits: [], prs: [], issues: [] },
            charts: {
              commitActivity: [],
              languageDistribution: [],
              topContributors: [],
              issueAnalytics: [],
              prAnalytics: [],
            },
          },
        });
        return;
      }

      // Parallel Data Fetching
      const [
        commitsCount,
        prCount,
        issueCount,
        recentCommits,
        recentPrs,
        recentIssues,
        topContributors,
        commitActivityRaw,
        issueAnalyticsRaw,
        prAnalyticsRaw
      ] = await Promise.all([
        CommitModel.countDocuments({ repositoryId: { $in: repoIds } }),
        PullRequestModel.countDocuments({ repositoryId: { $in: repoIds } }),
        IssueModel.countDocuments({ repositoryId: { $in: repoIds } }),
        CommitModel.find({ repositoryId: { $in: repoIds } }).sort({ date: -1 }).limit(10).lean(),
        PullRequestModel.find({ repositoryId: { $in: repoIds } }).sort({ createdAt: -1 }).limit(10).lean(),
        IssueModel.find({ repositoryId: { $in: repoIds } }).sort({ createdDate: -1 }).limit(10).lean(),
        ContributorModel.aggregate([
          { $match: { repositoryId: { $in: repoIds } } },
          { $group: { _id: "$githubUsername", avatar: { $first: "$avatar" }, commits: { $sum: "$commitsCount" }, prs: { $sum: "$prCount" } } },
          { $sort: { commits: -1 } },
          { $limit: 10 }
        ]),
        CommitModel.aggregate([
          { $match: { repositoryId: { $in: repoIds }, date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
              commits: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]),
        IssueModel.aggregate([
          { $match: { repositoryId: { $in: repoIds } } },
          { $group: { _id: "$status", count: { $sum: 1 } } }
        ]),
        PullRequestModel.aggregate([
          { $match: { repositoryId: { $in: repoIds } } },
          { $group: { _id: "$state", count: { $sum: 1 } } }
        ])
      ]);

      // Calculate Stars and Forks
      let starsCount = 0;
      let forksCount = 0;
      let openIssuesCount = 0;
      let totalContributors = 0;

      const languageMap = new Map<string, number>();

      repos.forEach(repo => {
        starsCount += repo.stargazersCount || 0;
        forksCount += repo.forksCount || 0;
        openIssuesCount += repo.openIssuesCount || 0;
        totalContributors += repo.contributorsCount || 0;
        
        if (repo.language) {
          languageMap.set(repo.language, (languageMap.get(repo.language) || 0) + 1);
        }
      });

      const languageDistribution = Array.from(languageMap.entries()).map(([name, count]) => ({
        name,
        value: count,
        percentage: Math.round((count / repos.length) * 100)
      })).sort((a, b) => b.value - a.value);

      // Health Score Calculation
      const closedPrs = prAnalyticsRaw.find(p => p._id === 'closed' || p._id === 'merged')?.count || 0;
      const openIssues = issueAnalyticsRaw.find(i => i._id === 'open')?.count || openIssuesCount || 1; 
      const healthScoreRaw = Math.min(100, Math.max(0, 50 + (closedPrs * 2) - (openIssues * 1.5) + (commitsCount * 0.05)));
      const healthScore = Math.round(healthScoreRaw);

      const repoMap = new Map(repos.map(r => [r._id.toString(), r.fullName]));

      res.json({
        success: true,
        data: {
          overview: {
            repositoryCount: repos.length,
            commitCount: commitsCount,
            prCount: prCount,
            issueCount: issueCount,
            contributorCount: totalContributors || topContributors.length,
            starsCount,
            forksCount,
            healthScore,
          },
          repositories: repos.map(r => ({
            id: r._id,
            githubId: r.githubId,
            name: r.name,
            fullName: r.fullName,
            owner: r.owner,
            url: r.url,
            language: r.language,
            stargazersCount: r.stargazersCount || 0,
            forksCount: r.forksCount || 0,
            openIssuesCount: r.openIssuesCount || 0,
            contributorsCount: r.contributorsCount || 0,
            updatedAt: r.updatedAt,
            healthScore: Math.round(Math.min(100, Math.max(50, 70 + (r.stargazersCount || 0)*0.1 - (r.openIssuesCount || 0)*0.5))),
          })).sort((a,b) => b.healthScore - a.healthScore),
          recentActivity: {
            commits: recentCommits.map(c => ({
              id: c._id,
              sha: c.sha,
              message: c.commitMessage,
              author: c.author,
              date: c.date,
              url: c.url,
              repository: repoMap.get(c.repositoryId.toString()) || 'Unknown',
            })),
            prs: recentPrs.map(p => ({
              id: p._id,
              title: p.title,
              author: p.author,
              state: p.state,
              date: p.createdAt,
              url: p.url,
              repository: repoMap.get(p.repositoryId.toString()) || 'Unknown',
            })),
            issues: recentIssues.map(i => ({
              id: i._id,
              title: i.title,
              status: i.status,
              author: i.assignee || 'Unassigned',
              date: i.createdDate,
              repository: repoMap.get(i.repositoryId.toString()) || 'Unknown',
            }))
          },
          charts: {
            commitActivity: commitActivityRaw.map(c => ({
              date: c._id,
              commits: c.commits,
            })),
            languageDistribution,
            topContributors: topContributors.map(c => ({
              name: c._id,
              avatar: c.avatar,
              commits: c.commits,
              prs: c.prs,
            })),
            issueAnalytics: issueAnalyticsRaw.map(i => ({
              status: i._id,
              count: i.count,
            })),
            prAnalytics: prAnalyticsRaw.map(p => ({
              state: p._id,
              count: p.count,
            })),
          }
        },
      });
    } catch (error: any) {
      console.error('[DashboardController] Error fetching dashboard data:', error);
      res.status(500).json({ success: false, error: { message: 'Failed to fetch dashboard data' } });
    }
  };
}
