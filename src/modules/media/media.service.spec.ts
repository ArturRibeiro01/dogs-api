import { HttpStatus } from '@nestjs/common';
import { DogMembershipRole, DogMembershipStatus } from '@prisma/client';

import { apiErrorCodes } from '../../common/errors/api-error-code';
import { MediaService } from './media.service';
import { UploadedImageFile } from './media.types';

type PrismaMediaMock = {
  post: {
    findFirst: jest.Mock;
  };
  dogMembership: {
    findFirst: jest.Mock;
  };
  media: {
    create: jest.Mock;
  };
};

const authUser = {
  supabaseAuthId: '7af9f040-922b-4a6f-97d8-f39cc338c29d',
  email: 'artur@example.com',
};

const localUser = {
  id: 'user-id',
};

const imageFile: UploadedImageFile = {
  originalname: 'luke.jpg',
  mimetype: 'image/jpeg',
  size: 1024,
  buffer: Buffer.from('image'),
};

function createPrismaMock(): PrismaMediaMock {
  return {
    post: {
      findFirst: jest.fn(),
    },
    dogMembership: {
      findFirst: jest.fn(),
    },
    media: {
      create: jest.fn(),
    },
  };
}

function createService(prisma: PrismaMediaMock): MediaService {
  const usersService = {
    findOrCreateFromAuth: jest.fn().mockResolvedValue(localUser),
  };
  const storageService = {
    uploadPublicObject: jest.fn().mockResolvedValue({
      url: 'https://example.com/luke.jpg',
    }),
  };
  const configService = {
    get: jest.fn().mockReturnValue('dogs-media'),
  };

  return new MediaService(
    prisma as never,
    usersService as never,
    storageService as never,
    configService as never,
  );
}

describe('MediaService', () => {
  it('uploads image and creates media record', async () => {
    const prisma = createPrismaMock();
    const media = { id: 'media-id', postId: 'post-id', dogId: 'dog-id' };
    prisma.post.findFirst.mockResolvedValue({ id: 'post-id', dogId: 'dog-id', deletedAt: null });
    prisma.dogMembership.findFirst.mockResolvedValue({ id: 'membership-id' });
    prisma.media.create.mockResolvedValue(media);
    const service = createService(prisma);

    await expect(service.upload(authUser, { postId: 'post-id' }, imageFile)).resolves.toBe(media);

    const [membershipInput] = prisma.dogMembership.findFirst.mock.calls[0] as [
      { where: { role: { in: DogMembershipRole[] }; status: DogMembershipStatus } },
    ];
    expect(membershipInput.where.role.in).toEqual([
      DogMembershipRole.owner,
      DogMembershipRole.editor,
    ]);

    const [createInput] = prisma.media.create.mock.calls[0] as [
      {
        data: {
          postId: string;
          dogId: string;
          uploadedByUserId: string;
          storageBucket: string;
          storageKey: string;
          url: string;
          mimeType: string;
          size: number;
        };
      },
    ];
    expect(createInput.data).toMatchObject({
      postId: 'post-id',
      dogId: 'dog-id',
      uploadedByUserId: localUser.id,
      storageBucket: 'dogs-media',
      url: 'https://example.com/luke.jpg',
      mimeType: 'image/jpeg',
      size: 1024,
    });
    expect(createInput.data.storageKey).toContain('posts/post-id/');
  });

  it('rejects missing image file', async () => {
    const service = createService(createPrismaMock());

    await expect(service.upload(authUser, { postId: 'post-id' }, undefined)).rejects.toMatchObject({
      response: { code: apiErrorCodes.badRequest },
      status: HttpStatus.BAD_REQUEST,
    });
  });

  it('rejects invalid mime type', async () => {
    const service = createService(createPrismaMock());

    await expect(
      service.upload(authUser, { postId: 'post-id' }, { ...imageFile, mimetype: 'text/plain' }),
    ).rejects.toMatchObject({
      response: { code: apiErrorCodes.validationError },
      status: HttpStatus.BAD_REQUEST,
    });
  });

  it('rejects files over max size', async () => {
    const service = createService(createPrismaMock());

    await expect(
      service.upload(authUser, { postId: 'post-id' }, { ...imageFile, size: 6 * 1024 * 1024 }),
    ).rejects.toMatchObject({
      response: { code: apiErrorCodes.payloadTooLarge },
      status: HttpStatus.PAYLOAD_TOO_LARGE,
    });
  });

  it('rejects when user cannot manage post dog', async () => {
    const prisma = createPrismaMock();
    prisma.post.findFirst.mockResolvedValue({ id: 'post-id', dogId: 'dog-id', deletedAt: null });
    prisma.dogMembership.findFirst.mockResolvedValue(null);
    const service = createService(prisma);

    await expect(service.upload(authUser, { postId: 'post-id' }, imageFile)).rejects.toMatchObject({
      response: { code: apiErrorCodes.forbidden },
      status: HttpStatus.FORBIDDEN,
    });
  });
});
