import jwt, { JwtPayload } from "jsonwebtoken";
import { Socket } from "socket.io";
import { getEnvVar } from "../utils/utils";
import User from "../models/user/userModel";

const verifySocketJwt = async (socket: Socket, next: (err?: Error) => void) => {
  const refreshToken = socket.handshake.headers.cookie?.split("token=")[1];
  if (!refreshToken) {
    return next(new Error("Authentication error"));
  }
  const decoded = jwt.verify(refreshToken, getEnvVar("REFRESH_TOKEN_SECRET")) as JwtPayload;

  const user = await User.findById(decoded.userId);
  if (!user) {
    return next(new Error("No such user"));
  }

  socket.data.userId = decoded.userId;
  next();
};

export default verifySocketJwt;
