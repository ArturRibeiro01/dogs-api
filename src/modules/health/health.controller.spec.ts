import { Test } from '@nestjs/testing';

import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  it('returns operational status', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    const controller = moduleRef.get(HealthController);
    const response = controller.getHealth();

    expect(response.status).toBe('ok');
    expect(response.service).toBe('dogs-api');
    expect(response.timestamp).toEqual(expect.any(String));

    await moduleRef.close();
  });
});
