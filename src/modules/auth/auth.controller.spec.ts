import { AuthController } from './auth.controller';

describe('AuthController', () => {
  it('returns current synced user', async () => {
    const user = { id: 'user-id', username: 'artur' };
    const usersService = {
      findOrCreateFromAuth: jest.fn().mockResolvedValue(user),
      syncFromAuth: jest.fn(),
    };
    const controller = new AuthController(usersService as never);
    const authUser = {
      supabaseAuthId: '7af9f040-922b-4a6f-97d8-f39cc338c29d',
      email: 'artur@example.com',
    };

    await expect(controller.me(authUser)).resolves.toEqual({ data: user });
    expect(usersService.findOrCreateFromAuth).toHaveBeenCalledWith(authUser);
  });

  it('syncs authenticated user profile', async () => {
    const user = { id: 'user-id', username: 'artur' };
    const usersService = {
      findOrCreateFromAuth: jest.fn(),
      syncFromAuth: jest.fn().mockResolvedValue(user),
    };
    const controller = new AuthController(usersService as never);
    const authUser = {
      supabaseAuthId: '7af9f040-922b-4a6f-97d8-f39cc338c29d',
      email: 'artur@example.com',
    };
    const body = { username: 'artur' };

    await expect(controller.sync(authUser, body)).resolves.toEqual({ data: user });
    expect(usersService.syncFromAuth).toHaveBeenCalledWith(authUser, body);
  });
});
