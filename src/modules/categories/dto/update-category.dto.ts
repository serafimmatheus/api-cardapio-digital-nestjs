import { z } from 'zod';

export const updateCategoryDto = z.object({
  name: z.string().nullish(),
  slug: z.string().nullable(),
  isActive: z.boolean().nullable(),
});

export type UpdateCategoryDto = z.infer<typeof updateCategoryDto>;
