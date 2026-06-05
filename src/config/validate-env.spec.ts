import { validateEnv } from './validate-env';

describe('validateEnv', () => {
  const validEnv = {
    APP_ENV: 'local',
    PORT: '3333',
    API_BASE_URL: 'http://localhost:3333',
    WEB_APP_URL: 'http://localhost:5173',
    CORS_ORIGINS: 'http://localhost:5173,http://localhost:4173',
  };

  it('parses required environment variables', () => {
    const env = validateEnv(validEnv);

    expect(env.APP_ENV).toBe('local');
    expect(env.PORT).toBe(3333);
    expect(env.CORS_ORIGINS).toEqual(['http://localhost:5173', 'http://localhost:4173']);
    expect(env.NODE_ENV).toBe('development');
    expect(env.SWAGGER_ENABLED).toBe(true);
  });

  it('fails when required environment variables are missing', () => {
    expect(() => validateEnv({})).toThrow('Invalid environment variables');
  });
});
