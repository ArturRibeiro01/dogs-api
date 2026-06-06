import { HttpStatus, Injectable } from '@nestjs/common';
import { Dog, DogMembershipRole, DogMembershipStatus, Prisma } from '@prisma/client';

import { apiErrorCodes } from '../../common/errors/api-error-code';
import { AppException } from '../../common/errors/app.exception';
import { Pagination } from '../../common/responses/api-response';
import { PrismaService } from '../../database/prisma.service';
import { AuthenticatedUser } from '../auth/auth.types';
import { UsersService } from '../users/users.service';
import { CreateDogDto } from './dto/create-dog.dto';
import { ListDogsQueryDto } from './dto/list-dogs-query.dto';
import { UpdateDogDto } from './dto/update-dog.dto';

const dogInclude = {
  breed: true,
} satisfies Prisma.DogInclude;

const dogMemberInclude = {
  user: {
    select: {
      id: true,
      username: true,
      name: true,
      avatarUrl: true,
    },
  },
} satisfies Prisma.DogMembershipInclude;

type DogWithBreed = Prisma.DogGetPayload<{ include: typeof dogInclude }>;
type DogMemberWithUser = Prisma.DogMembershipGetPayload<{ include: typeof dogMemberInclude }>;

export type PaginatedDogs = {
  dogs: DogWithBreed[];
  pagination: Pagination;
};

@Injectable()
export class DogsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async create(authUser: AuthenticatedUser, input: CreateDogDto): Promise<DogWithBreed> {
    const user = await this.usersService.findOrCreateFromAuth(authUser);
    await this.ensureBreedExists(input.breedId);

    const slug = await this.createUniqueSlug(input.name);

    return this.prisma.dog.create({
      data: {
        slug,
        name: input.name,
        breedId: input.breedId,
        birthDate: this.toDate(input.birthDate),
        sex: input.sex,
        size: input.size,
        weight: input.weight,
        bio: input.bio,
        avatarUrl: input.avatarUrl,
        city: input.city ?? user.city,
        state: input.state ?? user.state,
        interests: input.interests ?? [],
        isPublic: input.isPublic ?? true,
        memberships: {
          create: {
            userId: user.id,
            role: DogMembershipRole.owner,
            status: DogMembershipStatus.active,
          },
        },
      },
      include: dogInclude,
    });
  }

  async findAll(query: ListDogsQueryDto): Promise<PaginatedDogs> {
    const page = this.toPositiveInteger(query.page, 1);
    const perPage = Math.min(this.toPositiveInteger(query.perPage, 12), 50);
    const where: Prisma.DogWhereInput = {
      isPublic: true,
      breed: query.breed ? { slug: query.breed } : undefined,
      city: query.city,
      state: query.state,
      interests: query.interest ? { has: query.interest } : undefined,
    };

    const [dogs, total] = await this.prisma.$transaction([
      this.prisma.dog.findMany({
        where,
        include: dogInclude,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.dog.count({ where }),
    ]);

    return {
      dogs,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.max(Math.ceil(total / perPage), 1),
      },
    };
  }

  async findPublicBySlug(slug: string): Promise<DogWithBreed> {
    const dog = await this.prisma.dog.findFirst({
      where: { slug, isPublic: true },
      include: dogInclude,
    });

    if (!dog) {
      throw this.notFound();
    }

    return dog;
  }

  async update(
    authUser: AuthenticatedUser,
    dogId: string,
    input: UpdateDogDto,
  ): Promise<DogWithBreed> {
    const user = await this.usersService.findOrCreateFromAuth(authUser);
    await this.ensureDogExists(dogId);
    await this.ensureActiveMembership(dogId, user.id, [
      DogMembershipRole.owner,
      DogMembershipRole.editor,
    ]);

    if (input.breedId) {
      await this.ensureBreedExists(input.breedId);
    }

    return this.prisma.dog.update({
      where: { id: dogId },
      data: {
        name: input.name,
        breedId: input.breedId,
        birthDate: input.birthDate === undefined ? undefined : this.toDate(input.birthDate),
        sex: input.sex,
        size: input.size,
        weight: input.weight,
        bio: input.bio,
        avatarUrl: input.avatarUrl,
        city: input.city,
        state: input.state,
        interests: input.interests,
        isPublic: input.isPublic,
      },
      include: dogInclude,
    });
  }

  async delete(authUser: AuthenticatedUser, dogId: string): Promise<Pick<Dog, 'id'>> {
    const user = await this.usersService.findOrCreateFromAuth(authUser);
    await this.ensureDogExists(dogId);
    await this.ensureActiveMembership(dogId, user.id, [DogMembershipRole.owner]);

    const deletedDog = await this.prisma.dog.delete({
      where: { id: dogId },
      select: { id: true },
    });

    return deletedDog;
  }

  async findMembers(authUser: AuthenticatedUser, dogId: string): Promise<DogMemberWithUser[]> {
    const user = await this.usersService.findOrCreateFromAuth(authUser);
    await this.ensureDogExists(dogId);
    await this.ensureActiveMembership(dogId, user.id, [
      DogMembershipRole.owner,
      DogMembershipRole.editor,
    ]);

    return this.prisma.dogMembership.findMany({
      where: { dogId, status: DogMembershipStatus.active },
      include: dogMemberInclude,
      orderBy: [{ role: 'desc' }, { createdAt: 'asc' }],
    });
  }

  private async ensureBreedExists(breedId: string): Promise<void> {
    const breed = await this.prisma.breed.findUnique({
      where: { id: breedId },
      select: { id: true },
    });

    if (!breed) {
      throw new AppException(apiErrorCodes.notFound, 'Raça não encontrada.', HttpStatus.NOT_FOUND);
    }
  }

  private async ensureDogExists(dogId: string): Promise<void> {
    const dog = await this.prisma.dog.findUnique({
      where: { id: dogId },
      select: { id: true },
    });

    if (!dog) {
      throw this.notFound();
    }
  }

  private async ensureActiveMembership(
    dogId: string,
    userId: string,
    roles: DogMembershipRole[],
  ): Promise<void> {
    const membership = await this.prisma.dogMembership.findFirst({
      where: {
        dogId,
        userId,
        status: DogMembershipStatus.active,
        role: { in: roles },
      },
      select: { id: true },
    });

    if (!membership) {
      throw new AppException(
        apiErrorCodes.forbidden,
        'Você não tem permissão para gerenciar este cachorro.',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  private async createUniqueSlug(name: string): Promise<string> {
    const baseSlug = this.slugify(name);

    for (let attempt = 0; attempt < 20; attempt += 1) {
      const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;
      const existingDog = await this.prisma.dog.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!existingDog) {
        return slug;
      }
    }

    return `${baseSlug}-${Date.now()}`;
  }

  private slugify(value: string): string {
    const slug = value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return slug || 'dog';
  }

  private toDate(value: string | null | undefined): Date | null | undefined {
    if (value === undefined) {
      return undefined;
    }

    if (value === null || value.trim() === '') {
      return null;
    }

    return new Date(value);
  }

  private toPositiveInteger(value: string | undefined, fallback: number): number {
    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue < 1) {
      return fallback;
    }

    return parsedValue;
  }

  private notFound(): AppException {
    return new AppException(
      apiErrorCodes.notFound,
      'Cachorro não encontrado.',
      HttpStatus.NOT_FOUND,
    );
  }
}
