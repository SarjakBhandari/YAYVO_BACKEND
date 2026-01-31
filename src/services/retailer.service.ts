import { CreateRetailerInput, UpdateRetailerInput } from "../dtos/retailer.dtos";
import { HttpError } from "../errors/http.error";
import { RetailerRepository } from "../repository/retailer.repository";

const repo = new RetailerRepository();

export class RetailerService {
  async create(input: CreateRetailerInput) {
    const existing = await repo.findByUsername(input.username);
    if (existing) throw new HttpError(409, "Username already in use");
    return repo.createRetailer(input as any);
  }

  async getAll() {
    return repo.findAll();
  }

  async getById(id: string) {
    const retailer = await repo.findById(id);
    if (!retailer) throw new HttpError(404, "Retailer not found");
    return retailer;
  }

  async getByAuthId(authId: string) {
    const retailer = await repo.findByAuthId(authId);
    if (!retailer) throw new HttpError(404, "Retailer not found");
    return retailer;
  }

  async getByUsername(username: string) {
    const retailer = await repo.findByUsername(username);
    if (!retailer) throw new HttpError(404, "Retailer not found");
    return retailer;
  }

  async update(id: string, input: UpdateRetailerInput) {
    const updated = await repo.updateRetailer(id, input as any);
    if (!updated) throw new HttpError(404, "Retailer not found");
    return updated;
  }

  async updateProfilePicture(id: string, filePath: string) {
    const updated = await repo.updateByAuthId(id, { profilePicture: filePath } as any);
    if (!updated) throw new HttpError(404, "Retailer not found");
    return updated;
  }

  async delete(id: string) {
    const deleted = await repo.deleteByAuthId(id);
    if (!deleted) throw new HttpError(404, "Retailer not found");
    return { success: true };
  }
}
