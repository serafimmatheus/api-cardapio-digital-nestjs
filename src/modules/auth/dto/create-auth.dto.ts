import { z } from 'zod';

export const createAuthDto = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  image: z.string().url(),
});

export type CreateAuthDto = z.infer<typeof createAuthDto>;
