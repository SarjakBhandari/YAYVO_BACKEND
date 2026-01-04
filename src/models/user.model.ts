import mongoose, { Schema, Document } from "mongoose";

export type Role = "admin" | "consumer" | "retailer";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: Role;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "consumer", "retailer"], required: true }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
