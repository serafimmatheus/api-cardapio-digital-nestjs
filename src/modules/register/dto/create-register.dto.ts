import { z } from 'zod';

export const createRegisterDto = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const createVerifyCodeDto = z.object({
  code: z.string().min(6).max(6),
});

export const createForgotPasswordDto = z.object({
  email: z.string().email(),
});

export const createResetPasswordDto = z.object({
  token: z.string(),
  password: z.string(),
});

export const createVerifyEmaildDto = z.object({
  token: z.string(),
});

export type CreateRegisterDto = z.infer<typeof createRegisterDto>;
export type CreateVerifyCodeDto = z.infer<typeof createVerifyCodeDto>;
export type CreateForgotPasswordDto = z.infer<typeof createForgotPasswordDto>;
export type CreateResetPasswordDto = z.infer<typeof createResetPasswordDto>;
export type CreateVerifyEmaildDto = z.infer<typeof createVerifyEmaildDto>;
