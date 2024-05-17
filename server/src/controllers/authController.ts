import { Request, Response } from "express";
import User from "../models/user/userModel";
import { getEnvVar, UserJwtPayload } from "../utils/utils";
import {
  nameRules,
  emailRules,
  passwordRules,
  tagRules,
  verifyCodeRules,
} from "../validation/userDataRules";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import EmailService from "../email-service/emailService";
import UserVerifyCode from "../models/user/userVerifyCodeModel";
import Joi from "joi";

class AuthController {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;

  constructor() {
    this.accessTokenSecret = getEnvVar("ACCESS_TOKEN_SECRET");
    this.refreshTokenSecret = getEnvVar("REFRESH_TOKEN_SECRET");

    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.refreshAccessToken = this.refreshAccessToken.bind(this);
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
    const { name, email, password, verifyCode } = req.body;

    try {
      const user = await User.findOne({ name });
      if (user) {
        return res.status(400).json({
          message: "User already exists",
        });
      }
      const existingUserVerifyCode = await UserVerifyCode.findOne({ email });

      if (existingUserVerifyCode?.verifyCode === verifyCode) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          name,
          email,
          password: hashedPassword,
        });
        await newUser.save();

        await existingUserVerifyCode?.deleteOne();

        return res.status(201).json({});
      } else {
        return res.status(400).json({
          message: "Verify codes do not match",
        });
      }
    } catch (error) {
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

      return res.json({
        accessToken: newAccessToken,
      });
    } catch (err) {
      return res.sendStatus(403);
    }
  }
}

export default new AuthController();
