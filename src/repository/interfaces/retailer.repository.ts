import { IRetailer } from "../../models/retailer.model";

export interface IRetailerRepository {
  createRetailer(data: Partial<IRetailer>): Promise<IRetailer>;
  findAll(): Promise<IRetailer[]>;
  findById(id: string): Promise<IRetailer | null>;
  findByUsername(username: string): Promise<IRetailer | null>;
  updateRetailer(id: string, data: Partial<IRetailer>): Promise<IRetailer | null>;
  deleteRetailer(authId: string): Promise<IRetailer | null>;
}
