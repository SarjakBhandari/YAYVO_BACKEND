// src/dtos/review.dto.ts

// Payload for creating a review
export type CreateReviewDto = {
  title: string;
  description?: string;
  sentiments?: string[] | string;   // normalized in service
  productName?: string;
  productImage?: string;
  authorId: string;                 // required
  authorLocation?: string;
};

// Payload for updating a review
export type UpdateReviewDto = {
  title?: string;
  description?: string;
  sentiments?: string[] | string;
  productName?: string;
  productImage?: string;
  authorLocation?: string;
};

// Payload for liking/unliking a review
export type LikeDto = {
  userId: string;                   // required
};
