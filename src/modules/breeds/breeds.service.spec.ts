import { HttpStatus } from '@nestjs/common';

import { apiErrorCodes } from '../../common/errors/api-error-code';
import { BreedsService } from './breeds.service';

type PrismaBreedMock = {
  breed: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
  };
};

function createPrismaMock(): PrismaBreedMock {
  return {
    breed: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };
}

describe('BreedsService', () => {
  it('lists breeds ordered by name', async () => {
    const prisma = createPrismaMock();
    const breeds = [{ id: 'breed-id', name: 'Golden Retriever', slug: 'golden-retriever' }];
    prisma.breed.findMany.mockResolvedValue(breeds);
    const service = new BreedsService(prisma as never);

    await expect(service.findAll()).resolves.toBe(breeds);

    expect(prisma.breed.findMany).toHaveBeenCalledWith({
      orderBy: { name: 'asc' },
    });
  });

  it('finds breed by slug', async () => {
    const prisma = createPrismaMock();
    const breed = { id: 'breed-id', name: 'Golden Retriever', slug: 'golden-retriever' };
    prisma.breed.findUnique.mockResolvedValue(breed);
    const service = new BreedsService(prisma as never);

    await expect(service.findBySlug('golden-retriever')).resolves.toBe(breed);

    expect(prisma.breed.findUnique).toHaveBeenCalledWith({
      where: { slug: 'golden-retriever' },
    });
  });

  it('throws not found when breed slug does not exist', async () => {
    const prisma = createPrismaMock();
    prisma.breed.findUnique.mockResolvedValue(null);
    const service = new BreedsService(prisma as never);

    await expect(service.findBySlug('unknown')).rejects.toMatchObject({
      message: 'Raça não encontrada.',
      response: {
        code: apiErrorCodes.notFound,
      },
      status: HttpStatus.NOT_FOUND,
    });
  });
});
