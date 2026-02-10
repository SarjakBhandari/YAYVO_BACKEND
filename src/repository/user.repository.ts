import { UserModel, IUser } from "../models/user.model";
import { ConsumerModel } from "../models/consumer.model";
import { RetailerModel } from "../models/retailer.model";
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
    // First find the user
    const user = await UserModel.findById(id).exec();
    if (!user) return null;

    // Cascade delete depending on role
    if (user.role === "consumer") {
      await ConsumerModel.findOneAndDelete({ authId: user._id }).exec();
    } else if (user.role === "retailer") {
      await RetailerModel.findOneAndDelete({ authId: user._id }).exec();
    }

    // Finally delete the user itself
    return UserModel.findByIdAndDelete(id).exec();
  }

    async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
        // UserModel.updateOne({ _id: id }, { $set: updateData });
        const updatedUser = await UserModel.findByIdAndUpdate(
            id, updateData, { new: true } // return the updated document
        );
        return updatedUser;
    }
}
