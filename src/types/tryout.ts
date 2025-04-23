import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const CreateSubCategorySchema = z.object({
  name: z.string().min(1),
  categoryId: z.string().min(1),
});
//
