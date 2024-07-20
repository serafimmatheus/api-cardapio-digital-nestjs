import { z } from 'zod';

export const createCategoryDto = z.object({
  name: z.string(),
  slug: z.string(),
  isActive: z.boolean().default(true),
});

export type CreateCategoryDto = z.infer<typeof createCategoryDto>;
