import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { RequestWithAuthenticatedUser } from '../auth.types';
import { SupabaseAuthService } from '../supabase-auth.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseAuthService: SupabaseAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAuthenticatedUser>();
    const token = this.getBearerToken(request.headers.authorization);

    request.user = await this.supabaseAuthService.verifyAccessToken(token);

    return true;
  }

  private getBearerToken(authorizationHeader: string | undefined): string {
    if (!authorizationHeader) {
      throw new UnauthorizedException('Token de autenticação ausente.');
    }

    const [scheme, token] = authorizationHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Formato de token inválido.');
    }

    return token;
  }
}
