import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

import { AppConfig } from '../../config/configuration';
import { SupabaseAuthService } from './supabase-auth.service';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

const createClientMock = jest.mocked(createClient);

function createConfigService(config: Partial<AppConfig['supabase']>) {
  return {
    get: jest.fn(() => ({
      url: config.url,
      anonKey: config.anonKey,
      jwtSecret: config.jwtSecret,
      serviceRoleKey: config.serviceRoleKey,
      storageBucket: config.storageBucket ?? 'dogs-media',
    })),
  } as unknown as ConfigService<AppConfig, true>;
}

describe('SupabaseAuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('throws when Supabase Auth is not configured', async () => {
    const service = new SupabaseAuthService(createConfigService({}));

    await expect(service.verifyAccessToken('token')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('returns authenticated user from a valid Supabase token', async () => {
    createClientMock.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: {
            user: {
              id: '7af9f040-922b-4a6f-97d8-f39cc338c29d',
              email: 'tutor@example.com',
              user_metadata: {
                name: 'Tutor Example',
                avatar_url: 'https://example.com/avatar.png',
              },
            },
          },
          error: null,
        }),
      },
    } as never);

    const service = new SupabaseAuthService(
      createConfigService({
        url: 'https://dogs.supabase.co',
        anonKey: 'anon-key',
      }),
    );

    await expect(service.verifyAccessToken('token')).resolves.toEqual({
      supabaseAuthId: '7af9f040-922b-4a6f-97d8-f39cc338c29d',
      email: 'tutor@example.com',
      name: 'Tutor Example',
      avatarUrl: 'https://example.com/avatar.png',
    });
  });

  it('throws when Supabase rejects the token', async () => {
    createClientMock.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
          error: new Error('invalid token'),
        }),
      },
    } as never);

    const service = new SupabaseAuthService(
      createConfigService({
        url: 'https://dogs.supabase.co',
        anonKey: 'anon-key',
      }),
    );

    await expect(service.verifyAccessToken('token')).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
