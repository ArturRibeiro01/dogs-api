# Deployment

Plano de deploy para o backend `dogs-api`.

## Estado Atual

O deploy dev está definido em `render.yaml` para o Render:

- serviço `dogs-api-dev`;
- branch `develop`;
- auto deploy após os checks do GitHub passarem;
- health check em `/health`;
- Swagger em `/docs` e `/docs-json`.

O serviço de produção será adicionado quando o Supabase `dogs-prod` estiver criado.

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

Planejado:

- branch `main`;
- secrets do ambiente prod;
- banco Supabase `dogs-prod`;
- migrations aplicadas com cuidado;
- Swagger público ou protegido por basic auth.

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

- Política final de Swagger em produção.
- Estratégia de migrations em produção.
- Estratégia de email para convites.
- Configuração de Supabase Auth por ambiente.
