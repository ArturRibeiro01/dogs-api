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

No Render, o serviço dev acompanha `develop` e o serviço prod acompanha `main`, ambos com auto deploy após o CI passar.

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

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_JWT_SECRET=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=dogs-media

MAIL_PROVIDER=console
MAIL_FROM=Dogs <no-reply@example.com>
MAIL_API_KEY=

SWAGGER_ENABLED=true
SWAGGER_BASIC_AUTH_USER=
SWAGGER_BASIC_AUTH_PASSWORD=
```

## Validação No Boot

A API valida variáveis de ambiente ao iniciar. Se uma variável obrigatória estiver ausente ou inválida, a aplicação não sobe.

Arquivos locais lidos pela aplicação:

```txt
.env.local
.env
```

Ordem de prioridade:

```txt
.env.local -> .env -> ambiente do processo
```

Variáveis obrigatórias nesta fase:

```txt
APP_ENV
PORT
API_BASE_URL
WEB_APP_URL
CORS_ORIGINS
```

Valores aceitos para `APP_ENV`:

```txt
local
dev
hml
prod
```

Variáveis de banco, Supabase Auth, Supabase Storage, email e Swagger já aparecem no `.env.example`, mas algumas só serão tornadas obrigatórias quando os módulos correspondentes forem implementados.

## Prisma E Supabase

Quando Prisma for configurado:

- `DATABASE_URL` pode usar conexão pooled para runtime;
- `DIRECT_DATABASE_URL` deve usar conexão direta para migrations.

Scripts `prisma:generate` e `prisma:validate` usam URL local fake quando essas variáveis não existem, porque eles não precisam conectar no banco. Scripts de migration e seed exigem variáveis reais.

## Arquivos Que Não Devem Ser Versionados

```txt
.env
.env.local
.env.dev
.env.prod
```

## Decisões Pendentes

Ver `docs/PENDING_DECISIONS.md`.
