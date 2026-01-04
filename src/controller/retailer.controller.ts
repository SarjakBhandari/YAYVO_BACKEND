import { Request, Response, NextFunction } from "express";
import { RetailerService } from "../services/retailer.service";
import { CreateRetailerDto, UpdateRetailerDto } from "../dtos/retailer.dtos";

const service = new RetailerService();

export async function createRetailer(req: Request, res: Response, next: NextFunction) {
  try {
    const input = CreateRetailerDto.parse(req.body);
    const retailer = await service.create(input);
    res.status(201).json(retailer);
  } catch (err) {
    next(err);
  }
}

export async function getRetailers(_req: Request, res: Response, next: NextFunction) {
  try {
    const retailers = await service.getAll();
    res.json(retailers);
  } catch (err) {
    next(err);
  }
}

export async function getRetailerById(req: Request, res: Response, next: NextFunction) {
  try {
    const retailer = await service.getById(req.params.id);
    res.json(retailer);
  } catch (err) {
    next(err);
  }
}

export async function getRetailerByUsername(req: Request, res: Response, next: NextFunction) {
  try {
    const retailer = await service.getByUsername(req.params.username);
    res.json(retailer);
  } catch (err) {
    next(err);
  }
}

export async function updateRetailer(req: Request, res: Response, next: NextFunction) {
  try {
    const input = UpdateRetailerDto.parse(req.body);
    const retailer = await service.update(req.params.id, input);
    res.json(retailer);
  } catch (err) {
    next(err);
  }
}

export async function deleteRetailer(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.delete(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
