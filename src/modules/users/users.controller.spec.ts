import { UsersController } from './users.controller';

describe('UsersController', () => {
  it('returns current user profile', async () => {
    const user = { id: 'user-id', username: 'artur' };
    const usersService = {
      findOrCreateFromAuth: jest.fn().mockResolvedValue(user),
      updateCurrentUser: jest.fn(),
    };
    const controller = new UsersController(usersService as never);
    const authUser = {
      supabaseAuthId: '7af9f040-922b-4a6f-97d8-f39cc338c29d',
      email: 'artur@example.com',
    };

    await expect(controller.me(authUser)).resolves.toEqual({ data: user });
    expect(usersService.findOrCreateFromAuth).toHaveBeenCalledWith(authUser);
  });

  it('updates current user profile', async () => {
    const user = { id: 'user-id', username: 'artur' };
    const usersService = {
      findOrCreateFromAuth: jest.fn(),
      updateCurrentUser: jest.fn().mockResolvedValue(user),
    };
    const controller = new UsersController(usersService as never);
    const authUser = {
      supabaseAuthId: '7af9f040-922b-4a6f-97d8-f39cc338c29d',
      email: 'artur@example.com',
    };
    const body = { name: 'Artur Ribeiro' };

    await expect(controller.updateMe(authUser, body)).resolves.toEqual({ data: user });
    expect(usersService.updateCurrentUser).toHaveBeenCalledWith(authUser, body);
  });
});
