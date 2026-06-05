# Auth E Users

## Contexto

Tutores precisam criar conta, entrar, renovar sessão e consultar seus dados.

## Objetivo

Implementar autenticação inicial e endpoints de usuário logado.

## Escopo

- `POST /v1/auth/register`.
- `POST /v1/auth/login`.
- `POST /v1/auth/refresh`.
- `POST /v1/auth/logout`.
- `GET /v1/auth/me`.
- `GET /v1/users/me`.
- `PATCH /v1/users/me`.
- Hash de senha.
- Refresh token salvo como hash.

## Fora De Escopo

- Password reset.
- OAuth/social login.
- Convites de tutor.

## Critérios De Aceite

- Usuário consegue registrar e logar.
- Access token curto é emitido.
- Refresh token pode ser rotacionado.
- Logout revoga refresh token ativo.
- Senha e refresh token nunca são salvos em texto puro.
