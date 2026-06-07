import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostVisibility } from '@prisma/client';

export class CreatePostDto {
  @ApiProperty({ example: '40a406b9-9563-4172-97de-3c0cf485ee6d' })
  dogId!: string;

  @ApiPropertyOptional({ example: 'Primeiro passeio no parque.' })
  caption?: string;

  @ApiPropertyOptional({
    enum: PostVisibility,
    enumName: 'PostVisibility',
    example: PostVisibility.public,
  })
  visibility?: PostVisibility;
}
