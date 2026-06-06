import { HttpStatus } from '@nestjs/common';
import { DogMembershipRole, DogMembershipStatus, DogSex } from '@prisma/client';

import { apiErrorCodes } from '../../common/errors/api-error-code';
import { DogsService } from './dogs.service';

type PrismaDogsMock = {
  dog: {
    findUnique: jest.Mock;
    findFirst: jest.Mock;
    findMany: jest.Mock;
    count: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  breed: {
    findUnique: jest.Mock;
  };
  dogMembership: {
    findFirst: jest.Mock;
    findMany: jest.Mock;
  };
  $transaction: jest.Mock;
};

const authUser = {
  supabaseAuthId: '7af9f040-922b-4a6f-97d8-f39cc338c29d',
  email: 'artur@example.com',
  name: 'Artur',
};

const localUser = {
  id: 'user-id',
  city: 'Sao Paulo',
  state: 'SP',
};

function createPrismaMock(): PrismaDogsMock {
  return {
    dog: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    breed: {
      findUnique: jest.fn(),
    },
    dogMembership: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };
}

function createService(prisma: PrismaDogsMock): DogsService {
  const usersService = {
    findOrCreateFromAuth: jest.fn().mockResolvedValue(localUser),
  };

  return new DogsService(prisma as never, usersService as never);
}

describe('DogsService', () => {
  it('creates dog with active owner membership', async () => {
    const prisma = createPrismaMock();
    const dog = { id: 'dog-id', slug: 'luke', name: 'Luke' };
    prisma.breed.findUnique.mockResolvedValue({ id: 'breed-id' });
    prisma.dog.findUnique.mockResolvedValue(null);
    prisma.dog.create.mockResolvedValue(dog);
    const service = createService(prisma);

    await expect(
      service.create(authUser, {
        name: 'Luke',
        breedId: 'breed-id',
        sex: DogSex.male,
      }),
    ).resolves.toBe(dog);

    const [createInput] = prisma.dog.create.mock.calls[0] as [
      {
        data: {
          slug: string;
          city: string;
          state: string;
          memberships: {
            create: {
              userId: string;
              role: DogMembershipRole;
              status: DogMembershipStatus;
            };
          };
        };
      },
    ];

    expect(createInput.data).toMatchObject({
      slug: 'luke',
      city: localUser.city,
      state: localUser.state,
      memberships: {
        create: {
          userId: localUser.id,
          role: DogMembershipRole.owner,
          status: DogMembershipStatus.active,
        },
      },
    });
  });

  it('creates unique slug with suffix', async () => {
    const prisma = createPrismaMock();
    const dog = { id: 'dog-id', slug: 'luke-2', name: 'Luke' };
    prisma.breed.findUnique.mockResolvedValue({ id: 'breed-id' });
    prisma.dog.findUnique
      .mockResolvedValueOnce({ id: 'existing-dog-id' })
      .mockResolvedValueOnce(null);
    prisma.dog.create.mockResolvedValue(dog);
    const service = createService(prisma);

    await service.create(authUser, { name: 'Luke', breedId: 'breed-id' });

    const [createInput] = prisma.dog.create.mock.calls[0] as [{ data: { slug: string } }];
    expect(createInput.data.slug).toBe('luke-2');
  });

  it('lists public dogs with filters and pagination', async () => {
    const prisma = createPrismaMock();
    const dogs = [{ id: 'dog-id', name: 'Luke' }];
    prisma.$transaction.mockResolvedValue([dogs, 1]);
    const service = createService(prisma);

    await expect(
      service.findAll({
        breed: 'golden-retriever',
        city: 'Sao Paulo',
        state: 'SP',
        interest: 'walks',
        page: '2',
        perPage: '10',
      }),
    ).resolves.toEqual({
      dogs,
      pagination: {
        page: 2,
        perPage: 10,
        total: 1,
        totalPages: 1,
      },
    });

    expect(prisma.dog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          isPublic: true,
          breed: { slug: 'golden-retriever' },
          city: 'Sao Paulo',
          state: 'SP',
          interests: { has: 'walks' },
        },
        skip: 10,
        take: 10,
      }),
    );
  });

  it('throws not found for missing public slug', async () => {
    const prisma = createPrismaMock();
    prisma.dog.findFirst.mockResolvedValue(null);
    const service = createService(prisma);

    await expect(service.findPublicBySlug('unknown')).rejects.toMatchObject({
      response: { code: apiErrorCodes.notFound },
      status: HttpStatus.NOT_FOUND,
    });
  });

  it('allows editor to update dog', async () => {
    const prisma = createPrismaMock();
    const updatedDog = { id: 'dog-id', name: 'Luke Dev' };
    prisma.dog.findUnique.mockResolvedValue({ id: 'dog-id' });
    prisma.dogMembership.findFirst.mockResolvedValue({ id: 'membership-id' });
    prisma.dog.update.mockResolvedValue(updatedDog);
    const service = createService(prisma);

    await expect(service.update(authUser, 'dog-id', { name: 'Luke Dev' })).resolves.toBe(
      updatedDog,
    );

    const [membershipInput] = prisma.dogMembership.findFirst.mock.calls[0] as [
      { where: { role: { in: DogMembershipRole[] } } },
    ];
    expect(membershipInput.where.role.in).toEqual([
      DogMembershipRole.owner,
      DogMembershipRole.editor,
    ]);
  });

  it('blocks update when user has no membership', async () => {
    const prisma = createPrismaMock();
    prisma.dog.findUnique.mockResolvedValue({ id: 'dog-id' });
    prisma.dogMembership.findFirst.mockResolvedValue(null);
    const service = createService(prisma);

    await expect(service.update(authUser, 'dog-id', { name: 'Luke Dev' })).rejects.toMatchObject({
      response: { code: apiErrorCodes.forbidden },
      status: HttpStatus.FORBIDDEN,
    });
  });
});
