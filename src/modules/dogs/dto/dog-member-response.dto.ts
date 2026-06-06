import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DogMembershipRole, DogMembershipStatus } from '@prisma/client';

export class DogMemberUserResponseDto {
  @ApiProperty({ example: '40a406b9-9563-4172-97de-3c0cf485ee6d' })
  id!: string;

  @ApiProperty({ example: 'artur_dev' })
  username!: string;

  @ApiProperty({ example: 'Artur Ribeiro' })
  name!: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.png', nullable: true })
  avatarUrl!: string | null;
}

export class DogMemberResponseDto {
  @ApiProperty({ example: '40a406b9-9563-4172-97de-3c0cf485ee6d' })
  id!: string;

  @ApiProperty({ example: '40a406b9-9563-4172-97de-3c0cf485ee6d' })
  dogId!: string;

  @ApiProperty({ example: '40a406b9-9563-4172-97de-3c0cf485ee6d' })
  userId!: string;

  @ApiProperty({ enum: DogMembershipRole, enumName: 'DogMembershipRole' })
  role!: DogMembershipRole;

  @ApiProperty({ enum: DogMembershipStatus, enumName: 'DogMembershipStatus' })
  status!: DogMembershipStatus;

  @ApiProperty({ type: DogMemberUserResponseDto })
  user!: DogMemberUserResponseDto;

  @ApiProperty({ example: '2026-06-06T02:03:57.313Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-06-06T02:03:57.313Z' })
  updatedAt!: Date;
}
