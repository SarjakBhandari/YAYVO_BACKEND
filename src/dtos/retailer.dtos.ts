import { z } from "zod";

export const CreateRetailerDto = z.object({
  authId: z.string().min(1),
  ownerName: z.string().min(1),
  organizationName: z.string().min(1),
  username: z.string().min(3),
  phoneNumber: z.string().min(5),
  dateOfEstablishment: z.string().optional(),
  country: z.string().optional(),
  profilePicture: z.string().optional()
});
export type CreateRetailerInput = z.infer<typeof CreateRetailerDto>;

export const UpdateRetailerDto = CreateRetailerDto.partial();
export type UpdateRetailerInput = z.infer<typeof UpdateRetailerDto>;
