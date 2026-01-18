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

/**
 * Middleware to verify JWT and attach user to req.
 */
export const authorizedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HttpError(401, "Unauthorized: Token malformed");
    }

    const token = authHeader.split(" ")[1];
    if (!token) throw new HttpError(401, "Unauthorized: Token missing");

    const secret: Secret = JWT_SECRETS;
    const decoded = jwt.verify(token, secret) as { id: string; role: string };

    const user = await userRepository.getUserByID(decoded.id);
    if (!user) throw new HttpError(401, "Unauthorized: User not found");

    req.user = { id: user._id.toString(), email: user.email, role: user.role };
    return next();
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

/**
 * Generic role-based middleware.
 */
const roleOnlyMiddleware =
  (role: "admin" | "retailer" | "consumer") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new HttpError(401, "Unauthorized: User not found");
      if (req.user.role !== role) {
        throw new HttpError(403, `Forbidden: ${role} only`);
      }
      return next();
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };

// Specific role middlewares
export const adminOnlyMiddleware = roleOnlyMiddleware("admin");
export const retailerOnlyMiddleware = roleOnlyMiddleware("retailer");
export const consumerOnlyMiddleware = roleOnlyMiddleware("consumer");
