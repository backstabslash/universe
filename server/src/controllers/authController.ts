import { Request, Response } from "express";
import User from "../models/user/userModel";
import { UserJwtPayload } from "../utils/utils";
import { auth } from "../config/config";
import {
  nameRules,
  emailRules,
  passwordRules,
  tagRules,
  verifyCodeRules,

} from '../validation/userDataRules';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import EmailService from '../email-service/emailService';
import UserVerifyCode from '../models/user/userVerifyCodeModel';
import Joi from 'joi';
import WorkSpace from '../models/workspace/workspaceModel';
import WorkspaceUser from '../models/workspace/workspaceUserModel';
import mongoose from 'mongoose';
import UserRole from '../models/user/userRoleModel';
import Role from '../models/user/roleModel';
import UserGroup from "../models/user/userGroupModel";


class AuthController {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;

  constructor() {
    this.accessTokenSecret = auth.accessSecret;
    this.refreshTokenSecret = auth.refreshSecret;

    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.refreshAccessToken = this.refreshAccessToken.bind(this);
    this.verify = this.verify.bind(this);
    this.logout = this.logout.bind(this);
  }

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

      const accessToken = jwt.sign(
        { userId: user._id, email: user.email },
        this.accessTokenSecret,
        { expiresIn: "15m" }
      );
      const refreshToken = jwt.sign(
        { userId: user._id, email: user.email },
        this.refreshTokenSecret,
        { expiresIn: "7d" }
      );

      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({
        accessToken,
      });
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
      verifyCode: verifyCodeRules,
    });

    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const { name, email, tag, password, verifyCode } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.findOne({ email }).session(session);
      if (user) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: "User already exists",
        });
      }

      const existingUserVerifyCode = await UserVerifyCode.findOne({ email }).session(session);

      const emailTemplate = "@" + email.split("@")[1];
      const existingTemplate = await WorkSpace.findOne({ emailTemplates: emailTemplate }).session(
        session
      );
      if (!existingTemplate) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: "There is no workspace with this email template",
        });
      }

      if (existingUserVerifyCode?.verifyCode === verifyCode) {
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

        const userRole = await Role.findOne({ name: "student" }).session(session);

        const newUserRole = new UserRole({
          user: savedUser?._id,
          role: userRole?._id
        })
        await newUserRole.save({ session });

        const newWorkspaceUser = new WorkspaceUser({
          workspace: existingTemplate._id,
          user: savedUser?._id,
        });
        await newWorkspaceUser.save({ session });

        await existingUserVerifyCode?.deleteOne({ session });

        await session.commitTransaction();
        session.endSession();
        return res.status(201).json({});
      } else {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: "Verify codes do not match",
        });
      }
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async verify(req: Request, res: Response) {
    try {
      const { error } = emailRules.validate(req?.body?.email);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
        });
      }
      const { email } = req.body;

      const existingUser = await User.findOne({ email });
      const existingUserVerifyCode = await UserVerifyCode.findOne({ email });

      const emailService = new EmailService();

      if (!existingUser && !existingUserVerifyCode) {
        const confirmationCode = emailService.generateConfirmationCode();

        await UserVerifyCode.create({ email, verifyCode: confirmationCode });

        emailService.sendConfirmationEmail(email, confirmationCode);

        res.status(200).json({ message: "Confirmation code sent successfully" });
      } else if (existingUser) {
        res.status(400).json({ error: "User with this email already exists" });
      } else {
        res.status(400).json({ error: "Verify code has been already sent" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async logout(req: Request, res: Response) {
    const cookies = req.cookies;
    if (!cookies?.refreshtoken) return res.sendStatus(204);
    res.clearCookie("refreshtoken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.sendStatus(204);
  }

  async refreshAccessToken(req: Request, res: Response) {
    const { cookies } = req;
    if (!cookies || !cookies.refreshtoken) {
      return res.sendStatus(401);
    }

    const refreshToken = cookies.refreshtoken;
    try {
      const decoded = jwt.verify(refreshToken, this.refreshTokenSecret) as UserJwtPayload;
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.sendStatus(404);
      }

      const newAccessToken = jwt.sign(
        { userId: user._id, email: user.email },
        this.accessTokenSecret,
        { expiresIn: "15m" }
      );

      const userData = await User.findOne({ email: user.email });
      if (!userData) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json({
        accessToken: newAccessToken,
        tag: userData.tag,
        name: userData.name,
        pfp_url: userData.pfp_url,
        phone: userData.phone,
        email: userData.email,
        userId: userData.id,
      });
    } catch (err) {
      return res.sendStatus(403);
    }
  }
}

export default new AuthController();
