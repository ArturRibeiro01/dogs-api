import { ApiPropertyOptional } from '@nestjs/swagger';
import { DogInterest, DogSex, DogSize } from '@prisma/client';

export class UpdateDogDto {
  @ApiPropertyOptional({ example: 'Luke' })
  name?: string;

  @ApiPropertyOptional({ example: '1d2173fe-fcb0-4f7e-8ef5-bf4c3c4ddc71' })
  breedId?: string;

  @ApiPropertyOptional({ example: '2021-08-10' })
  birthDate?: string | null;

  @ApiPropertyOptional({ enum: DogSex, enumName: 'DogSex', example: DogSex.male })
  sex?: DogSex;

  @ApiPropertyOptional({ enum: DogSize, enumName: 'DogSize', example: DogSize.medium })
  size?: DogSize | null;

  @ApiPropertyOptional({ example: 12.5 })
  weight?: number | null;

  @ApiPropertyOptional({ example: 'Ama parques e caminhadas.' })
  bio?: string | null;

  @ApiPropertyOptional({ example: 'https://example.com/luke.png' })
  avatarUrl?: string | null;

  @ApiPropertyOptional({ example: 'Sao Paulo' })
  city?: string | null;

  @ApiPropertyOptional({ example: 'SP' })
  state?: string | null;

  @ApiPropertyOptional({
    enum: DogInterest,
    enumName: 'DogInterest',
    isArray: true,
    example: [DogInterest.walks, DogInterest.friendship],
  })
  interests?: DogInterest[];

  @ApiPropertyOptional({ example: true })
  isPublic?: boolean;
}
