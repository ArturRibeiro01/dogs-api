import { ApiPropertyOptional } from '@nestjs/swagger';

export class SyncAuthUserDto {
  @ApiPropertyOptional({ example: 'artur' })
  username?: string;

  @ApiPropertyOptional({ example: 'Artur Ribeiro' })
  name?: string;

  @ApiPropertyOptional({ example: 'São Paulo' })
  city?: string;

  @ApiPropertyOptional({ example: 'SP' })
  state?: string;
}
