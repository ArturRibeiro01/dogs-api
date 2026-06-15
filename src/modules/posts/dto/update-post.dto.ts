import { ApiPropertyOptional } from '@nestjs/swagger';
import { PostVisibility } from '@prisma/client';

export class UpdatePostDto {
  @ApiPropertyOptional({ example: 'Legenda atualizada.' })
  caption?: string | null;

  @ApiPropertyOptional({
    enum: PostVisibility,
    enumName: 'PostVisibility',
    example: PostVisibility.public,
  })
  visibility?: PostVisibility;
}
