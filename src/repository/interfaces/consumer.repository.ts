import { IConsumer } from "../../models/consumer.model";

export interface IConsumerRepository {
  createConsumer(data: Partial<IConsumer>): Promise<IConsumer>;
  findAll(): Promise<IConsumer[]>;
  findById(id: string): Promise<IConsumer | null>;
  findByUsername(username: string): Promise<IConsumer | null>;
  updateConsumer(id: string, data: Partial<IConsumer>): Promise<IConsumer | null>;
  deleteConsumer(id: string): Promise<IConsumer | null>;
}
