import { z } from 'zod';

export const CreateProductDto = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  retailerAuthId: z.string().min(1),
  retailerName: z.string().optional(),
  retailerIcon: z.string().optional(),
  targetSentiment: z.array(z.string()).optional()
});
export type CreateProductInput = z.infer<typeof CreateProductDto>;

export const UpdateProductDto = CreateProductDto.partial();
export type UpdateProductInput = z.infer<typeof UpdateProductDto>;
