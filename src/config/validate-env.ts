import { envSchema, Env } from './env.schema';

export function validateEnv(config: Record<string, unknown>): Env {
  const parsedEnv = envSchema.safeParse(config);

  if (parsedEnv.success) {
    return parsedEnv.data;
  }

  const formattedErrors = parsedEnv.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('\n');

  throw new Error(`Invalid environment variables:\n${formattedErrors}`);
}
