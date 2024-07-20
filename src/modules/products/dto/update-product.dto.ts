import { z } from 'zod';

export const updateProductDto = z.object({
  name: z.string().nullish(),
  slug: z.string().nullish(),
  description: z.string().nullish(),
  price: z.number().nullish(),
  image: z.string().nullish(),
  isActive: z.boolean().nullish(),
  categories: z.array(z.string()).nullish(),
});

export type UpdateProductDto = z.infer<typeof updateProductDto>;
