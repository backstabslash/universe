import { Request, Response } from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import User from "../models/user/userModel";

class AuthController {
  async login(req: Request, res: Response) {
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
  }

  async register(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const user = await User.findOne({ name });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    return res.status(201).json({});
  }
}

export default new AuthController();
