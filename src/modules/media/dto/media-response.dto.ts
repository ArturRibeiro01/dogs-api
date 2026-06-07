import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MediaResponseDto {
  @ApiProperty({ example: '40a406b9-9563-4172-97de-3c0cf485ee6d' })
  id!: string;

  @ApiProperty({ example: '40a406b9-9563-4172-97de-3c0cf485ee6d' })
  postId!: string;

  @ApiProperty({ example: '40a406b9-9563-4172-97de-3c0cf485ee6d' })
  dogId!: string;

  @ApiProperty({ example: '40a406b9-9563-4172-97de-3c0cf485ee6d' })
  uploadedByUserId!: string;

  @ApiProperty({ example: 'dogs-media' })
  storageBucket!: string;

  @ApiProperty({ example: 'posts/post-id/image.webp' })
  storageKey!: string;

  @ApiProperty({
    example:
      'https://example.supabase.co/storage/v1/object/public/dogs-media/posts/post-id/image.webp',
  })
  url!: string;

  @ApiProperty({ example: 'image/webp' })
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
