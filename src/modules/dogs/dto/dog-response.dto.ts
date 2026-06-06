import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DogInterest, DogSex, DogSize } from '@prisma/client';

import { BreedResponseDto } from '../../breeds/dto/breed-response.dto';

export class DogResponseDto {
  @ApiProperty({ example: '40a406b9-9563-4172-97de-3c0cf485ee6d' })
  id!: string;

  @ApiProperty({ example: 'luke' })
  slug!: string;

  @ApiProperty({ example: 'Luke' })
  name!: string;

  @ApiProperty({ example: '1d2173fe-fcb0-4f7e-8ef5-bf4c3c4ddc71' })
  breedId!: string;

  @ApiPropertyOptional({ example: '2021-08-10T00:00:00.000Z', nullable: true })
  birthDate!: Date | null;

  @ApiProperty({ enum: DogSex, enumName: 'DogSex', example: DogSex.male })
  sex!: DogSex;

  @ApiPropertyOptional({ enum: DogSize, enumName: 'DogSize', example: DogSize.medium })
  size!: DogSize | null;

  @ApiPropertyOptional({ example: '12.5', nullable: true })
  weight!: unknown;

  @ApiPropertyOptional({ example: 'Ama parques e caminhadas.', nullable: true })
  bio!: string | null;

  @ApiPropertyOptional({ example: 'https://example.com/luke.png', nullable: true })
  avatarUrl!: string | null;

  @ApiPropertyOptional({ example: 'Sao Paulo', nullable: true })
  city!: string | null;

  @ApiPropertyOptional({ example: 'SP', nullable: true })
  state!: string | null;

  @ApiProperty({ enum: DogInterest, enumName: 'DogInterest', isArray: true })
  interests!: DogInterest[];

  @ApiProperty({ example: true })
  isPublic!: boolean;

  @ApiProperty({ type: BreedResponseDto })
  breed!: BreedResponseDto;

  @ApiProperty({ example: '2026-06-06T02:03:57.313Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-06-06T02:03:57.313Z' })
  updatedAt!: Date;
}
