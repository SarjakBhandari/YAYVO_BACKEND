import mongoose, { Document, Schema } from "mongoose";

export interface ICollection extends Document {
  consumerAuthId: string;
  savedReviews: string[];
  savedProducts: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema = new Schema<ICollection>(
  {
    consumerAuthId: { type: String, required: true, unique: true, index: true },
    savedReviews: { type: [String], default: [] },
    savedProducts: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Collection || mongoose.model<ICollection>("Collection", CollectionSchema);
