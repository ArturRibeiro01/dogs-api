import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListPostsQueryDto {
  @ApiPropertyOptional({ description: 'Dog slug.', example: 'luke' })
  dog?: string;

  @ApiPropertyOptional({ description: 'Breed slug.', example: 'golden-retriever' })
  breed?: string;

  @ApiPropertyOptional({ example: 'Sao Paulo' })
  city?: string;

  @ApiPropertyOptional({ example: 'SP' })
  state?: string;

  @ApiPropertyOptional({ example: 1 })
  page?: string;

  @ApiPropertyOptional({ example: 12 })
  perPage?: string;
}
