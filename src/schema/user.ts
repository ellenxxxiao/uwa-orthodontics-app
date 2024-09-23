import { z } from "zod";

// Update user schema
export const UpdateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional()
});
