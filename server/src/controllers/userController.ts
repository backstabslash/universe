import { Request, Response } from "express";
import {
  emailRules,
  phoneRules,
  pfpUrlSchema,
  tagRules,
  nameRules,
} from "../validation/userDataRules";
import { uuidRules } from "../validation/commonDataRules";
import User from "../models/user/userModel";
import Joi from "joi";
import UserRole from "../models/user/userRoleModel";
import Role from "../models/user/roleModel";
import mongoose from "mongoose";

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
          message: "User not found",
        });
      }
      const userRoles = await UserRole.find({ user: user.id }).populate("role");
      const roles = userRoles.map((userRole) => ({
        id: userRole.role.id,
        name: userRole.role.name,
      }));

      return res.status(200).json({
        tag: user.tag,
        name: user.name,
        pfp_url: user.pfp_url,
        phone: user.phone,
        email: user.email,
        userId: user.id,
        userRole: roles.map((role) => role.name),
        roles,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      const userRoles = await UserRole.find({ user: user.id }).populate("role");
      const roles = userRoles.map((userRole) => ({
        id: userRole.role.id,
        name: userRole.role.name,
      }));

      return res.status(200).json({
        userId: user.id,
        tag: user.tag,
        name: user.name,
        email: user.email,
        pfp_url: user.pfp_url,
        phone: user.phone,
        userRole: roles.map((role) => role.name),
        roles,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async getRoles(req: Request, res: Response) {
    try {
      const userRoles = await Role.find().select("name -_id");

      return res.status(200).json(userRoles);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
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
          message: "User not found",
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
        message: "Internal server error",
      });
    }
  }

  async addRoles(req: Request, res: Response) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { userIds, userRoleIds } = req.body;
      const roleNames = ["administration", "headman", "worker", "student"];

      const newRoleIds = userRoleIds.map((roleId: string) => new mongoose.Types.ObjectId(roleId));

      const rolesToReplace = await Role.find({ name: { $in: roleNames } });
      const rolesToReplaceIds = rolesToReplace.map((role) => role._id);

      const userRoles = userIds
        .map((userId: string) =>
          newRoleIds.map((roleId: string) => ({
            user: new mongoose.Types.ObjectId(userId),
            role: roleId,
          }))
        )
        .flat();

      const existingUserRoles = await UserRole.find({
        user: { $in: userIds.map((userId: string) => new mongoose.Types.ObjectId(userId)) },
        role: { $in: rolesToReplaceIds },
      }).session(session);

      const hasRolesToReplace = userRoleIds.some((roleId: string) =>
        rolesToReplaceIds.some((id) => (id as any).toString() === roleId)
      );



      if (existingUserRoles.length > 0 && hasRolesToReplace) {
        await UserRole.deleteMany({
          user: { $in: existingUserRoles.map((userRole) => userRole.user) },
          role: { $in: rolesToReplaceIds },
        }).session(session);
      }

      const existingConnections = new Set(
        existingUserRoles.map(
          (userRole) => `${userRole.user.toString()}-${userRole.role.toString()}`
        )
      );

      const newUserRoles = userRoles.filter(
        (userRole: any) => !existingConnections.has(`${userRole.user}-${userRole.role}`)
      );

      if (newUserRoles.length > 0) {
        await UserRole.insertMany(newUserRoles, { session });
      }

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        message: "Roles added successfully",
        addedRoles: newUserRoles.length,
        skippedRoles: existingUserRoles.length,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error adding roles:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async removeRole(req: Request, res: Response) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { userId, roleId } = req.body;

      const userRole = await UserRole.findOneAndDelete({
        user: new mongoose.Types.ObjectId(userId),
        role: new mongoose.Types.ObjectId(roleId),
      }).session(session);

      await session.commitTransaction();
      session.endSession();

      if (!userRole) {
        return res.status(404).json({
          message: "Role not found for the user",
        });
      }

      return res.status(200).json({
        message: "Role removed successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error removing role:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}

export default new UserController();
