import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { RequestWithAuthenticatedUser } from '../auth.types';
import { SupabaseAuthService } from '../supabase-auth.service';
import { SupabaseAuthGuard } from './supabase-auth.guard';

function createContext(request: Partial<RequestWithAuthenticatedUser>): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext;
}

describe('SupabaseAuthGuard', () => {
  it('rejects requests without authorization header', async () => {
    const guard = new SupabaseAuthGuard({
      verifyAccessToken: jest.fn(),
    } as unknown as SupabaseAuthService);

    await expect(guard.canActivate(createContext({ headers: {} }))).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rejects invalid authorization format', async () => {
    const guard = new SupabaseAuthGuard({
      verifyAccessToken: jest.fn(),
    } as unknown as SupabaseAuthService);

    await expect(
      guard.canActivate(createContext({ headers: { authorization: 'Token abc' } })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('attaches authenticated user to request', async () => {
    const user = {
      supabaseAuthId: '7af9f040-922b-4a6f-97d8-f39cc338c29d',
      email: 'tutor@example.com',
    };
    const request: Partial<RequestWithAuthenticatedUser> = {
      headers: { authorization: 'Bearer token' },
    };
    const verifyAccessToken = jest.fn().mockResolvedValue(user);
    const guard = new SupabaseAuthGuard({
      verifyAccessToken,
    } as unknown as SupabaseAuthService);

    await expect(guard.canActivate(createContext(request))).resolves.toBe(true);

    expect(verifyAccessToken).toHaveBeenCalledWith('token');
    expect(request.user).toEqual(user);
  });
});
