import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status!: 'ok';

  @ApiProperty({ example: 'dogs-api' })
  service!: string;

  @ApiProperty({ example: '2026-06-05T12:00:00.000Z' })
  timestamp!: string;
}
