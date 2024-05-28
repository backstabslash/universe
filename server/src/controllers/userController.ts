import { Request, Response } from 'express';
import {
  emailRules,
  phoneRules,
  pfpUrlSchema,
  tagRules,
  nameRules,
} from '../validation/userDataRules';
import { uuidRules } from '../validation/commonDataRules';
import User from '../models/user/userModel';
import Joi from 'joi';
import UserRole from '../models/user/userRoleModel';
import Role from '../models/user/roleModel';
import mongoose from 'mongoose';

class UserController {
  async getByEmail(req: Request, res: Response) {
    const getUserByEmailSchema = Joi.object({
      email: emailRules,
      userId: uuidRules,
    });
    const { error } = getUserByEmailSchema.validate(req.body);
    if (error) {
      console.error(error);
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }
      const userRoles = await UserRole.find({ user: user.id }).populate('role');

      const roles = userRoles.map((userRole) => userRole.role.name);
      return res.status(200).json({
        tag: user.tag,
        name: user.name,
        pfp_url: user.pfp_url,
        phone: user.phone,
        email: user.email,
        userId: user.id,
        userRole: roles,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }
      const userRoles = await UserRole.find({ user: user.id }).populate('role');
      const roles = userRoles.map((userRole) => userRole.role.name);

      return res.status(200).json({
        userId: user.id,
        tag: user.tag,
        name: user.name,
        email: user.email,
        pfp_url: user.pfp_url,
        phone: user.phone,
        userRole: roles,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  }

  async getRoles(req: Request, res: Response) {
    try {
      const userRoles = await Role.find().select('name -_id');

      return res.status(200).json(userRoles);
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  }

  async updateUserInfo(req: Request, res: Response) {
    const updateUserSchema = Joi.object({
      email: emailRules,
      userId: uuidRules,
      phone: phoneRules,
      pfp_url: pfpUrlSchema,
      tag: tagRules,
      name: nameRules,
    });

    const { error, value } = updateUserSchema.validate(req.body);
    console.error(error);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    try {
      const { email, phone, pfp_url, tag, name } = value;

      const updatedUser = await User.findOneAndUpdate(
        { email },
        { $set: { phone, pfp_url, tag, name } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      return res.status(200).json({
        tag: updatedUser.tag,
        name: updatedUser.name,
        email: updatedUser.email,
        pfp_url: updatedUser.pfp_url,
        phone: updatedUser.phone,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  }

  async addRoles(req: Request, res: Response) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { userIds, userRoleIds } = req.body;

      const userRoles = userIds
        .map((userId: string) =>
          userRoleIds.map((roleId: string) => ({
            user: userId,
            role: roleId,
          }))
        )
        .flat();

      await UserRole.insertMany(userRoles, { session });

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        message: 'Roles added successfully',
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  }
}

export default new UserController();
