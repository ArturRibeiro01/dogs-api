import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

import { AppConfig } from '../../config/configuration';
import { AuthenticatedUser } from './auth.types';

@Injectable()
export class SupabaseAuthService {
  private readonly client?: SupabaseClient;

  constructor(configService: ConfigService<AppConfig, true>) {
    const supabaseConfig = configService.get('supabase', { infer: true });

    if (supabaseConfig.url && supabaseConfig.anonKey) {
      this.client = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    }
  }

  async verifyAccessToken(accessToken: string): Promise<AuthenticatedUser> {
    if (!this.client) {
      throw new UnauthorizedException('Supabase Auth não está configurado.');
    }

    const { data, error } = await this.client.auth.getUser(accessToken);

    if (error || !data.user) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    return this.toAuthenticatedUser(data.user);
  }

  private toAuthenticatedUser(user: User): AuthenticatedUser {
    const email = user.email;

    if (!email) {
      throw new UnauthorizedException('Token não possui email associado.');
    }

    return {
      supabaseAuthId: user.id,
      email,
      name: this.getStringMetadata(user, 'name') ?? this.getStringMetadata(user, 'full_name'),
      avatarUrl: this.getStringMetadata(user, 'avatar_url'),
    };
  }

  private getStringMetadata(user: User, key: string): string | undefined {
    const metadata = user.user_metadata as Record<string, unknown>;
    const value = metadata[key];

    return typeof value === 'string' && value.trim() ? value : undefined;
  }
}
