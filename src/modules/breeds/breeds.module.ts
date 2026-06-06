import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';
import { BreedsController } from './breeds.controller';
import { BreedsService } from './breeds.service';

@Module({
  imports: [DatabaseModule],
  controllers: [BreedsController],
  providers: [BreedsService],
})
export class BreedsModule {}
