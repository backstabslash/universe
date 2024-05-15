import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { loginSchema, registerSchema } from "../validation/authSchemas";
import User from "../models/user/userModel";

class UserController {
  async getUserByLogin(req: Request, res: Response) {}
}

export default new UserController();
