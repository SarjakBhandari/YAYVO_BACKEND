import dotenv from "dotenv";
dotenv.config();

export const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5050;
export const MONGODB_URI: string = process.env.MONGODB_URI || "mongodb://localhost:27017/yayvo";

export const JWT_SECRETS: string = process.env.JWT_SECRETS || "supersecret";
export const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "7d";

export const BCRYPT_SALT_ROUNDS: number =
  process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) : 10;

export const CORS_DOMAIN_FIRST: string= process.env.CORS_DOMAIN_FIRST || "http://localhost:3000";
export const CORS_DOMAIN_SECOND: string= process.env.CORS_DOMAIN_SECOND || "http://localhost:3005";