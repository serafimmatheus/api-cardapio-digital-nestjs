import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333),
  MAIL_PORT: z.coerce.number().default(587),
  EMAIL_HOST: z.string(),
  EMAIL_USER_NAME: z.string(),
  EMAIL_PASSWORD: z.string(),
});

export type Env = z.infer<typeof envSchema>;
