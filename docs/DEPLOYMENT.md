# Deployment

Plano de deploy para o backend `dogs-api`.

## Estado Atual

O deploy dev está definido em `render.yaml` para o Render:

- serviço `dogs-api-dev`;
- branch `develop`;
- auto deploy após os checks do GitHub passarem;
- health check em `/health`;
- Swagger em `/docs` e `/docs-json`.

O deploy de produção também está definido em `render.yaml`:

- serviço `dogs-api-prod`;
- branch `main`;
- auto deploy após os checks do GitHub passarem;
- health check em `/health`;
- Swagger em `/docs` e `/docs-json`.

## Branch Flow

```txt
feature/* -> develop -> main
develop   -> API dev
main      -> API prod
```

## CI

Workflow esperado em pull requests:

- install;
- lint;
- format check;
- typecheck;
- test;
- build;
- Prisma validate, quando Prisma existir.

Comando local equivalente:

```sh
yarn validate
```

Workflow versionado:

```txt
.github/workflows/ci.yml
```

Required status check recomendado no GitHub:

```txt
Typecheck, test and build
```

PRs para `main` devem vir da branch `develop`; o workflow falha quando a origem for diferente.

## Deploy Dev

Configuração versionada em `render.yaml`:

```txt
develop -> dogs-api-dev -> Supabase dogs-dev
```

Build:

```sh
yarn install --frozen-lockfile --production=false
yarn prisma:generate
yarn prisma:migrate:deploy
yarn prisma:seed
yarn build
```

Start:

```sh
yarn start
```

As credenciais marcadas com `sync: false` devem ser informadas no primeiro sync do Blueprint no painel do Render.

Depois do deploy, valide:

```txt
GET https://dogs-api-dev.onrender.com/health
GET https://dogs-api-dev.onrender.com/docs
GET https://dogs-api-dev.onrender.com/docs-json
```

## Deploy Prod

Configuração versionada em `render.yaml`:

```txt
main -> dogs-api-prod -> Supabase dogs-prod
```

O build aplica migrations versionadas, executa o seed idempotente de raças e compila a API. As credenciais `sync: false` devem apontar exclusivamente para o projeto Supabase `dogs-prod`.

Depois do deploy, valide:

```txt
GET https://dogs-api-prod.onrender.com/health
GET https://dogs-api-prod.onrender.com/docs
GET https://dogs-api-prod.onrender.com/docs-json
```

## Migrations

Quando Prisma existir:

```sh
yarn prisma:migrate:deploy
```

Produção deve usar migrations versionadas, nunca `prisma db push`.

## Secrets

Secrets devem ficar no provedor de deploy e no GitHub Secrets.

Nunca colocar valores reais em:

- código;
- Swagger examples;
- docs;
- collections HTTP;
- seeds.

## Decisões Pendentes

- Estratégia de email para convites.
- Proteção opcional do Swagger de produção com basic auth.
