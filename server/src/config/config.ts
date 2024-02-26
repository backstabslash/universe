import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const api = {
  ip: process.env.API_IP,
  port: process.env.API_PORT,
};

export const client = {
  url: process.env.CLIENT_URL,
};
