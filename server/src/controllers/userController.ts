import { Request, Response } from "express";
import { tagRules } from "../validation/userDataRules";
import { uuidRules } from "../validation/commonDataRules";
import User from "../models/user/userModel";
import Joi from "joi";

class UserController {
  async getByTag(req: Request, res: Response) {
    const getUserByTagSchema = Joi.object({
      tag: tagRules,
    });
    const { error } = getUserByTagSchema.validate(req.params);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    try {
      const { tag } = req.params;
      const user = await User.findOne({ tag });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json({
        tag: user.tag,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async getById(req: Request, res: Response) {
    const getUserByIdSchema = Joi.object({
      userId: uuidRules,
    });
    const { error } = getUserByIdSchema.validate(req.params);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json({
        tag: user.tag,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}

export default new UserController();
