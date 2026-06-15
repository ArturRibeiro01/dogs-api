import { DogsController } from './dogs.controller';

const authUser = {
  supabaseAuthId: '7af9f040-922b-4a6f-97d8-f39cc338c29d',
  email: 'artur@example.com',
};

describe('DogsController', () => {
  it('creates dog item response', async () => {
    const dog = { id: 'dog-id', name: 'Luke' };
    const dogsService = {
      create: jest.fn().mockResolvedValue(dog),
    };
    const controller = new DogsController(dogsService as never);
    const body = { name: 'Luke', breedId: 'breed-id' };

    await expect(controller.create(authUser, body)).resolves.toEqual({ data: dog });

    expect(dogsService.create).toHaveBeenCalledWith(authUser, body);
  });

  it('lists dogs with pagination response', async () => {
    const dogs = [{ id: 'dog-id', name: 'Luke' }];
    const pagination = { page: 1, perPage: 12, total: 1, totalPages: 1 };
    const dogsService = {
      findAll: jest.fn().mockResolvedValue({ dogs, pagination }),
    };
    const controller = new DogsController(dogsService as never);

    await expect(controller.list({})).resolves.toEqual({
      data: dogs,
      pagination,
    });
  });

  it('returns dog by slug item response', async () => {
    const dog = { id: 'dog-id', slug: 'luke', name: 'Luke' };
    const dogsService = {
      findPublicBySlug: jest.fn().mockResolvedValue(dog),
    };
    const controller = new DogsController(dogsService as never);

    await expect(controller.findBySlug('luke')).resolves.toEqual({ data: dog });
  });

  it('updates dog item response', async () => {
    const dog = { id: 'dog-id', name: 'Luke Dev' };
    const dogsService = {
      update: jest.fn().mockResolvedValue(dog),
    };
    const controller = new DogsController(dogsService as never);
    const body = { name: 'Luke Dev' };

    await expect(controller.update(authUser, 'dog-id', body)).resolves.toEqual({ data: dog });

    expect(dogsService.update).toHaveBeenCalledWith(authUser, 'dog-id', body);
  });

  it('returns members list response', async () => {
    const members = [{ id: 'membership-id', dogId: 'dog-id', userId: 'user-id' }];
    const dogsService = {
      findMembers: jest.fn().mockResolvedValue(members),
    };
    const controller = new DogsController(dogsService as never);

    await expect(controller.members(authUser, 'dog-id')).resolves.toEqual({
      data: members,
      pagination: {
        page: 1,
        perPage: 1,
        total: 1,
        totalPages: 1,
      },
    });
  });
});
