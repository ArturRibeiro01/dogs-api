# Auth Strategy

Este documento registra a decisão de autenticação do `dogs-api`.

## Decisão

Usar Supabase Auth como provedor de identidade.

A Dogs API não implementa cadastro, login, refresh token ou password reset próprios.

## Motivos

- Supabase Auth já suporta email/senha, magic link/OTP, social login e SSO.
- Provedores desejados como Google, Apple e Azure (Microsoft) são suportados pelo Supabase Auth.
- Social login é uma área sensível e trabalhosa para implementar do zero com segurança.
- A Dogs API continua responsável pelo domínio próprio: cachorros, tutores, memberships, posts, upload, permissões e contratos REST.

## Fluxo

```txt
Frontend -> Supabase Auth
Frontend recebe access token
Frontend -> Dogs API com Authorization: Bearer <supabase_access_token>
Dogs API valida token Supabase
Dogs API sincroniza perfil local User
Dogs API aplica regras de domínio
```

## Responsabilidades Do Supabase Auth

- Cadastro por email e senha.
- Login por email e senha.
- Social login.
- Refresh de sessão.
- Logout no frontend.
- Recuperação de senha.
- Confirmação de email, se habilitada.
- Armazenamento de identidades no schema interno `auth`.

## Responsabilidades Da Dogs API

- Validar token Supabase em endpoints privados.
- Criar guard de autenticação.
- Criar decorator para usuário autenticado.
- Criar ou atualizar perfil local `User`.
- Associar `User.supabaseAuthId` ao `sub` do token Supabase.
- Aplicar permissões de domínio.

## Modelo Local

O modelo `User` representa o perfil da aplicação, não as credenciais.

Campo principal de vínculo:

```txt
User.supabaseAuthId
```

Esse campo referencia conceitualmente o `id` do usuário no Supabase Auth.

## O Que Não Fica Na Dogs API

- `passwordHash`.
- `RefreshToken`.
- `PasswordResetToken`.
- Hash de senha.
- Rotação própria de refresh token.
- Password reset próprio.
- Implementação própria de OAuth.

## Endpoints Planejados Na Dogs API

```txt
GET  /v1/auth/me
POST /v1/auth/sync
GET  /v1/users/me
PATCH /v1/users/me
```

## Endpoints Que Ficam No Supabase Auth

- register;
- login;
- refresh;
- logout;
- password reset;
- social login callbacks.

## Provedores Desejados

- Email e senha.
- Google.
- Apple.
- Azure (Microsoft).

## Decisões Pendentes

- Criar o projeto `dogs-dev` no Supabase.
- Configurar redirect URLs locais, dev e prod.
- Definir se confirmação de email será obrigatória.
- Definir se a Dogs API validará token por `SUPABASE_JWT_SECRET`, JWKS ou Admin API.
