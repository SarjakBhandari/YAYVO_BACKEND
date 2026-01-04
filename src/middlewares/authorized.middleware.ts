import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { JWT_SECRETS } from "../config";
import { UserRepository } from "../repository/user.repository";
import { HttpError } from "../errors/http.error";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; role: string };
    }
  }
}

const userRepository = new UserRepository();

export const authorizedMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HttpError(401, "Unauthorized Token Malformed");
    }
    const token = authHeader.split(" ")[1];
    if (!token) throw new HttpError(401, "Unauthorized Token Missing");

    const secret: Secret = JWT_SECRETS;
    const decoded = jwt.verify(token, secret) as { id: string; role: string };

    const user = await userRepository.getUserByID(decoded.id);
    if (!user) throw new HttpError(401, "Unauthorized User not Found");

    req.user = { id: user._id.toString(), email: user.email, role: user.role };
    return next();
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

export const adminOnlyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new HttpError(401, "Unauthorized User not found");
    if (req.user.role !== "admin") throw new HttpError(403, "Forbidden Admin Only");
    return next();
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};
