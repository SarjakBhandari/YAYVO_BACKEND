import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { LoginDto, RegisterConsumerDto, RegisterRetailerDto } from "../dtos/auth.dtos";

const service = new AuthService();

export async function registerConsumer(req: Request, res: Response, next: NextFunction) {
  try {
    const input = RegisterConsumerDto.parse(req.body);
    const result = await service.registerConsumer(input);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function registerRetailer(req: Request, res: Response, next: NextFunction) {
  try {
    const input = RegisterRetailerDto.parse(req.body);
    const result = await service.registerRetailer(input);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const input = LoginDto.parse(req.body);
    const result = await service.login(input);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function logout(_req: Request, res: Response) {
  res.json({ success: true, message: "Logged out" });
}

export async function getCurrentUser(req: Request, res: Response) {
  res.json({ user: req.user });
}

export async function sendResetPasswordEmail(req: Request, res: Response) {
        try {
            const email = req.body.email;
            const user = await service.sendResetPasswordEmail(email);
            return res.status(200).json(
                {
                    success: true,
                    data: user,
                    message: "If the email is registered, a reset link has been sent."
                }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

  export async function resetPassword(req: Request, res: Response) {
        try {

            const token = req.params.token as string;
            const { newPassword } = req.body;
            await service.resetPassword(token, newPassword);
            return res.status(200).json(
                { success: true, message: "Password has been reset successfully." }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }