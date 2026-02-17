import { z } from "zod";

/**
 * SaveItem schema: consumerId, type, itemId, optional payload
 * Use z.record(keySchema, valueSchema) to avoid TS signature errors.
 */
export const SaveItemSchema = z.object({
  consumerId: z.string().min(1),
  type: z.enum(["product", "review"]),
  itemId: z.string().min(1),
  payload: z.record(z.string(), z.any()).optional(),
});

export type SaveItemDto = z.infer<typeof SaveItemSchema>;

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