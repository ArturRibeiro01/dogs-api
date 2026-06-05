# Deployment

Plano de deploy para o backend `dogs-api`.

## Estado Atual

Deploy real ainda não foi implementado.

Esta documentação registra a direção planejada para as próximas issues.

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

Planejado:

- branch `develop`;
- secrets do ambiente dev;
- banco Supabase `dogs-dev`;
- Swagger publicado para validação.

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

- Provedor de deploy da API.
- Política final de Swagger em produção.
- Estratégia de migrations em produção.
- Estratégia de email para recuperação de senha e convites.
