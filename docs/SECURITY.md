# Security

Diretrizes de segurança para o backend `dogs-api`.

## Repositório Público

O repositório pode ser público desde que:

- nenhum secret real seja commitado;
- connection strings reais fiquem fora do código;
- Supabase service role key fique apenas em GitHub Secrets e no provedor de deploy;
- Swagger não exponha tokens reais;
- seeds usem dados fake;
- logs não imprimam dados sensíveis.

## Secrets

Nunca versionar:

```txt
.env
.env.local
.env.dev
.env.prod
```

Versionar apenas:

```txt
.env.example
```

## Autenticação Planejada

- Supabase Auth gerencia cadastro, login, refresh token, password reset e provedores sociais.
- Frontend autentica com Supabase Auth e envia `Authorization: Bearer <supabase_access_token>` para a Dogs API.
- Dogs API valida o access token Supabase antes de endpoints privados.
- Dogs API mantém apenas o perfil local `User`, vinculado por `supabaseAuthId`.
- Dogs API não salva senha, refresh token ou token de recuperação.

Provedores desejados no Supabase Auth:

- email e senha;
- Google;
- Apple;
- Azure (Microsoft).

## Rate Limit Planejado

Aplicar rate limit em:

- upload;
- contact interests.

Login e recuperação de senha ficam sob responsabilidade do Supabase Auth.

## Upload

Validações planejadas:

- MIME type;
- extensão;
- tamanho máximo;
- apenas imagens no MVP.

## CORS

CORS deve ser configurável por ambiente:

```txt
CORS_ORIGINS=http://localhost:5173
```

Em produção, limitar aos domínios reais do frontend.

## Swagger

Opções para produção:

1. Swagger público sem exemplos sensíveis.
2. Swagger protegido por basic auth.

A decisão final está em `docs/PENDING_DECISIONS.md`.

## Logs

Logs internos podem registrar contexto técnico, mas não devem conter:

- senhas;
- tokens;
- refresh tokens;
- Supabase anon key quando não for pública no contexto;
- service role keys;
- Supabase JWT secret;
- connection strings;
- payloads sensíveis completos.
