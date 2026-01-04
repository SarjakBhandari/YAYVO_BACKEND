import { RetailerModel, IRetailer } from "../models/retailer.model";
import { IRetailerRepository } from "./interfaces/retailer.repository";

export class RetailerRepository implements IRetailerRepository {
  async createRetailer(data: Partial<IRetailer>): Promise<IRetailer> {
    const retailer = new RetailerModel(data);
    return retailer.save();
  }
  async findAll(): Promise<IRetailer[]> {
    return RetailerModel.find().exec();
  }
  async findById(id: string): Promise<IRetailer | null> {
    return RetailerModel.findById(id).exec();
  }
  async findByUsername(username: string): Promise<IRetailer | null> {
    return RetailerModel.findOne({ username }).exec();
  }
  async updateRetailer(id: string, data: Partial<IRetailer>): Promise<IRetailer | null> {
    return RetailerModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
  async deleteRetailer(id: string): Promise<IRetailer | null> {
    return RetailerModel.findByIdAndDelete(id).exec();
  }
}
