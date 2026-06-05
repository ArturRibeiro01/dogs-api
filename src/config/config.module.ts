import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { createConfiguration } from './configuration';
import { validateEnv } from './validate-env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env.local', '.env'],
      validate: (config) => {
        const env = validateEnv(config);

        return createConfiguration(env);
      },
    }),
  ],
})
export class AppConfigModule {}
