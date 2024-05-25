import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const db = {
  mongoUri: process.env.MONGO_URI,
};

export const api = {
  ip: process.env.API_IP,
  port: process.env.API_PORT,
};

export const auth = {
  accessSecret: process.env.ACCESS_TOKEN_SECRET!,
  refreshSecret: process.env.REFRESH_TOKEN_SECRET!,
};

export const client = {
  url: process.env.CLIENT_URL,
};

export const emailService = {
  login: process.env.EMAIL_SERVICE_LOGIN!,
  pass: process.env.EMAIL_SERVICE_PASS!,
};

export const driveService = {
  email: process.env.DRIVE_SERVICE_ACCOUNT_EMAIL!,
  privateKey: process.env.DRIVE_SERVICE_PRIVATE_KEY!,
};
