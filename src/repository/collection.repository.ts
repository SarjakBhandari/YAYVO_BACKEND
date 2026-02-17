import CollectionModel, { ICollection } from "../models/collection.model";

export const CollectionRepository = {
  findOrCreateByAuthId: async (authId: string) => {
    let doc = await CollectionModel.findOne({ consumerAuthId: authId });
    if (!doc) {
      doc = await CollectionModel.create({ consumerAuthId: authId, savedReviews: [], savedProducts: [] });
    }
    return doc;
  },

  addReviewId: async (authId: string, reviewId: string) => {
    return CollectionModel.findOneAndUpdate(
      { consumerAuthId: authId },
      { $addToSet: { savedReviews: reviewId } },
      { upsert: true, new: true }
    ).lean();
  },

  removeReviewId: async (authId: string, reviewId: string) => {
    return CollectionModel.findOneAndUpdate(
      { consumerAuthId: authId },
      { $pull: { savedReviews: reviewId } },
      { new: true }
    ).lean();
  },

  addProductId: async (authId: string, productId: string) => {
    return CollectionModel.findOneAndUpdate(
      { consumerAuthId: authId },
      { $addToSet: { savedProducts: productId } },
      { upsert: true, new: true }
    ).lean();
  },

  removeProductId: async (authId: string, productId: string) => {
    return CollectionModel.findOneAndUpdate(
      { consumerAuthId: authId },
      { $pull: { savedProducts: productId } },
      { new: true }
    ).lean();
  },

  getSavedReviewIds: async (authId: string) => {
    const doc = await CollectionModel.findOne({ consumerAuthId: authId }).lean();
    return doc?.savedReviews ?? [];
  },

  getSavedProductIds: async (authId: string) => {
    const doc = await CollectionModel.findOne({ consumerAuthId: authId }).lean();
    return doc?.savedProducts ?? [];
  },
};
