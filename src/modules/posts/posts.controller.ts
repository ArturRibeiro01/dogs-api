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
import { CreatePostDto } from './dto/create-post.dto';
import { ListPostsQueryDto } from './dto/list-posts-query.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@ApiTags('posts')
@Controller('v1/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PostResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Supabase access token.' })
  @ApiForbiddenResponse({ description: 'Current user cannot publish for this dog.' })
  @ApiNotFoundResponse({ description: 'Dog not found.' })
  async create(@CurrentUser() currentUser: AuthenticatedUser, @Body() body: CreatePostDto) {
    const post = await this.postsService.create(currentUser, body);

    return itemResponse(post);
  }

  @Get()
  @ApiOkResponse({ type: PostResponseDto, isArray: true })
  async list(@Query() query: ListPostsQueryDto) {
    const result = await this.postsService.findAll(query);

    return listResponse(result.posts, result.pagination);
  }

  @Get(':postId')
  @ApiOkResponse({ type: PostResponseDto })
  @ApiNotFoundResponse({ description: 'Post not found.' })
  async findById(@Param('postId') postId: string) {
    const post = await this.postsService.findPublicById(postId);

    return itemResponse(post);
  }

  @Patch(':postId')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Supabase access token.' })
  @ApiForbiddenResponse({ description: 'Current user cannot manage this post.' })
  @ApiNotFoundResponse({ description: 'Post not found.' })
  async update(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('postId') postId: string,
    @Body() body: UpdatePostDto,
  ) {
    const post = await this.postsService.update(currentUser, postId, body);

    return itemResponse(post);
  }

  @Delete(':postId')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Post soft deleted.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Supabase access token.' })
  @ApiForbiddenResponse({ description: 'Current user cannot manage this post.' })
  @ApiNotFoundResponse({ description: 'Post not found.' })
  async delete(@CurrentUser() currentUser: AuthenticatedUser, @Param('postId') postId: string) {
    const deletedPost = await this.postsService.delete(currentUser, postId);

    return itemResponse(deletedPost);
  }
}
