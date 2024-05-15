const jwt = require('jsonwebtoken');
import { getEnvVar, UserJwtPayload } from '../utils/utils';

const verifyJWT = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  jwt.verify(
    token,
    getEnvVar('ACCESS_TOKEN_SECRET'),
    (err: any, decoded: UserJwtPayload) => {
      if (err) return res.sendStatus(403);
      req.body.email = decoded.email;
      req.body.userId = decoded.userId;
      next();
    }
  );
};

export default verifyJWT;
