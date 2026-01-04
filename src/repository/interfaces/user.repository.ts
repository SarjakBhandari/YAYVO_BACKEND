import { IUser } from "../../models/user.model";

export interface IUserRepository {
  getUserByID(id: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  createUser(email: string, passwordHash: string, role: string): Promise<IUser>;
  getAllUsers(): Promise<IUser[]>;
  deleteUserByID(id: string): Promise<IUser | null>;
}
