import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getEnvVar, UserJwtPayload } from '../utils/utils';

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).send();
    const token = Array.isArray(authHeader)
      ? authHeader[0].split(' ')[1]
      : authHeader.split(' ')[1];
    const decoded = jwt.verify(
      token,
      getEnvVar('ACCESS_TOKEN_SECRET')
    ) as UserJwtPayload;
    if (!decoded) {
      return res.status(403).send();
    }
    req.body.email = decoded.email;
    req.body.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(403).send();
  }
};

export default verifyJWT;
