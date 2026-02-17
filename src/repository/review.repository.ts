// src/repositories/review.repository.ts
import ReviewModel, { IReview } from "../models/review.model";
import { Types } from "mongoose";

export const ReviewRepository = {
  create: async (payload: Partial<IReview>) => {
    return ReviewModel.create(payload);
  },

  findById: async (id: string) => {
    return ReviewModel.findById(id);
  },

  findByIdLean: async (id: string) => {
    return ReviewModel.findById(id).lean();
  },

  findByAuthor: async (authorId: string) => {
    return ReviewModel.find({ authorId }).sort({ createdAt: -1 }).lean();
  },

  paginatedList: async (filter: any, page = 1, size = 10) => {
    const totalItems = await ReviewModel.countDocuments(filter);
    const items = await ReviewModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * size)
      .limit(size)
      .lean();
    return {
      items,
      pagination: { page, size, totalItems, totalPages: Math.ceil(totalItems / size) },
    };
  },

  updateById: async (id: string, payload: Partial<IReview>) => {
    return ReviewModel.findByIdAndUpdate(id, payload, { new: true });
  },

  deleteById: async (id: string) => {
    return ReviewModel.findByIdAndDelete(id);
  },

  /**
   * Atomically add userId to likedBy and increment likes (only if not already present).
   * Returns the updated review (lean).
   */
  like: async (id: string, userId: string) => {
    if (!Types.ObjectId.isValid(id)) return null;
    // Add userId only if not present, increment likes by 1
    const updated = await ReviewModel.findOneAndUpdate(
      { _id: id, likedBy: { $ne: userId } },
      { $addToSet: { likedBy: userId }, $inc: { likes: 1 } },
      { new: true, lean: true }
    );
    if (updated) return updated;

    // If updated is null, user already liked — return current doc (lean)
    return await ReviewModel.findById(id).lean();
  },

  /**
   * Atomically remove userId from likedBy and decrement likes (only if present).
   * Ensures likes never goes below 0.
   */
  unlike: async (id: string, userId: string) => {
    if (!Types.ObjectId.isValid(id)) return null;
    const updated = await ReviewModel.findOneAndUpdate(
      { _id: id, likedBy: userId },
      { $pull: { likedBy: userId }, $inc: { likes: -1 } },
      { new: true, lean: true }
    );

    if (updated) {
      // ensure non-negative likes
      if ((updated as any).likes < 0) {
        const fixed = await ReviewModel.findByIdAndUpdate(id, { $set: { likes: 0 } }, { new: true, lean: true });
        return fixed;
      }
      return updated;
    }

    // user wasn't in likedBy — return current doc
    return await ReviewModel.findById(id).lean();
  },

  /**
   * Check if a user liked a review
   */
  isLikedBy: async (id: string, userId: string) => {
    if (!Types.ObjectId.isValid(id)) return false;
    const doc = await ReviewModel.findOne({ _id: id, likedBy: userId }).lean();
    return !!doc;
  },

  /**
   * Optional helper to sync likes numeric field with likedBy length
   */
  syncLikesCount: async (id: string) => {
    const doc = await ReviewModel.findById(id).lean();
    if (!doc) return null;
    const count = Array.isArray((doc as any).likedBy) ? (doc as any).likedBy.length : 0;
    return await ReviewModel.findByIdAndUpdate(id, { $set: { likes: count } }, { new: true, lean: true });
  },
};
