import { CollectionRepository } from "../repository/collection.repository";
import { HttpError } from "../errors/http.error";
import { ReviewService } from "../services/review.service";
import { ProductService } from "../services/product.service";

const productService=new ProductService();

export const CollectionService = {
  async saveReview(authId: string, reviewId: string) {
    if (!authId) throw new HttpError(400, "consumerAuthId required");
    if (!reviewId) throw new HttpError(400, "reviewId required");
    await ReviewService.getById(reviewId); // ensure exists
    return CollectionRepository.addReviewId(authId, reviewId);
  },

  async unsaveReview(authId: string, reviewId: string) {
    if (!authId || !reviewId) throw new HttpError(400, "consumerAuthId and reviewId required");
    return CollectionRepository.removeReviewId(authId, reviewId);
  },

  async saveProduct(authId: string, productId: string) {
    if (!authId) throw new HttpError(400, "consumerAuthId required");
    if (!productId) throw new HttpError(400, "productId required");
    await productService.getById(productId); // ensure exists
    return CollectionRepository.addProductId(authId, productId);
  },

  async unsaveProduct(authId: string, productId: string) {
    if (!authId || !productId) throw new HttpError(400, "consumerAuthId and productId required");
    return CollectionRepository.removeProductId(authId, productId);
  },

  async getSavedReviewsPaginated(authId: string, page = 1, size = 10) {
    const ids = await CollectionRepository.getSavedReviewIds(authId);
    const totalItems = ids.length;
    const totalPages = Math.ceil(totalItems / size) || 1;
    const slice = ids.slice((page - 1) * size, page * size);

    const items = await Promise.all(
      slice.map(async (id: string) => {
        try {
          return await ReviewService.getById(id);
        } catch {
          return null;
        }
      })
    );

    return { items: items.filter(Boolean), pagination: { page, size, totalItems, totalPages } };
  },

  async getSavedProductsPaginated(authId: string, page = 1, size = 10) {
    const ids = await CollectionRepository.getSavedProductIds(authId);
    const totalItems = ids.length;
    const totalPages = Math.ceil(totalItems / size) || 1;
    const slice = ids.slice((page - 1) * size, page * size);

    const items = await Promise.all(
      slice.map(async (id: any) => {
        try {
          return await productService.getById(id);
        } catch {
          return null;
        }
      })
    );

    return { items: items.filter(Boolean), pagination: { page, size, totalItems, totalPages } };
  },
};
