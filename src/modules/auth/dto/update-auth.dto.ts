import { z } from 'zod';

export const updateAuthDto = z.object({
  name: z.string().nullish(),
  image: z.string().url().nullish(),
});

export const updateAuthPasswordDto = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
});

export type UpdateAuthDto = z.infer<typeof updateAuthDto>;

export type UpdateAuthPasswordDto = z.infer<typeof updateAuthPasswordDto>;
