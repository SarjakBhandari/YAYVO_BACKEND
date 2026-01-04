import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRetailer extends Document {
  authId: Types.ObjectId | string;
  ownerName: string;
  organizationName: string;
  username: string;
  phoneNumber: string;
  dateOfEstablishment?: string;
  country?: string;
  profilePicture?: string;
}

const RetailerSchema = new Schema<IRetailer>(
  {
    authId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ownerName: { type: String, required: true },
    organizationName: { type: String, required: true },
    username: { type: String, required: true, unique: true, index: true },
    phoneNumber: { type: String },
    dateOfEstablishment: { type: String },
    country: { type: String },
    profilePicture: { type: String }
  },
  { timestamps: true }
);

export const RetailerModel = mongoose.model<IRetailer>("Retailer", RetailerSchema);
