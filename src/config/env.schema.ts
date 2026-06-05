import { z } from 'zod';

import { appEnvironments } from './app-env';

const optionalString = z.string().trim().optional();

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_ENV: z.enum(appEnvironments),
  PORT: z.coerce.number().int().positive(),
  API_BASE_URL: z.string().trim().url(),
  WEB_APP_URL: z.string().trim().url(),
  CORS_ORIGINS: z
    .string()
    .trim()
    .min(1)
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.string().url()).min(1)),

  DATABASE_URL: optionalString,
  DIRECT_DATABASE_URL: optionalString,

  JWT_ACCESS_SECRET: optionalString,
  JWT_REFRESH_SECRET: optionalString,
  ACCESS_TOKEN_TTL: z.string().trim().default('15m'),
  REFRESH_TOKEN_TTL: z.string().trim().default('30d'),

  SUPABASE_URL: optionalString,
  SUPABASE_SERVICE_ROLE_KEY: optionalString,
  SUPABASE_STORAGE_BUCKET: z.string().trim().default('dogs-media'),

  MAIL_PROVIDER: z.enum(['console', 'resend', 'smtp']).default('console'),
  MAIL_FROM: z.string().trim().default('Dogs <no-reply@example.com>'),
  MAIL_API_KEY: optionalString,

  SWAGGER_ENABLED: z
    .enum(['true', 'false'])
    .default('true')
    .transform((value) => value === 'true'),
  SWAGGER_BASIC_AUTH_USER: optionalString,
  SWAGGER_BASIC_AUTH_PASSWORD: optionalString,
});

export type Env = z.infer<typeof envSchema>;
