import { BreedsController } from './breeds.controller';

describe('BreedsController', () => {
  it('returns list response for breeds', async () => {
    const breeds = [{ id: 'breed-id', name: 'Golden Retriever', slug: 'golden-retriever' }];
    const breedsService = {
      findAll: jest.fn().mockResolvedValue(breeds),
    };
    const controller = new BreedsController(breedsService as never);

    await expect(controller.list()).resolves.toEqual({
      data: breeds,
      pagination: {
        page: 1,
        perPage: 1,
        total: 1,
        totalPages: 1,
      },
    });
  });

  it('returns item response for breed by slug', async () => {
    const breed = { id: 'breed-id', name: 'Golden Retriever', slug: 'golden-retriever' };
    const breedsService = {
      findBySlug: jest.fn().mockResolvedValue(breed),
    };
    const controller = new BreedsController(breedsService as never);

    await expect(controller.findBySlug('golden-retriever')).resolves.toEqual({
      data: breed,
    });

    expect(breedsService.findBySlug).toHaveBeenCalledWith('golden-retriever');
  });
});
