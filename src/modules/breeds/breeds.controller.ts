import { Controller, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { itemResponse, listResponse } from '../../common/responses/api-response';
import { BreedsService } from './breeds.service';
import { BreedResponseDto } from './dto/breed-response.dto';

@ApiTags('breeds')
@Controller('v1/breeds')
export class BreedsController {
  constructor(private readonly breedsService: BreedsService) {}

  @Get()
  @ApiOkResponse({ type: BreedResponseDto, isArray: true })
  async list() {
    const breeds = await this.breedsService.findAll();

    return listResponse(breeds, {
      page: 1,
      perPage: breeds.length,
      total: breeds.length,
      totalPages: 1,
    });
  }

  @Get(':slug')
  @ApiOkResponse({ type: BreedResponseDto })
  @ApiNotFoundResponse({ description: 'Breed not found.' })
  async findBySlug(@Param('slug') slug: string) {
    const breed = await this.breedsService.findBySlug(slug);

    return itemResponse(breed);
  }
}
