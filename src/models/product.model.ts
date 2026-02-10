import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description?: string;
  image?: string; // e.g. /uploads/products/<productId>.jpg
  retailerAuthId: Types.ObjectId | string;
  retailerName?: string;
  retailerIcon?: string;
  targetSentiment?: string[];
  likes: string[]; // consumer ids
  noOfLikes: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, index: true },
    description: { type: String },
    image: { type: String },
    retailerAuthId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    retailerName: { type: String },
    retailerIcon: { type: String },
    targetSentiment: [{ type: String }],
    likes: [{ type: String }],
    noOfLikes: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);
