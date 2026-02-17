import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  title: string;
  description?: string;
  sentiments: string[];
  productName?: string;
  productImage?: string;
  noOfLikes: number;       
  likedBy: string[];       
  authorId: string;
  authorLocation?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    sentiments: { type: [String], default: [] },
    productName: { type: String, default: "" },
    productImage: { type: String, default: "" },
    noOfLikes: { type: Number, default: 0 },   
    likedBy: { type: [String], default: [] },
    authorId: { type: String, required: true, index: true },
    authorLocation: { type: String, default: "" },
  },
  { timestamps: true }
);

const ReviewModel = mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
export default ReviewModel;
