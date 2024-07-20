import { z } from 'zod';

export const createProductDto = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().nullish(),
  price: z.number(),
  image: z.string().nullish(),
  isActive: z.boolean().default(true),
  categories: z.array(z.string()),
});

export type CreateProductDto = z.infer<typeof createProductDto>;
