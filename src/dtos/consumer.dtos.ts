import { z } from "zod";

export const CreateConsumerDto = z.object({
  authId: z.string().min(1),
  fullName: z.string().min(1),
  username: z.string().min(3),
  phoneNumber: z.string().min(5),
  dob: z.string(),
  gender: z.string(),
  country: z.string(),
  profilePicture: z.string().optional()
});
export type CreateConsumerInput = z.infer<typeof CreateConsumerDto>;

export const UpdateConsumerDto = CreateConsumerDto.partial();
export type UpdateConsumerInput = z.infer<typeof UpdateConsumerDto>;
