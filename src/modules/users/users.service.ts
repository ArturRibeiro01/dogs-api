import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';
import { AuthenticatedUser } from '../auth/auth.types';
import { SyncAuthUserDto } from '../auth/dto/sync-auth-user.dto';
import { UpdateCurrentUserDto } from './dto/update-current-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateFromAuth(authUser: AuthenticatedUser): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { supabaseAuthId: authUser.supabaseAuthId },
    });

    if (user) {
      return user;
    }

    return this.createFromAuth(authUser, {});
  }

  async syncFromAuth(authUser: AuthenticatedUser, input: SyncAuthUserDto): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { supabaseAuthId: authUser.supabaseAuthId },
    });

    if (existingUser) {
      return this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          email: authUser.email,
          name: input.name ?? authUser.name ?? existingUser.name,
          username: input.username ? this.normalizeUsername(input.username) : existingUser.username,
          avatarUrl: authUser.avatarUrl ?? existingUser.avatarUrl,
          city: input.city ?? existingUser.city,
          state: input.state ?? existingUser.state,
        },
      });
    }

    return this.createFromAuth(authUser, input);
  }

  async updateCurrentUser(authUser: AuthenticatedUser, input: UpdateCurrentUserDto): Promise<User> {
    const user = await this.findOrCreateFromAuth(authUser);

    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        username: input.username ? this.normalizeUsername(input.username) : undefined,
        name: input.name,
        bio: input.bio,
        city: input.city,
        state: input.state,
        avatarUrl: input.avatarUrl,
      },
    });
  }

  private async createFromAuth(authUser: AuthenticatedUser, input: SyncAuthUserDto): Promise<User> {
    const username = input.username
      ? this.normalizeUsername(input.username)
      : await this.createUniqueUsername(authUser.email);

    return this.prisma.user.create({
      data: {
        supabaseAuthId: authUser.supabaseAuthId,
        email: authUser.email,
        username,
        name: input.name ?? authUser.name ?? username,
        avatarUrl: authUser.avatarUrl,
        city: input.city,
        state: input.state,
      },
    });
  }

  private async createUniqueUsername(email: string): Promise<string> {
    const baseUsername = this.normalizeUsername(email.split('@')[0] ?? 'tutor');

    for (let attempt = 0; attempt < 20; attempt += 1) {
      const username = attempt === 0 ? baseUsername : `${baseUsername}${attempt + 1}`;
      const existingUser = await this.prisma.user.findUnique({
        where: { username },
        select: { id: true },
      });

      if (!existingUser) {
        return username;
      }
    }

    return `${baseUsername}${Date.now()}`;
  }

  private normalizeUsername(value: string): string {
    const username = value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');

    return username || 'tutor';
  }
}
