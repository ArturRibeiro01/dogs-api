import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCurrentUserDto {
  @ApiPropertyOptional({ example: 'artur' })
  username?: string;

  @ApiPropertyOptional({ example: 'Artur Ribeiro' })
  name?: string;

  @ApiPropertyOptional({ example: 'Tutor apaixonado por cachorros.' })
  bio?: string;

  @ApiPropertyOptional({ example: 'São Paulo' })
  city?: string;

  @ApiPropertyOptional({ example: 'SP' })
  state?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.png' })
  avatarUrl?: string;
}
