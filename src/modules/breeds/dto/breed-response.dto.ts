import { ApiProperty } from '@nestjs/swagger';

export class BreedResponseDto {
  @ApiProperty({ example: '1d2173fe-fcb0-4f7e-8ef5-bf4c3c4ddc71' })
  id!: string;

  @ApiProperty({ example: 'Golden Retriever' })
  name!: string;

  @ApiProperty({ example: 'golden-retriever' })
  slug!: string;

  @ApiProperty({ example: '2026-06-06T02:03:57.313Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-06-06T02:03:57.313Z' })
  updatedAt!: Date;
}
