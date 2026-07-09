import type { Request, Response } from 'express';
import WorkspaceModel from '../models/Workspace.model.js';
import UserModel from '../models/User.model.js';
import type { AuthUser } from '../types/user.js';

export class WorkspaceManagementController {
  /**
   * POST /api/workspaces
   * Create a new workspace for the authenticated user.
   */
  createWorkspace = async (req: Request, res: Response): Promise<void> => {
    const user = req.user as AuthUser | undefined;
    if (!user) {
      res.status(401).json({ success: false, error: { message: 'Not authenticated', code: 'UNAUTHORIZED' } });
      return;
    }

    const { name } = req.body as { name?: string };
    if (!name || name.trim().length < 2) {
      res.status(400).json({ success: false, error: { message: 'Workspace name must be at least 2 characters.' } });
      return;
    }

    try {
      // Upsert user in MongoDB (they may not exist yet)
      const dbUser = await UserModel.findOneAndUpdate(
        { githubId: user.id },
        {
          githubId: user.id,
          username: user.username,
          name: user.name ?? undefined,
          email: user.email ?? undefined,
          avatar: user.avatar,
          profileUrl: user.profileUrl,
          provider: user.provider,
        },
        { upsert: true, new: true }
      );

      const workspace = await WorkspaceModel.create({
        name: name.trim(),
        ownerId: dbUser._id,
      });

      res.status(201).json({
        success: true,
        data: {
          workspace: {
            id: workspace._id,
            name: workspace.name,
            ownerId: workspace.ownerId,
            createdAt: workspace.createdAt,
          },
        },
      });
    } catch (error: any) {
      console.error('[WorkspaceManagementController] Error creating workspace:', error);
      res.status(500).json({ success: false, error: { message: 'Failed to create workspace' } });
    }
  };

  /**
   * GET /api/workspaces
   * List all workspaces for the authenticated user.
   */
  listWorkspaces = async (req: Request, res: Response): Promise<void> => {
    const user = req.user as AuthUser | undefined;
    if (!user) {
      res.status(401).json({ success: false, error: { message: 'Not authenticated', code: 'UNAUTHORIZED' } });
      return;
    }

    try {
      const dbUser = await UserModel.findOne({ githubId: user.id });
      if (!dbUser) {
        res.json({ success: true, data: { workspaces: [] } });
        return;
      }

      const workspaces = await WorkspaceModel.find({ ownerId: dbUser._id }).lean();

      res.json({
        success: true,
        data: {
          workspaces: workspaces.map((w) => ({
            id: w._id,
            name: w.name,
            createdAt: w.createdAt,
          })),
        },
      });
    } catch (error: any) {
      console.error('[WorkspaceManagementController] Error listing workspaces:', error);
      res.status(500).json({ success: false, error: { message: 'Failed to list workspaces' } });
    }
  };
}
