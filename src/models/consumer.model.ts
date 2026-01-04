import mongoose, { Schema, Document, Types } from "mongoose";

export interface IConsumer extends Document {
  authId: Types.ObjectId | string;
  fullName: string;
  username: string;
  phoneNumber: string;
  dob?: string;
  gender?: string;
  country?: string;
  profilePicture?: string;
}

const ConsumerSchema = new Schema<IConsumer>(
  {
    authId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true, index: true },
    phoneNumber: { type: String },
    dob: { type: String },
    gender: { type: String },
    country: { type: String },
    profilePicture: { type: String }
  },
  { timestamps: true }
);

export const ConsumerModel = mongoose.model<IConsumer>("Consumer", ConsumerSchema);
