// src/repositories/review.repository.ts
import ReviewModel, { IReview } from "../models/review.model";

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

  like: async (id: string, userId: string) => {
    const r = await ReviewModel.findById(id);
    if (!r) return null;
    if (!r.likedBy.includes(userId)) {
      r.likedBy.push(userId);
      r.likes = r.likedBy.length;
      await r.save();
    }
    return r;
  },

  unlike: async (id: string, userId: string) => {
    const r = await ReviewModel.findById(id);
    if (!r) return null;
    r.likedBy = r.likedBy.filter((u: string) => u !== userId);
    r.likes = r.likedBy.length;
    await r.save();
    return r;
  },

  isLikedBy: async (id: string, userId: string) => {
    const r = await ReviewModel.findById(id).lean();
    if (!r) return false;
    return Array.isArray(r.likedBy) && r.likedBy.includes(userId);
  },
};
