import { HttpStatus } from '@nestjs/common';
import { DogMembershipRole, DogMembershipStatus, PostVisibility } from '@prisma/client';

import { apiErrorCodes } from '../../common/errors/api-error-code';
import { PostsService } from './posts.service';

type PrismaPostsMock = {
  post: {
    create: jest.Mock;
    findFirst: jest.Mock;
    findMany: jest.Mock;
    count: jest.Mock;
    update: jest.Mock;
  };
  dog: {
    findUnique: jest.Mock;
  };
  dogMembership: {
    findFirst: jest.Mock;
  };
  $transaction: jest.Mock;
};

const authUser = {
  supabaseAuthId: '7af9f040-922b-4a6f-97d8-f39cc338c29d',
  email: 'artur@example.com',
};

const localUser = {
  id: 'user-id',
};

function createPrismaMock(): PrismaPostsMock {
  return {
    post: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
    dog: {
      findUnique: jest.fn(),
    },
    dogMembership: {
      findFirst: jest.fn(),
    },
    $transaction: jest.fn(),
  };
}

function createService(prisma: PrismaPostsMock): PostsService {
  const usersService = {
    findOrCreateFromAuth: jest.fn().mockResolvedValue(localUser),
  };

  return new PostsService(prisma as never, usersService as never);
}

describe('PostsService', () => {
  it('creates post when user has active dog membership', async () => {
    const prisma = createPrismaMock();
    const post = { id: 'post-id', dogId: 'dog-id', visibility: PostVisibility.public };
    prisma.dog.findUnique.mockResolvedValue({ id: 'dog-id' });
    prisma.dogMembership.findFirst.mockResolvedValue({ id: 'membership-id' });
    prisma.post.create.mockResolvedValue(post);
    const service = createService(prisma);

    await expect(
      service.create(authUser, {
        dogId: 'dog-id',
        caption: 'Passeio no parque.',
      }),
    ).resolves.toBe(post);

    const [createInput] = prisma.post.create.mock.calls[0] as [
      {
        data: {
          dogId: string;
          authorUserId: string;
          caption: string;
          visibility: PostVisibility;
          publishedAt: Date | null;
        };
      },
    ];

    expect(createInput.data).toMatchObject({
      dogId: 'dog-id',
      authorUserId: localUser.id,
      caption: 'Passeio no parque.',
      visibility: PostVisibility.public,
    });
    expect(createInput.data.publishedAt).toBeInstanceOf(Date);
  });

  it('blocks create when user has no active membership', async () => {
    const prisma = createPrismaMock();
    prisma.dog.findUnique.mockResolvedValue({ id: 'dog-id' });
    prisma.dogMembership.findFirst.mockResolvedValue(null);
    const service = createService(prisma);

    await expect(service.create(authUser, { dogId: 'dog-id' })).rejects.toMatchObject({
      response: { code: apiErrorCodes.forbidden },
      status: HttpStatus.FORBIDDEN,
    });
  });

  it('lists public feed with filters and pagination', async () => {
    const prisma = createPrismaMock();
    const posts = [{ id: 'post-id', dogId: 'dog-id' }];
    prisma.$transaction.mockResolvedValue([posts, 1]);
    const service = createService(prisma);

    await expect(
      service.findAll({
        dog: 'luke',
        breed: 'golden-retriever',
        city: 'Sao Paulo',
        state: 'SP',
        page: '2',
        perPage: '10',
      }),
    ).resolves.toEqual({
      posts,
      pagination: {
        page: 2,
        perPage: 10,
        total: 1,
        totalPages: 1,
      },
    });

    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 10,
        take: 10,
      }),
    );
  });

  it('throws not found for missing public post', async () => {
    const prisma = createPrismaMock();
    prisma.post.findFirst.mockResolvedValue(null);
    const service = createService(prisma);

    await expect(service.findPublicById('post-id')).rejects.toMatchObject({
      response: { code: apiErrorCodes.notFound },
      status: HttpStatus.NOT_FOUND,
    });
  });

  it('soft deletes post when user can manage dog', async () => {
    const prisma = createPrismaMock();
    prisma.post.findFirst.mockResolvedValue({
      id: 'post-id',
      dogId: 'dog-id',
      publishedAt: new Date(),
    });
    prisma.dogMembership.findFirst.mockResolvedValue({ id: 'membership-id' });
    prisma.post.update.mockResolvedValue({ id: 'post-id' });
    const service = createService(prisma);

    await expect(service.delete(authUser, 'post-id')).resolves.toEqual({ id: 'post-id' });

    expect(prisma.post.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'post-id' },
        select: { id: true },
      }),
    );
  });

  it('checks owner or editor membership before writing', async () => {
    const prisma = createPrismaMock();
    prisma.dog.findUnique.mockResolvedValue({ id: 'dog-id' });
    prisma.dogMembership.findFirst.mockResolvedValue({ id: 'membership-id' });
    prisma.post.create.mockResolvedValue({ id: 'post-id' });
    const service = createService(prisma);

    await service.create(authUser, { dogId: 'dog-id' });

    const [membershipInput] = prisma.dogMembership.findFirst.mock.calls[0] as [
      { where: { role: { in: DogMembershipRole[] }; status: DogMembershipStatus } },
    ];
    expect(membershipInput.where.role.in).toEqual([
      DogMembershipRole.owner,
      DogMembershipRole.editor,
    ]);
    expect(membershipInput.where.status).toBe(DogMembershipStatus.active);
  });
});
