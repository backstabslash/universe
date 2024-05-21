import { Request, Response } from 'express';
import {
  emailRules,
  emailTemplatesRule,
  nameRules,
  passwordRules,
  tagRules,
  verifyCodeRules,
} from '../validation/userDataRules';
import Joi from 'joi';
import WorkSpace, { IWorkSpace } from '../models/workspace/workspaceModel';
import WorkspaceUser from '../models/workspace/workspaceUserModel';
import User from '../models/user/userModel';
import mongoose from 'mongoose';
import Role from '../models/user/roleModel';
import UserRole from '../models/user/userRoleModel';
import UserGroup from '../models/user/userGroupModel';
import UserVerifyCode from '../models/user/userVerifyCodeModel';
import bcrypt from 'bcrypt';
import Channel, { ChannelType } from '../models/channel/channelModel';
import ChannelUser from '../models/channel/channelUserModel';

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
    const registerSchema = Joi.object({
      name: nameRules,
      tag: tagRules,
      email: emailRules,
      password: passwordRules,
      verifyCode: verifyCodeRules,
      workSpaceName: nameRules,
      emailTemplates: emailTemplatesRule,
    });

    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const { name, email, tag, password, verifyCode, workSpaceName, emailTemplates } = req.body;
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const user = await User.findOne({ email }).session(session);
      if (user) {
        await session.abortTransaction();
        return res.status(400).json({
          message: "User already exists",
        });
      }

      const existingUserVerifyCode = await UserVerifyCode.findOne({ email }).session(session);

      if (existingUserVerifyCode?.verifyCode !== verifyCode) {
        await session.abortTransaction();
        return res.status(400).json({
          message: "Invalid verification code",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        tag,
        email,
        pfp_url: "",
        phone: "",
        password: hashedPassword,
      });
      await newUser.save({ session });

      const userGroup = new UserGroup({
        user: newUser._id,
        name: "General",
      });
      await userGroup.save({ session });

      const savedUser = await User.findOne({ email }).session(session);

      const userRole = await Role.findOne({ name: "administration" }).session(session);

      const newUserRole = new UserRole({
        user: savedUser?._id,
        role: userRole?._id,
      });
      await newUserRole.save({ session });

      const newChannel = new Channel({
        name: name + ' dm',
        owner: savedUser?._id,
        type: ChannelType.DM,
        private: true,
        readonly: false
      })
      await newChannel.save({ session });

      const savedChannel = await Channel.findOne({ owner: savedUser?._id }).session(session);
      const newChannelUser = new ChannelUser({
        user: savedUser?._id,
        channel: savedChannel?._id
      })
      await existingUserVerifyCode?.deleteOne({ session });

      const newWorkSpace = new WorkSpace({
        workSpaceName,
        owner: savedUser?._id,
        emailTemplates,
      });
      await newWorkSpace.save({ session });

      const workspace = await WorkSpace.findOne({ workSpaceName }).session(session);
      const newWorkSpaceUser = new WorkspaceUser({
        workspace: workspace?._id,
        user: savedUser?._id,
      });
      await newWorkSpaceUser.save({ session });

      await session.commitTransaction();
      return res.status(200).json({});
    } catch (error) {
      await session.abortTransaction();

      if ((error as any).code === 11000) {
        return res.status(409).json({
          message: `This email template exists ${(error as any).keyValue?.emailTemplates}`,
        });
      }

      return res.status(500).json({
        message: 'Internal server error',
      });
    } finally {
      session.endSession();
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

      if (userRole?.role.name !== "administration") {
        return res.status(403).json({
          message: 'Forbidden: You are not authorized to perform this action.',
        });
      }

      const updatedWorkspace: IWorkSpace | null = await WorkSpace.findOneAndUpdate(
        { workSpaceName },
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
