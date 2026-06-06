import { HttpStatus, Injectable } from '@nestjs/common';
import { Breed } from '@prisma/client';

import { apiErrorCodes } from '../../common/errors/api-error-code';
import { AppException } from '../../common/errors/app.exception';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class BreedsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Breed[]> {
    return this.prisma.breed.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findBySlug(slug: string): Promise<Breed> {
    const breed = await this.prisma.breed.findUnique({
      where: { slug },
    });

    if (!breed) {
      throw new AppException(apiErrorCodes.notFound, 'Raça não encontrada.', HttpStatus.NOT_FOUND);
    }

    return breed;
  }
}
