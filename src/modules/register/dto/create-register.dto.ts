import { z } from 'zod';

export const createRegisterDto = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const createVerifyCodeDto = z.object({
  code: z.string().min(6).max(6),
});

export type CreateRegisterDto = z.infer<typeof createRegisterDto>;
export type CreateVerifyCodeDto = z.infer<typeof createVerifyCodeDto>;
