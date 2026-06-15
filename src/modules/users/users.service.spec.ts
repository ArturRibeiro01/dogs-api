import { UsersService } from './users.service';

type PrismaUserMock = {
  user: {
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
};

const authUser = {
  supabaseAuthId: '7af9f040-922b-4a6f-97d8-f39cc338c29d',
  email: 'Artur.Ribeiro@example.com',
  name: 'Artur Ribeiro',
  avatarUrl: 'https://example.com/avatar.png',
};

function createPrismaMock(): PrismaUserMock {
  return {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
}

describe('UsersService', () => {
  it('returns existing user by Supabase auth id', async () => {
    const prisma = createPrismaMock();
    const user = { id: 'user-id', username: 'artur' };
    prisma.user.findUnique.mockResolvedValue(user);
    const service = new UsersService(prisma as never);

    await expect(service.findOrCreateFromAuth(authUser)).resolves.toBe(user);

    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('creates local user from authenticated Supabase user', async () => {
    const prisma = createPrismaMock();
    const user = { id: 'user-id', username: 'artur_ribeiro' };
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue(user);
    const service = new UsersService(prisma as never);

    await expect(service.findOrCreateFromAuth(authUser)).resolves.toBe(user);

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        supabaseAuthId: authUser.supabaseAuthId,
        email: authUser.email,
        username: 'artur_ribeiro',
        name: authUser.name,
        avatarUrl: authUser.avatarUrl,
        city: undefined,
        state: undefined,
      },
    });
  });

  it('adds suffix when generated username already exists', async () => {
    const prisma = createPrismaMock();
    const user = { id: 'user-id', username: 'artur_ribeiro2' };
    prisma.user.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'existing-id' })
      .mockResolvedValueOnce(null);
    prisma.user.create.mockResolvedValue(user);
    const service = new UsersService(prisma as never);

    await expect(service.findOrCreateFromAuth(authUser)).resolves.toBe(user);

    const [createInput] = prisma.user.create.mock.calls[0] as [{ data: { username: string } }];
    expect(createInput.data.username).toBe('artur_ribeiro2');
  });

  it('updates editable current user fields', async () => {
    const prisma = createPrismaMock();
    const existingUser = { id: 'user-id', username: 'artur' };
    const updatedUser = { id: 'user-id', username: 'artur_dev' };
    prisma.user.findUnique.mockResolvedValue(existingUser);
    prisma.user.update.mockResolvedValue(updatedUser);
    const service = new UsersService(prisma as never);

    await expect(
      service.updateCurrentUser(authUser, {
        username: 'Artur Dev',
        name: 'Artur Dev',
      }),
    ).resolves.toBe(updatedUser);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: existingUser.id },
      data: {
        username: 'artur_dev',
        name: 'Artur Dev',
        bio: undefined,
        city: undefined,
        state: undefined,
        avatarUrl: undefined,
      },
    });
  });
});
