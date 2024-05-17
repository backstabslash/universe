import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getEnvVar, UserJwtPayload } from "../utils/utils";

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("verifyJWT");
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).send();
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, getEnvVar("ACCESS_TOKEN_SECRET")) as UserJwtPayload;
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
