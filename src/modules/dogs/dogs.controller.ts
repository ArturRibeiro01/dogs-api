import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { itemResponse, listResponse } from '../../common/responses/api-response';
import { AuthenticatedUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { CreateDogDto } from './dto/create-dog.dto';
import { DogMemberResponseDto } from './dto/dog-member-response.dto';
import { DogResponseDto } from './dto/dog-response.dto';
import { ListDogsQueryDto } from './dto/list-dogs-query.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { DogsService } from './dogs.service';

@ApiTags('dogs')
@Controller('v1/dogs')
export class DogsController {
  constructor(private readonly dogsService: DogsService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: DogResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Supabase access token.' })
  @ApiNotFoundResponse({ description: 'Breed not found.' })
  async create(@CurrentUser() currentUser: AuthenticatedUser, @Body() body: CreateDogDto) {
    const dog = await this.dogsService.create(currentUser, body);

    return itemResponse(dog);
  }

  @Get()
  @ApiOkResponse({ type: DogResponseDto, isArray: true })
  async list(@Query() query: ListDogsQueryDto) {
    const result = await this.dogsService.findAll(query);

    return listResponse(result.dogs, result.pagination);
  }

  @Get(':slug')
  @ApiOkResponse({ type: DogResponseDto })
  @ApiNotFoundResponse({ description: 'Dog not found.' })
  async findBySlug(@Param('slug') slug: string) {
    const dog = await this.dogsService.findPublicBySlug(slug);

    return itemResponse(dog);
  }

  @Patch(':dogId')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: DogResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Supabase access token.' })
  @ApiForbiddenResponse({ description: 'Current user cannot manage this dog.' })
  @ApiNotFoundResponse({ description: 'Dog or breed not found.' })
  async update(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('dogId') dogId: string,
    @Body() body: UpdateDogDto,
  ) {
    const dog = await this.dogsService.update(currentUser, dogId, body);

    return itemResponse(dog);
  }

  @Delete(':dogId')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Dog deleted.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Supabase access token.' })
  @ApiForbiddenResponse({ description: 'Only owners can delete dogs.' })
  @ApiNotFoundResponse({ description: 'Dog not found.' })
  async delete(@CurrentUser() currentUser: AuthenticatedUser, @Param('dogId') dogId: string) {
    const deletedDog = await this.dogsService.delete(currentUser, dogId);

    return itemResponse(deletedDog);
  }

  @Get(':dogId/members')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: DogMemberResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Supabase access token.' })
  @ApiForbiddenResponse({ description: 'Current user cannot view this dog members.' })
  @ApiNotFoundResponse({ description: 'Dog not found.' })
  async members(@CurrentUser() currentUser: AuthenticatedUser, @Param('dogId') dogId: string) {
    const members = await this.dogsService.findMembers(currentUser, dogId);

    return listResponse(members, {
      page: 1,
      perPage: members.length,
      total: members.length,
      totalPages: 1,
    });
  }
}
