import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { DogsController } from './dogs.controller';
import { DogsService } from './dogs.service';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule],
  controllers: [DogsController],
  providers: [DogsService],
})
export class DogsModule {}
