import { ApiProperty } from '@nestjs/swagger';

export class CreateMediaDto {
  @ApiProperty({ example: '40a406b9-9563-4172-97de-3c0cf485ee6d' })
  postId!: string;
}
