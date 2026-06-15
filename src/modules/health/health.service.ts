import { Injectable } from '@nestjs/common';

import { HealthResponseDto } from './health.dto';

@Injectable()
export class HealthService {
  getHealth(): HealthResponseDto {
    return {
      status: 'ok',
      service: 'dogs-api',
      timestamp: new Date().toISOString(),
    };
  }
}
