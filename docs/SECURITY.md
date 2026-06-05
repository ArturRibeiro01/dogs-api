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

- Access token JWT curto.
- Refresh token opaco.
- Refresh token salvo como hash no banco.
- Rotação de refresh token.
- Logout revogando token ativo.
- Senhas com hash forte.

## Rate Limit Planejado

Aplicar rate limit em:

- login;
- recuperação de senha;
- upload;
- contact interests.

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
- service role keys;
- connection strings;
- payloads sensíveis completos.
