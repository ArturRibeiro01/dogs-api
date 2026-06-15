import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiPayloadTooLargeResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { itemResponse } from '../../common/responses/api-response';
import { AuthenticatedUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { CreateMediaDto } from './dto/create-media.dto';
import { MediaResponseDto } from './dto/media-response.dto';
import { MediaService } from './media.service';
import { UploadedImageFile } from './media.types';

@ApiTags('media')
@Controller('v1/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['postId', 'file'],
      properties: {
        postId: {
          type: 'string',
          format: 'uuid',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({ type: MediaResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Supabase access token.' })
  @ApiForbiddenResponse({ description: 'Current user cannot upload media for this dog.' })
  @ApiNotFoundResponse({ description: 'Post not found.' })
  @ApiPayloadTooLargeResponse({ description: 'Image exceeds max allowed size.' })
  async upload(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() body: CreateMediaDto,
    @UploadedFile() file: UploadedImageFile | undefined,
  ) {
    const media = await this.mediaService.upload(currentUser, body, file);

    return itemResponse(media);
  }
}
