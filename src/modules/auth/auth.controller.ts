import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { itemResponse } from '../../common/responses/api-response';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { UsersService } from '../users/users.service';
import { AuthenticatedUser } from './auth.types';
import { CurrentUser } from './current-user.decorator';
import { SyncAuthUserDto } from './dto/sync-auth-user.dto';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';

@ApiTags('auth')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Supabase access token.' })
  async me(@CurrentUser() currentUser: AuthenticatedUser) {
    const user = await this.usersService.findOrCreateFromAuth(currentUser);

    return itemResponse(user);
  }

  @Post('sync')
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Supabase access token.' })
  async sync(@CurrentUser() currentUser: AuthenticatedUser, @Body() body: SyncAuthUserDto) {
    const user = await this.usersService.syncFromAuth(currentUser, body);

    return itemResponse(user);
  }
}
