# Environments

Ambientes planejados para a `dogs-api`.

## Ambientes Iniciais

```txt
local
dev
prod
```

`hml` pode entrar depois, quando houver fluxo de release mais rígido.

## Mapeamento De Branch

```txt
feature/* -> develop -> main
develop   -> API dev
main      -> API prod
```

Se `hml` entrar futuramente:

```txt
release/* -> API hml
main      -> API prod
```

## Supabase

Projetos persistentes recomendados:

```txt
dogs-dev
dogs-prod
```

Projeto futuro opcional:

```txt
dogs-hml
```

## Variáveis De Ambiente Planejadas

Versionar apenas `.env.example`.

```txt
NODE_ENV=development
APP_ENV=local
PORT=3333
API_BASE_URL=http://localhost:3333
WEB_APP_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173

DATABASE_URL=
DIRECT_DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=30d

SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=dogs-media

MAIL_PROVIDER=console
MAIL_FROM=Dogs <no-reply@example.com>
MAIL_API_KEY=

SWAGGER_ENABLED=true
SWAGGER_BASIC_AUTH_USER=
SWAGGER_BASIC_AUTH_PASSWORD=
```

## Prisma E Supabase

Quando Prisma for configurado:

- `DATABASE_URL` pode usar conexão pooled para runtime;
- `DIRECT_DATABASE_URL` deve usar conexão direta para migrations.

## Arquivos Que Não Devem Ser Versionados

```txt
.env
.env.local
.env.dev
.env.prod
```

## Decisões Pendentes

Ver `docs/PENDING_DECISIONS.md`.
