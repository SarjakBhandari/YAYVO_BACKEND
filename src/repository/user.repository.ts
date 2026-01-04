import { UserModel, IUser } from "../models/user.model";
import { IUserRepository } from "./interfaces/user.repository";

export class UserRepository implements IUserRepository {
  async getUserByID(id: string): Promise<IUser | null> {
    return UserModel.findById(id).exec();
  }
  async getUserByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).exec();
  }
  async createUser(email: string, passwordHash: string, role: string): Promise<IUser> {
    const user = new UserModel({ email, passwordHash, role });
    return user.save();
  }
  async getAllUsers(): Promise<IUser[]> {
    return UserModel.find().exec();
  }
  async deleteUserByID(id: string): Promise<IUser | null> {
    return UserModel.findByIdAndDelete(id).exec();
  }
}
