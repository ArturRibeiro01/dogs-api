import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { itemResponse } from '../../common/responses/api-response';
import { AuthenticatedUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { UpdateCurrentUserDto } from './dto/update-current-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Supabase access token.' })
  async me(@CurrentUser() currentUser: AuthenticatedUser) {
    const user = await this.usersService.findOrCreateFromAuth(currentUser);

    return itemResponse(user);
  }

  @Patch('me')
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Supabase access token.' })
  async updateMe(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() body: UpdateCurrentUserDto,
  ) {
    const user = await this.usersService.updateCurrentUser(currentUser, body);

    return itemResponse(user);
  }
}
