import { Module } from '@nestjs/common';

import { AppConfigModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { BreedsModule } from './modules/breeds/breeds.module';
import { DogsModule } from './modules/dogs/dogs.module';
import { HealthModule } from './modules/health/health.module';
import { PostsModule } from './modules/posts/posts.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    AppConfigModule,
    HealthModule,
    AuthModule,
    UsersModule,
    BreedsModule,
    DogsModule,
    PostsModule,
  ],
})
export class AppModule {}
