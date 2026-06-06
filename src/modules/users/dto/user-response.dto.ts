import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '7af9f040-922b-4a6f-97d8-f39cc338c29d' })
  id!: string;

  @ApiProperty({ example: '7af9f040-922b-4a6f-97d8-f39cc338c29d' })
  supabaseAuthId!: string;

  @ApiProperty({ example: 'artur' })
  username!: string;

  @ApiProperty({ example: 'Artur Ribeiro' })
  name!: string;

  @ApiProperty({ example: 'artur@example.com' })
  email!: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.png' })
  avatarUrl?: string | null;

  @ApiPropertyOptional({ example: 'Tutor apaixonado por cachorros.' })
  bio?: string | null;

  @ApiPropertyOptional({ example: 'São Paulo' })
  city?: string | null;

  @ApiPropertyOptional({ example: 'SP' })
  state?: string | null;

  @ApiProperty({ example: '2026-06-05T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-06-05T12:00:00.000Z' })
  updatedAt!: Date;
}
