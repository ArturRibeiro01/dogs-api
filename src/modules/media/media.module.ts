import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { SupabaseStorageService } from './supabase-storage.service';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule],
  controllers: [MediaController],
  providers: [MediaService, SupabaseStorageService],
})
export class MediaModule {}
