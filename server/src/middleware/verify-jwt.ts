import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import { UserJwtPayload } from "../utils/utils";
import { auth } from "../config/config";

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).send();
    const token = authHeader.split(" ")[1];

    const decoded = Jwt.verify(token, auth.accessSecret) as UserJwtPayload;
    if (!decoded) {
      return res.status(403).send();
    }
    req.body.email = decoded.email;
    req.body.userId = decoded.userId;

    next();
  } catch (error) {
    console.error(error);
  }
};

export default verifyJWT;
