import { Request, Response, NextFunction } from "express";
import { ConsumerService } from "../services/consumer.service";
import { CreateConsumerDto, UpdateConsumerDto } from "../dtos/consumer.dtos";

const service = new ConsumerService();

export async function createConsumer(req: Request, res: Response, next: NextFunction) {
  try {
    const input = CreateConsumerDto.parse(req.body);
    const consumer = await service.create(input);
    res.status(201).json(consumer);
  } catch (err) {
    next(err);
  }
}

export async function getConsumers(_req: Request, res: Response, next: NextFunction) {
  try {
    const consumers = await service.getAll();
    res.json(consumers);
  } catch (err) {
    next(err);
  }
}

export async function getConsumerById(req: Request, res: Response, next: NextFunction) {
  try {
    const consumer = await service.getById(req.params.id);
    res.json(consumer);
  } catch (err) {
    next(err);
  }
}

export async function getConsumerByUsername(req: Request, res: Response, next: NextFunction) {
  try {
    const consumer = await service.getByUsername(req.params.username);
    res.json(consumer);
  } catch (err) {
    next(err);
  }
}

export async function updateConsumer(req: Request, res: Response, next: NextFunction) {
  try {
    const input = UpdateConsumerDto.parse(req.body);
    const consumer = await service.update(req.params.id, input);
    res.json(consumer);
  } catch (err) {
    next(err);
  }
}

export async function deleteConsumer(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.delete(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
