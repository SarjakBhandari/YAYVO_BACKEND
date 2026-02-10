import { Request, Response, NextFunction } from "express";
import { ConsumerService } from "../services/consumer.service";
import { CreateConsumerDto, UpdateConsumerDto } from "../dtos/consumer.dtos";
import { QueryParams } from "../types/query.type";

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
export async function updateConsumerProfilePicture(req: Request, res: Response) {
  try {
    const authId = req.params.id; // consumer id or authId from route
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Multer gives us the filename, we build the relative path
    const filePath = `/uploads/profilepicture/${req.file.filename}`;

    // Update the consumer entity with the new profilePicture path
    const updated = await service.updateProfilePicture(authId, filePath);

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
}


export async function getConsumerWithAuthIdController(req: Request, res: Response) {
  try {
    const authId = req.params.authId;
    const consumer = await service.getByAuthId(authId);
    res.json({ success: true, data: consumer });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }}

  export async function getAllConsumers(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, size, search }:QueryParams= req.query;
            const { users, pagination } = await service.getAllConsumers(
                page,size, search
            );
            return res.status(200).json(
                { success: true, data: users, pagination: pagination, message: "All Users Retrieved" }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }


