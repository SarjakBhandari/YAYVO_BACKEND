import { z } from "zod";

/**
 * Generic schema kept for backwards compatibility; most endpoints now
 * validate more specific bodies below.  it is exported in case any
 * one-off callers still rely on it (the index cleanup above corresponds to
 * an earlier design that used this structure).
 */
export const SaveItemSchema = z.object({
  consumerId: z.string().min(1),
  type: z.enum(["product", "review"]),
  itemId: z.string().min(1),
  payload: z.record(z.string(), z.any()).optional(),
});

export type SaveItemDto = z.infer<typeof SaveItemSchema>;

// --- new explicit request schemas ------------------------------------------------

export const SaveReviewSchema = z.object({
  consumerAuthId: z.string().min(1),
  reviewId: z.string().min(1),
});
export type SaveReviewDto = z.infer<typeof SaveReviewSchema>;

export const UnsaveReviewSchema = z.object({
  consumerAuthId: z.string().min(1),
  reviewId: z.string().min(1),
});
export type UnsaveReviewDto = z.infer<typeof UnsaveReviewSchema>;

export const SaveProductSchema = z.object({
  consumerAuthId: z.string().min(1),
  productId: z.string().min(1),
});
export type SaveProductDto = z.infer<typeof SaveProductSchema>;

export const UnsaveProductSchema = z.object({
  consumerAuthId: z.string().min(1),
  productId: z.string().min(1),
});
export type UnsaveProductDto = z.infer<typeof UnsaveProductSchema>;

/**
 * Unsave by consumer schema
 */
export const UnsaveByConsumerSchema = z.object({
  consumerId: z.string().min(1),
  type: z.enum(["product", "review"]),
  itemId: z.string().min(1),
});

export type UnsaveByConsumerDto = z.infer<typeof UnsaveByConsumerSchema>;

/**
 * Query schema for listing by consumer
 */
export const ListByConsumerQuerySchema = z.object({
  consumerId: z.string().optional(),
  type: z.enum(["product", "review"]).optional(),
  page: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (typeof v === "string" ? parseInt(v, 10) || 1 : v ?? 1)),
  size: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (typeof v === "string" ? parseInt(v, 10) || 20 : v ?? 20)),
});

export type ListByConsumerQueryDto = z.infer<typeof ListByConsumerQuerySchema>;