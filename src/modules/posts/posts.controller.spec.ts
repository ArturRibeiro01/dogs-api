import { PostsController } from './posts.controller';

const authUser = {
  supabaseAuthId: '7af9f040-922b-4a6f-97d8-f39cc338c29d',
  email: 'artur@example.com',
};

describe('PostsController', () => {
  it('creates post item response', async () => {
    const post = { id: 'post-id', dogId: 'dog-id' };
    const postsService = {
      create: jest.fn().mockResolvedValue(post),
    };
    const controller = new PostsController(postsService as never);
    const body = { dogId: 'dog-id', caption: 'Passeio no parque.' };

    await expect(controller.create(authUser, body)).resolves.toEqual({ data: post });

    expect(postsService.create).toHaveBeenCalledWith(authUser, body);
  });

  it('lists posts with pagination response', async () => {
    const posts = [{ id: 'post-id', dogId: 'dog-id' }];
    const pagination = { page: 1, perPage: 12, total: 1, totalPages: 1 };
    const postsService = {
      findAll: jest.fn().mockResolvedValue({ posts, pagination }),
    };
    const controller = new PostsController(postsService as never);

    await expect(controller.list({})).resolves.toEqual({
      data: posts,
      pagination,
    });
  });

  it('returns post by id item response', async () => {
    const post = { id: 'post-id', dogId: 'dog-id' };
    const postsService = {
      findPublicById: jest.fn().mockResolvedValue(post),
    };
    const controller = new PostsController(postsService as never);

    await expect(controller.findById('post-id')).resolves.toEqual({ data: post });
  });

  it('updates post item response', async () => {
    const post = { id: 'post-id', caption: 'Atualizado.' };
    const postsService = {
      update: jest.fn().mockResolvedValue(post),
    };
    const controller = new PostsController(postsService as never);
    const body = { caption: 'Atualizado.' };

    await expect(controller.update(authUser, 'post-id', body)).resolves.toEqual({ data: post });

    expect(postsService.update).toHaveBeenCalledWith(authUser, 'post-id', body);
  });

  it('deletes post item response', async () => {
    const postsService = {
      delete: jest.fn().mockResolvedValue({ id: 'post-id' }),
    };
    const controller = new PostsController(postsService as never);

    await expect(controller.delete(authUser, 'post-id')).resolves.toEqual({
      data: { id: 'post-id' },
    });
  });
});
