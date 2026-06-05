import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppConfig } from './config/configuration';

export function setupSwagger(
  app: INestApplication,
  configService: ConfigService<AppConfig, true>,
): void {
  const swaggerConfig = configService.get('swagger', { infer: true });

  if (!swaggerConfig.enabled) {
    return;
  }

  const documentConfig = new DocumentBuilder()
    .setTitle('Dogs API')
    .setDescription('REST API for Dogs, a dog-centered social network.')
    .setVersion('0.1.0')
    .addTag('health', 'Operational status')
    .addTag('auth', 'Authentication and sessions')
    .addTag('users', 'Tutor profiles')
    .addTag('breeds', 'Dog breeds')
    .addTag('dogs', 'Dog profiles and memberships')
    .addTag('posts', 'Dog posts and feed')
    .addTag('media', 'Image upload and metadata')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, documentConfig);

  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs-json',
  });
}
