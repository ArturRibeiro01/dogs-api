import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostVisibility } from '@prisma/client';

import { DogResponseDto } from '../../dogs/dto/dog-response.dto';

export class PostMediaResponseDto {
  @ApiProperty({ example: '40a406b9-9563-4172-97de-3c0cf485ee6d' })
  id!: string;

  @ApiProperty({ example: 'dogs-media' })
  storageBucket!: string;

  @ApiProperty({ example: 'posts/post-id/image.jpg' })
  storageKey!: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  url!: string;

  @ApiProperty({ example: 'image/jpeg' })
  mimeType!: string;

  @ApiProperty({ example: 102400 })
  size!: number;

  @ApiPropertyOptional({ example: 1200, nullable: true })
  width!: number | null;

  @ApiPropertyOptional({ example: 900, nullable: true })
  height!: number | null;

  @ApiProperty({ example: '2026-06-06T02:03:57.313Z' })
  createdAt!: Date;
}

export class PostAuthorResponseDto {
  @ApiProperty({ example: '40a406b9-9563-4172-97de-3c0cf485ee6d' })
  id!: string;

  @ApiProperty({ example: 'artur_dev' })
  username!: string;

  @ApiProperty({ example: 'Artur Ribeiro' })
  name!: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.png', nullable: true })
  avatarUrl!: string | null;
}

export class PostResponseDto {
  @ApiProperty({ example: '40a406b9-9563-4172-97de-3c0cf485ee6d' })
  id!: string;

  @ApiProperty({ example: '40a406b9-9563-4172-97de-3c0cf485ee6d' })
  dogId!: string;

  @ApiProperty({ example: '40a406b9-9563-4172-97de-3c0cf485ee6d' })
  authorUserId!: string;

  @ApiPropertyOptional({ example: 'Primeiro passeio no parque.', nullable: true })
  caption!: string | null;

  @ApiProperty({ enum: PostVisibility, enumName: 'PostVisibility' })
  visibility!: PostVisibility;

  @ApiPropertyOptional({ example: '2026-06-06T02:03:57.313Z', nullable: true })
  publishedAt!: Date | null;

  @ApiProperty({ type: DogResponseDto })
  dog!: DogResponseDto;

  @ApiProperty({ type: PostAuthorResponseDto })
  author!: PostAuthorResponseDto;

  @ApiProperty({ type: PostMediaResponseDto, isArray: true })
  media!: PostMediaResponseDto[];

  @ApiProperty({ example: '2026-06-06T02:03:57.313Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-06-06T02:03:57.313Z' })
  updatedAt!: Date;
}
