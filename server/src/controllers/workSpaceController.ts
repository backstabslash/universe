import { Request, Response } from 'express';
import {
  emailRules,
  emailTemplatesRule,
  nameRules,
} from '../validation/userDataRules';
import Joi from 'joi';
import WorkSpace, { IWorkSpace } from '../models/workspace/workspaceModel';
import WorkspaceUser from '../models/workspace/workspaceUserModel';
import User from '../models/user/userModel';
import mongoose from 'mongoose';
import Role from '../models/user/roleModel';
import UserRole from '../models/user/userRoleModel';

class WorkSpacerController {
  async checkName(req: Request, res: Response) {
    const checkNameSchema = Joi.object({
      workSpaceName: nameRules,
    });
    const { error } = checkNameSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    try {
      const { workSpaceName } = req.body;
      const workSpace = await WorkSpace.findOne({
        workSpaceName: workSpaceName,
      });
      if (workSpace) {
        return res.status(401).json({
          message: 'Workspace with this name already exists',
        });
      }
      return res.status(200).json({
        message: 'Workspace name is available',
      });
    } catch (error) {
      res.status(400).json({
        message: 'Internal server error',
      });
    }
  }

  async addWorkSpace(req: Request, res: Response) {
    const addWorkSpaceSchema = Joi.object({
      workSpaceName: nameRules,
      ownerEmail: emailRules,
      emailTemplates: emailTemplatesRule,
    });

    const { error } = addWorkSpaceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { ownerEmail, workSpaceName, emailTemplates } = req.body;
      const owner = await User.findOne({ email: ownerEmail }).session(session);

      if (!owner) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          message: 'Owner not found',
        });
      }

      const userRole = await Role.findOne({ name: "administration" }).session(session);

      const updatedUserRole = await UserRole.findOneAndUpdate(
        { user: owner?._id },
        { role: userRole?._id },
        { new: true, upsert: true }
      );
      await updatedUserRole.save({ session });

      const newWorkSpace = new WorkSpace({
        workSpaceName,
        owner: owner._id,
        emailTemplates,
      });

      await newWorkSpace.save({ session });

      const workspace = await WorkSpace.findOne({ workSpaceName }).session(session);
      const newWorkSpaceUser = new WorkspaceUser({
        workspace: workspace?._id,
        user: owner._id,
      });

      await newWorkSpaceUser.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({});
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      if ((error as any).code === 11000) {
        return res.status(409).json({
          message: `This email template exists ${(error as any).keyValue?.emailTemplates}`,
        });
      }

      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  }

  async getWorkspaceUsers(req: Request, res: Response) {
    try {
      const { userId } = req.body;

      const workspaceUser = await WorkspaceUser.findOne({ user: userId });
      if (!workspaceUser) {
        return res
          .status(404)
          .json({ message: 'User does not belong to any workspace.' });
      }

      const workspaceUsers = await WorkspaceUser.find({
        workspace: workspaceUser.workspace,
      });

      const userIds = workspaceUsers.map((wsUser) => wsUser.user);

      const users = await User.find({ _id: { $in: userIds } }, { password: 0 });

      return res.status(200).json(users);
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  }
  async getWorkspaceData(req: Request, res: Response) {
    try {
      const { userId } = req.body;

      const workspaceUser = await WorkspaceUser.findOne({ user: userId });
      if (!workspaceUser) {
        return res
          .status(404)
          .json({ message: 'User does not belong to any workspace.' });
      }

      const workspace = await WorkSpace.findById(workspaceUser.workspace);
      if (!workspace) {
        return res.status(404).json({ message: 'Workspace not found.' });
      }

      const { owner, workSpaceName, pfp_url } = workspace;
      return res.status(200).json({ ownerId: owner, workSpaceName, pfp_url });
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  }

  async updateWorkspaceAvatar(req: Request, res: Response) {
    try {
      const { userId, workSpaceName, pfp_url } = req.body;

      const userRole = await UserRole.findOne({ user: userId }).populate('role');
      console.log(userRole);

      if (userRole?.role.name !== "administration") {
        return res.status(403).json({
          message: 'Forbidden: You are not authorized to perform this action.',
        });
      }

      const updatedWorkspace: IWorkSpace | null = await WorkSpace.findOneAndUpdate(
        { name: workSpaceName },
        { $set: { pfp_url } },
        { new: true }
      );

      if (!updatedWorkspace) {
        return res.status(404).json({
          message: 'Workspace not found.',
        });
      }
      return res.status(200).json();
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  }
}

export default new WorkSpacerController();
