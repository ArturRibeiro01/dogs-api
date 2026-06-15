import { ApiPropertyOptional } from '@nestjs/swagger';
import { DogInterest } from '@prisma/client';

export class ListDogsQueryDto {
  @ApiPropertyOptional({ description: 'Breed slug.', example: 'golden-retriever' })
  breed?: string;

  @ApiPropertyOptional({ example: 'Sao Paulo' })
  city?: string;

  @ApiPropertyOptional({ example: 'SP' })
  state?: string;

  @ApiPropertyOptional({ enum: DogInterest, enumName: 'DogInterest', example: DogInterest.walks })
  interest?: DogInterest;

  @ApiPropertyOptional({ example: 1 })
  page?: string;

  @ApiPropertyOptional({ example: 12 })
  perPage?: string;
}
