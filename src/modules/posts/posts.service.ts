import { HttpStatus, Injectable } from '@nestjs/common';
import {
  DogMembershipRole,
  DogMembershipStatus,
  Post,
  PostVisibility,
  Prisma,
} from '@prisma/client';

import { apiErrorCodes } from '../../common/errors/api-error-code';
import { AppException } from '../../common/errors/app.exception';
import { Pagination } from '../../common/responses/api-response';
import { PrismaService } from '../../database/prisma.service';
import { AuthenticatedUser } from '../auth/auth.types';
import { UsersService } from '../users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ListPostsQueryDto } from './dto/list-posts-query.dto';
import { UpdatePostDto } from './dto/update-post.dto';

const postInclude = {
  dog: {
    include: {
      breed: true,
    },
  },
  author: {
    select: {
      id: true,
      username: true,
      name: true,
      avatarUrl: true,
    },
  },
  media: true,
} satisfies Prisma.PostInclude;

type PostWithRelations = Prisma.PostGetPayload<{ include: typeof postInclude }>;

export type PaginatedPosts = {
  posts: PostWithRelations[];
  pagination: Pagination;
};

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async create(authUser: AuthenticatedUser, input: CreatePostDto): Promise<PostWithRelations> {
    const user = await this.usersService.findOrCreateFromAuth(authUser);
    await this.ensureDogExists(input.dogId);
    await this.ensureActiveMembership(input.dogId, user.id);

    const visibility = input.visibility ?? PostVisibility.public;

    return this.prisma.post.create({
      data: {
        dogId: input.dogId,
        authorUserId: user.id,
        caption: input.caption,
        visibility,
        publishedAt: this.getPublishedAt(visibility),
      },
      include: postInclude,
    });
  }

  async findAll(query: ListPostsQueryDto): Promise<PaginatedPosts> {
    const page = this.toPositiveInteger(query.page, 1);
    const perPage = Math.min(this.toPositiveInteger(query.perPage, 12), 50);
    const where: Prisma.PostWhereInput = {
      deletedAt: null,
      visibility: PostVisibility.public,
      publishedAt: { not: null },
      dog: {
        isPublic: true,
        slug: query.dog,
        breed: query.breed ? { slug: query.breed } : undefined,
        city: query.city,
        state: query.state,
      },
    };

    const [posts, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where,
        include: postInclude,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      posts,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.max(Math.ceil(total / perPage), 1),
      },
    };
  }

  async findPublicById(postId: string): Promise<PostWithRelations> {
    const post = await this.prisma.post.findFirst({
      where: {
        id: postId,
        deletedAt: null,
        visibility: PostVisibility.public,
        publishedAt: { not: null },
        dog: { isPublic: true },
      },
      include: postInclude,
    });

    if (!post) {
      throw this.notFound();
    }

    return post;
  }

  async update(
    authUser: AuthenticatedUser,
    postId: string,
    input: UpdatePostDto,
  ): Promise<PostWithRelations> {
    const user = await this.usersService.findOrCreateFromAuth(authUser);
    const post = await this.findManageablePost(postId);
    await this.ensureActiveMembership(post.dogId, user.id);

    const visibility = input.visibility;

    return this.prisma.post.update({
      where: { id: postId },
      data: {
        caption: input.caption,
        visibility,
        publishedAt:
          visibility === undefined ? undefined : this.getUpdatedPublishedAt(visibility, post),
      },
      include: postInclude,
    });
  }

  async delete(authUser: AuthenticatedUser, postId: string): Promise<Pick<Post, 'id'>> {
    const user = await this.usersService.findOrCreateFromAuth(authUser);
    const post = await this.findManageablePost(postId);
    await this.ensureActiveMembership(post.dogId, user.id);

    return this.prisma.post.update({
      where: { id: postId },
      data: { deletedAt: new Date() },
      select: { id: true },
    });
  }

  private async ensureDogExists(dogId: string): Promise<void> {
    const dog = await this.prisma.dog.findUnique({
      where: { id: dogId },
      select: { id: true },
    });

    if (!dog) {
      throw new AppException(
        apiErrorCodes.notFound,
        'Cachorro não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }
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
        'Você não tem permissão para publicar por este cachorro.',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  private async findManageablePost(
    postId: string,
  ): Promise<Pick<Post, 'id' | 'dogId' | 'publishedAt'>> {
    const post = await this.prisma.post.findFirst({
      where: { id: postId, deletedAt: null },
      select: { id: true, dogId: true, publishedAt: true },
    });

    if (!post) {
      throw this.notFound();
    }

    return post;
  }

  private getPublishedAt(visibility: PostVisibility): Date | null {
    return visibility === PostVisibility.public ? new Date() : null;
  }

  private getUpdatedPublishedAt(
    visibility: PostVisibility,
    post: Pick<Post, 'publishedAt'>,
  ): Date | null {
    if (visibility !== PostVisibility.public) {
      return null;
    }

    return post.publishedAt ?? new Date();
  }

  private toPositiveInteger(value: string | undefined, fallback: number): number {
    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue < 1) {
      return fallback;
    }

    return parsedValue;
  }

  private notFound(): AppException {
    return new AppException(apiErrorCodes.notFound, 'Post não encontrado.', HttpStatus.NOT_FOUND);
  }
}
