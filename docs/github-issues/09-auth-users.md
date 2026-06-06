# Supabase Auth E Users

## Contexto

Tutores autenticam pelo Supabase Auth e a Dogs API mantém apenas o perfil local necessário para regras de domínio.

## Objetivo

Validar tokens Supabase na Dogs API e implementar endpoints de usuário logado/perfil local.

## Escopo

- `GET /v1/auth/me`.
- `POST /v1/auth/sync`.
- `GET /v1/users/me`.
- `PATCH /v1/users/me`.
- Criar guard para validar `Authorization: Bearer <supabase_access_token>`.
- Criar decorator de usuário autenticado.
- Sincronizar `User.supabaseAuthId`, email, nome e avatar quando disponível.

## Fora De Escopo

- Implementar login por email/senha no backend.
- Implementar refresh token próprio.
- Implementar password reset próprio.
- Configurar provedores OAuth no painel Supabase.
- Convites de tutor.

## Critérios De Aceite

- Requests sem token válido recebem `UNAUTHORIZED`.
- Token Supabase válido permite acessar `GET /v1/auth/me`.
- `POST /v1/auth/sync` cria ou atualiza perfil local.
- `GET /v1/users/me` retorna perfil local do tutor autenticado.
- `PATCH /v1/users/me` atualiza campos editáveis do perfil.
- Dogs API não salva senha, refresh token ou token de recuperação.
