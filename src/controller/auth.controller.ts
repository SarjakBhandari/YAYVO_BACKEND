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
