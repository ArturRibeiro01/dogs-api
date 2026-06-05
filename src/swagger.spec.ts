import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import request = require('supertest');

import { AppModule } from './app.module';
import { AppConfig } from './config/configuration';
import { setupSwagger } from './swagger';

type OpenApiJson = {
  info: {
    title: string;
  };
  paths: Record<string, unknown>;
};

describe('setupSwagger', () => {
  let app: INestApplication;

  afterEach(async () => {
    await app?.close();
  });

  it('exposes OpenAPI JSON when Swagger is enabled', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    const configService = app.get(ConfigService<AppConfig, true>);

    setupSwagger(app, configService);

    await app.init();

    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];
    const response = await request(httpServer).get('/docs-json').expect(200);
    const body = response.body as OpenApiJson;

    expect(body.info.title).toBe('Dogs API');
    expect(body.paths).toHaveProperty('/health');
  });
});
