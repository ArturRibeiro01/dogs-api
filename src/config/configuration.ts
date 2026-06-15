import { Env } from './env.schema';

export type AppConfig = ReturnType<typeof createConfiguration>;

export function createConfiguration(env: Env) {
  return {
    app: {
      nodeEnv: env.NODE_ENV,
      env: env.APP_ENV,
      port: env.PORT,
      apiBaseUrl: env.API_BASE_URL,
      webAppUrl: env.WEB_APP_URL,
      corsOrigins: env.CORS_ORIGINS,
    },
    database: {
      url: env.DATABASE_URL,
      directUrl: env.DIRECT_DATABASE_URL,
    },
    supabase: {
      url: env.SUPABASE_URL,
      anonKey: env.SUPABASE_ANON_KEY,
      jwtSecret: env.SUPABASE_JWT_SECRET,
      serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
      storageBucket: env.SUPABASE_STORAGE_BUCKET,
    },
    mail: {
      provider: env.MAIL_PROVIDER,
      from: env.MAIL_FROM,
      apiKey: env.MAIL_API_KEY,
    },
    swagger: {
      enabled: env.SWAGGER_ENABLED,
      basicAuthUser: env.SWAGGER_BASIC_AUTH_USER,
      basicAuthPassword: env.SWAGGER_BASIC_AUTH_PASSWORD,
    },
  };
}
