import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';

import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DogMembershipRole, DogMembershipStatus, Media, Prisma } from '@prisma/client';

import { apiErrorCodes } from '../../common/errors/api-error-code';
import { AppException } from '../../common/errors/app.exception';
import { AppConfig } from '../../config/configuration';
import { PrismaService } from '../../database/prisma.service';
import { AuthenticatedUser } from '../auth/auth.types';
import { UsersService } from '../users/users.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UploadedImageFile } from './media.types';
import { SupabaseStorageService } from './supabase-storage.service';

const maxUploadSizeInBytes = 5 * 1024 * 1024;

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

const extensionByMimeType: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

type UploadablePost = Prisma.PostGetPayload<{
  select: {
    id: true;
    dogId: true;
    deletedAt: true;
  };
}>;

@Injectable()
export class MediaService {
  private readonly storageBucket: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly storageService: SupabaseStorageService,
    configService: ConfigService<AppConfig, true>,
  ) {
    this.storageBucket = configService.get('supabase.storageBucket', { infer: true });
  }

  async upload(
    authUser: AuthenticatedUser,
    input: CreateMediaDto,
    file: UploadedImageFile | undefined,
  ): Promise<Media> {
    this.ensureValidFile(file);

    const user = await this.usersService.findOrCreateFromAuth(authUser);
    const post = await this.findUploadablePost(input.postId);
    await this.ensureActiveMembership(post.dogId, user.id);

    const storageKey = this.createStorageKey(post.id, file);
    const uploadResult = await this.storageService.uploadPublicObject({
      bucket: this.storageBucket,
      key: storageKey,
      buffer: file.buffer,
      contentType: file.mimetype,
    });

    return this.prisma.media.create({
      data: {
        postId: post.id,
        dogId: post.dogId,
        uploadedByUserId: user.id,
        storageBucket: this.storageBucket,
        storageKey,
        url: uploadResult.url,
        mimeType: file.mimetype,
        size: file.size,
      },
    });
  }

  private ensureValidFile(file: UploadedImageFile | undefined): asserts file is UploadedImageFile {
    if (!file) {
      throw new AppException(
        apiErrorCodes.badRequest,
        'Arquivo de imagem é obrigatório.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!allowedMimeTypes.has(file.mimetype)) {
      throw new AppException(
        apiErrorCodes.validationError,
        'Formato de imagem inválido.',
        HttpStatus.BAD_REQUEST,
        [{ field: 'file', allowedMimeTypes: Array.from(allowedMimeTypes) }],
      );
    }

    if (file.size > maxUploadSizeInBytes) {
      throw new AppException(
        apiErrorCodes.payloadTooLarge,
        'Imagem excede o tamanho máximo permitido.',
        HttpStatus.PAYLOAD_TOO_LARGE,
        [{ field: 'file', maxSizeInBytes: maxUploadSizeInBytes }],
      );
    }
  }

  private async findUploadablePost(postId: string): Promise<UploadablePost> {
    const post = await this.prisma.post.findFirst({
      where: { id: postId, deletedAt: null },
      select: {
        id: true,
        dogId: true,
        deletedAt: true,
      },
    });

    if (!post) {
      throw new AppException(apiErrorCodes.notFound, 'Post não encontrado.', HttpStatus.NOT_FOUND);
    }

    return post;
  }

  private async ensureActiveMembership(dogId: string, userId: string): Promise<void> {
    const membership = await this.prisma.dogMembership.findFirst({
      where: {
        dogId,
        userId,
        status: DogMembershipStatus.active,
        role: { in: [DogMembershipRole.owner, DogMembershipRole.editor] },
      },
      select: { id: true },
    });

    if (!membership) {
      throw new AppException(
        apiErrorCodes.forbidden,
        'Você não tem permissão para enviar imagens para este cachorro.',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  private createStorageKey(postId: string, file: UploadedImageFile): string {
    const extension =
      extensionByMimeType[file.mimetype] ?? extname(file.originalname).toLowerCase();

    return `posts/${postId}/${randomUUID()}${extension}`;
  }
}
