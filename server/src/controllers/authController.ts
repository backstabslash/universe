import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { nameRules, emailRules, passwordRules, tagRules } from "../validation/userDataRules";
import User from "../models/user/userModel";
import Joi from "joi";

class AuthController {
  async login(req: Request, res: Response) {
    const loginSchema = Joi.object({
      email: emailRules,
      password: passwordRules,
    });
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          message: "Invalid password",
        });
      }

      return res.status(200).json({});
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async register(req: Request, res: Response) {
    const registerSchema = Joi.object({
      name: nameRules,
      tag: tagRules,
      email: emailRules,
      password: passwordRules,
    });
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    try {
      const { name, tag, email, password } = req.body;

      const user = await User.findOne({ name });
      if (user) {
        return res.status(400).json({
          message: "User already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        tag,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      return res.status(201).json({});
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}

export default new AuthController();
