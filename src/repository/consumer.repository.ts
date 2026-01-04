import { ConsumerModel, IConsumer } from "../models/consumer.model";
import { IConsumerRepository } from "./interfaces/consumer.repository";

export class ConsumerRepository implements IConsumerRepository {
  async createConsumer(data: Partial<IConsumer>): Promise<IConsumer> {
    const consumer = new ConsumerModel(data);
    return consumer.save();
  }
  async findAll(): Promise<IConsumer[]> {
    return ConsumerModel.find().exec();
  }
  async findById(id: string): Promise<IConsumer | null> {
    return ConsumerModel.findById(id).exec();
  }
  async findByUsername(username: string): Promise<IConsumer | null> {
    return ConsumerModel.findOne({ username }).exec();
  }
  async updateConsumer(id: string, data: Partial<IConsumer>): Promise<IConsumer | null> {
    return ConsumerModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
  async deleteConsumer(id: string): Promise<IConsumer | null> {
    return ConsumerModel.findByIdAndDelete(id).exec();
  }
}
