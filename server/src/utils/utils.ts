import { JwtPayload } from 'jsonwebtoken';
require('dotenv').config();

export interface UserJwtPayload extends JwtPayload {
  userId: string;
  email: string;
}

export const getEnvVar = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set.`);
  }
  return value;
};
