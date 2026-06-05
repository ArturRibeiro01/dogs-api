import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AppConfig } from './config/configuration';
import { setupSwagger } from './swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<AppConfig, true>);
  const appConfig = configService.get('app', { infer: true });

  app.enableCors({
    origin: appConfig.corsOrigins,
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  setupSwagger(app, configService);

  await app.listen(appConfig.port);
}

void bootstrap();
