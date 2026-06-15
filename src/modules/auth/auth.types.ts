import { Request } from 'express';

export type AuthenticatedUser = {
  supabaseAuthId: string;
  email: string;
  name?: string;
  avatarUrl?: string;
};

export type RequestWithAuthenticatedUser = Request & {
  user?: AuthenticatedUser;
};
