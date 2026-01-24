// services/consumer.service.ts
import { CreateConsumerInput, UpdateConsumerInput } from "../dtos/consumer.dtos";
import { HttpError } from "../errors/http.error";
import { ConsumerRepository } from "../repository/consumer.repository";

const repo = new ConsumerRepository();

export class ConsumerService {
  async create(input: CreateConsumerInput) {
    const existing = await repo.findByUsername(input.username);
    if (existing) throw new HttpError(409, "Username already in use");
    return repo.createConsumer(input as any);
  }

  async getAll() {
    return repo.findAll();
  }

  async getById(id: string) {
    const consumer = await repo.findById(id);
    if (!consumer) throw new HttpError(404, "Consumer not found");
    return consumer;
  }

  async getByUsername(username: string) {
    const consumer = await repo.findByUsername(username);
    if (!consumer) throw new HttpError(404, "Consumer not found");
    return consumer;
  }

  async getByAuthId(authId: string) {
    const consumer = await repo.findByAuthId(authId);
    if (!consumer) throw new HttpError(404, "Consumer not found");
    return consumer;
  }

  async update(id: string, input: UpdateConsumerInput) {
    const updated = await repo.updateConsumer(id, input as any);
    if (!updated) throw new HttpError(404, "Consumer not found");
    return updated;
  }

async updateProfilePicture(authId: string, filePath: string) {
  const updated = await repo.updateByAuthId(authId, { profilePicture: filePath } as any);
  if (!updated) throw new HttpError(404, "Consumer not found");
  return updated;
}
  async delete(id: string) {
    const deleted = await repo.deleteConsumer(id);
    if (!deleted) throw new HttpError(404, "Consumer not found");
    return { success: true };
  }
}