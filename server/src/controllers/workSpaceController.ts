import { Request, Response } from 'express';
import {
  emailRules,
  emailTemplatesRule,
  nameRules,
  passwordRules,
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
import WorkspaceChannel from '../models/workspace/workspaceChannelModel';
import WorkspaceRole from '../models/workspace/workspaceRoleModel';

interface PopulatedWorkspaceChannel {
  channel: {
    _id: string;
    name: string;
    private: boolean;
    readonly: boolean;
    owner: string;
  };
}

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

    const { name, email, password, verifyCode, workSpaceName, emailTemplates } =
      req.body;
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const user = await User.findOne({ email }).session(session);
      if (user) {
        await session.abortTransaction();
        return res.status(400).json({
          message: 'User already exists',
        });
      }

      const existingUserVerifyCode = await UserVerifyCode.findOne({
        email,
      }).session(session);

      if (existingUserVerifyCode?.verifyCode !== verifyCode) {
        await session.abortTransaction();
        return res.status(400).json({
          message: 'Invalid verification code',
        });
      }

      const userGroup = new UserGroup({
        name: 'General',
      });
      const newUserGroup = await userGroup.save({ session });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        tag: email.replace('@', '_'),
        email,
        pfp_url: '',
        phone: '',
        password: hashedPassword,
        groupsOrder: [newUserGroup._id],
      });
      const savedUser = await newUser.save({ session });

      const roleNames = ['administration', 'headman', 'worker', 'student'];

      const roles = await Role.find({ name: { $in: roleNames } }).session(
        session
      );

      const newUserRole = new UserRole({
        user: savedUser?._id,
        role: roles?.find((role) => role.name === 'administration')?.id,
      });
      await newUserRole.save({ session });

      const newChannel = new Channel({
        name: 'Notes',
        owner: savedUser?._id,
        type: ChannelType.DM,
        private: true,
        readonly: false,
      });
      const savedChannel = await newChannel.save({ session });

      const newChannelUser = new ChannelUser({
        user: savedUser?._id,
        channel: savedChannel?._id,
      });
      await newChannelUser.save({ session });

      await existingUserVerifyCode?.deleteOne({ session });

      const newWorkSpace = new WorkSpace({
        workSpaceName,
        owner: savedUser?._id,
        emailTemplates,
      });
      const workspace = await newWorkSpace.save({ session });

      const newWorkSpaceUser = new WorkspaceUser({
        workspace: workspace?._id,
        user: savedUser?._id,
      });
      await newWorkSpaceUser.save({ session });

      const workspaceRoles = roles.map((role) => ({
        role: role._id,
        workspace: workspace.id,
      }));

      await WorkspaceRole.insertMany(workspaceRoles, { session });

      await session.commitTransaction();
      return res.status(200).json({});
    } catch (error) {
      await session.abortTransaction();

      if ((error as any).code === 11000) {
        console.error((error as any).keyValue);
        return res.status(409).json({
          message: `This email template exists ${(error as any).keyValue?.emailTemplates
            }`,
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
      const userRolesPromises = users.map(async (user) => {
        const roles = await UserRole.find({ user: user._id }).populate('role');
        return {
          ...user.toObject(),
          userRole: roles.map((userRole) => userRole.role.name),
        };
      });
      const usersWithRoles = await Promise.all(userRolesPromises);

      return res.status(200).json(usersWithRoles);
    } catch (error) {
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  }

  async getWorkspaceChannels(req: Request, res: Response) {
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

      const workspaceChannels = await WorkspaceChannel.find({
        workspace: workspaceUser.workspace,
      }).populate('channel');

      const userChannels = await ChannelUser.find({ user: userId });

      const userChannelIds = userChannels.map((channelUser) =>
        channelUser.channel.toString()
      );

      const filteredChannels = workspaceChannels.filter((workspaceChannel) => {
        const channel = (
          workspaceChannel as unknown as PopulatedWorkspaceChannel
        ).channel;
        return (
          !userChannelIds.includes(channel._id.toString()) && !channel.private
        );
      });

      const channelsToReturn = filteredChannels.map((workspaceChannel) => {
        const channel = (
          workspaceChannel as unknown as PopulatedWorkspaceChannel
        ).channel;
        return {
          id: channel._id,
          name: channel.name,
          private: channel.private,
          readonly: channel.readonly,
          owner: channel.owner,
        };
      });

      const channelIds = channelsToReturn.map((channel) => channel.id);

      const channelUsers = await ChannelUser.find({
        channel: { $in: channelIds },
      }).populate('user');

      const userDetails = channelUsers.map((channelUser) => {
        return {
          channelId: channelUser.channel,
          user: {
            _id: channelUser.user._id,
            name: channelUser.user.name,
          },
        };
      });

      const channelsWithUsers = channelsToReturn.map((channel: any) => {
        return {
          ...channel,
          users: userDetails
            .filter(
              (userDetail) =>
                userDetail.channelId.toString() === channel.id.toString()
            )
            .map((detail) => detail.user),
        };
      });

      return res.status(200).json(channelsWithUsers);
    } catch (error) {
      return res.status(500).json({
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

      const { owner, workSpaceName, pfp_url, emailTemplates } = workspace;
      return res
        .status(200)
        .json({ ownerId: owner, workSpaceName, pfp_url, emailTemplates });
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  }

  async updateWorkspaceAvatar(req: Request, res: Response) {
    try {
      const { userId, workSpaceName, pfp_url } = req.body;

      const userRole = await UserRole.findOne({ user: userId }).populate(
        'role'
      );

      if (userRole?.role.name !== 'administration') {
        return res.status(403).json({
          message: 'Forbidden: You are not authorized to perform this action.',
        });
      }

      const updatedWorkspace: IWorkSpace | null =
        await WorkSpace.findOneAndUpdate(
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
  async addWorkSpaceRoles(req: Request, res: Response) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { workSpaceName, roleNames } = req.body;
      const workSpace = await WorkSpace.findOne({ workSpaceName });

      if (!workSpace) {
        return res.status(404).json({
          message: 'Workspace not found.',
        });
      }

      const existingWorkspaceRoles = await WorkspaceRole.find({
        workspace: workSpace.id,
      }).populate('role');
      const existingRoleNames = existingWorkspaceRoles.map(
        (workspaceRole) => workspaceRole.role.name
      );

      const newRoles = [];

      for (const roleName of roleNames) {
        if (!existingRoleNames.includes(roleName)) {
          const newRole = new Role({ name: roleName });
          const savedRole = await newRole.save({ session });

          const newWorkSpaceRole = new WorkspaceRole({
            role: savedRole.id,
            workspace: workSpace.id,
          });
          await newWorkSpaceRole.save({ session });
          newRoles.push(roleName);
        }
      }

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({ addedRoles: newRoles });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  }

  async getWorkSpaceRoles(req: Request, res: Response) {
    try {
      const { workSpaceName } = req.body;

      const workSpace = await WorkSpace.findOne({ workSpaceName });
      if (!workSpace) {
        return res.status(404).json({
          message: 'Workspace not found.',
        });
      }

      const workSpaceRoles = await WorkspaceRole.find({
        workspace: workSpace.id,
      }).populate('role');

      const roles = workSpaceRoles.map((workspaceRole) => workspaceRole.role);

      return res.status(200).json({ roles });
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  }

  async changeWorkSpaceEmailTemplates(req: Request, res: Response) {
    try {
      const { emailTemplates, workSpaceName } = req.body;

      if (!emailTemplates || !Array.isArray(emailTemplates)) {
        return res
          .status(400)
          .json({ message: 'Invalid email templates data' });
      }

      const workSpace = await WorkSpace.findOne({ workSpaceName });
      if (!workSpace) {
        return res.status(404).json({ message: 'Workspace not found' });
      }

      workSpace.emailTemplates = emailTemplates;
      await workSpace.save();

      return res.status(200).json();
    } catch (error) {
      if ((error as any).code === 11000) {
        console.error((error as any).keyValue);
        return res.status(409).json({
          message: `This email template exists in another workspace ${(error as any).keyValue?.emailTemplates
            }`,
        });
      }

      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  }
}

export default new WorkSpacerController();
