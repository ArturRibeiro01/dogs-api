import { Module } from '@nestjs/common';

import { AppConfigModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { BreedsModule } from './modules/breeds/breeds.module';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [AppConfigModule, HealthModule, AuthModule, UsersModule, BreedsModule],
})
export class AppModule {}
