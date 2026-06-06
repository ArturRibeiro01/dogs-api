import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DogInterest, DogSex, DogSize } from '@prisma/client';

export class CreateDogDto {
  @ApiProperty({ example: 'Luke' })
  name!: string;

  @ApiProperty({ example: '1d2173fe-fcb0-4f7e-8ef5-bf4c3c4ddc71' })
  breedId!: string;

  @ApiPropertyOptional({ example: '2021-08-10' })
  birthDate?: string;

  @ApiPropertyOptional({ enum: DogSex, enumName: 'DogSex', example: DogSex.male })
  sex?: DogSex;

  @ApiPropertyOptional({ enum: DogSize, enumName: 'DogSize', example: DogSize.medium })
  size?: DogSize;

  @ApiPropertyOptional({ example: 12.5 })
  weight?: number;

  @ApiPropertyOptional({ example: 'Ama parques e caminhadas.' })
  bio?: string;

  @ApiPropertyOptional({ example: 'https://example.com/luke.png' })
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'Sao Paulo' })
  city?: string;

  @ApiPropertyOptional({ example: 'SP' })
  state?: string;

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
