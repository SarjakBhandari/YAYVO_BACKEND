import dotenv from "dotenv";

// Load variables from .env file
dotenv.config();

// Port number (default 5050)
export const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5050;

// MongoDB connection URI (default local DB)
export const MONGODB_URI: string =
  process.env.MONGODB_URI || "mongodb://localhost:27017/defaultdb";

// JWT secret (default fallback)
export const JWT_SECRET: string = process.env.JWT_SECRET || "default";

// Optional: bcrypt salt rounds
export const BCRYPT_SALT_ROUNDS: number = process.env.BCRYPT_SALT_ROUNDS
  ? parseInt(process.env.BCRYPT_SALT_ROUNDS, 10)
  : 10;
