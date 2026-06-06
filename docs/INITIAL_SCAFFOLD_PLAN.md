# Plano Inicial De Scaffold

Este plano organiza a primeira fase do backend `dogs-api` antes da implementação das features de produto.

Objetivo desta fase:

- criar uma base NestJS confiável;
- documentar arquitetura, ambientes e decisões;
- preparar CI, qualidade local e backlog;
- deixar o projeto pronto para implementar a API em pequenas issues.

## Premissas

- Repositório separado do frontend `react-dogs`.
- API REST versionada em `/v1`.
- Health check em `/health`.
- Swagger em `/docs` e `/docs-json`.
- Banco PostgreSQL via Supabase.
- Storage de imagens via Supabase Storage.
- Autenticação via Supabase Auth.
- Prisma como ORM e fonte de migrations.
- Branch flow: `feature/* -> develop -> main`.
- Ambientes iniciais: `local`, `dev`, `prod`.
- `hml` fica fora do MVP e pode entrar quando houver fluxo de release mais rígido.

## Fase 0: Organização Do Repositório

Arquivos e pastas iniciais:

```txt
docs/
  BACKEND_API_PLAN.md
  CODEX_BACKEND_HANDOFF.md
  DOGS_API_SPEC.md
  INITIAL_SCAFFOLD_PLAN.md
  PENDING_DECISIONS.md
  PROJECT_STATUS.md
  github-issues/
.codex/
  project.md
.github/
  workflows/
src/
prisma/
test/
```

Saída esperada:

- README com visão rápida do projeto e comandos.
- `.env.example` seguro.
- `.gitignore` bloqueando `.env` reais.
- documentação inicial suficiente para retomar contexto sem depender de conversas antigas.

## Fase 1: Scaffold Técnico

Criar projeto NestJS com:

- TypeScript;
- Yarn;
- ESLint;
- Prettier;
- Husky;
- lint-staged;
- Jest ou Vitest;
- scripts de validação;
- build configurado;
- estrutura base de módulos.

Scripts mínimos:

```json
{
  "dev": "nest start --watch",
  "build": "nest build",
  "start": "node dist/main.js",
  "lint": "eslint . --max-warnings=0",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "typecheck": "tsc --noEmit",
  "test": "jest --runInBand",
  "test:e2e": "jest --config ./test/jest-e2e.json --runInBand",
  "validate": "yarn lint && yarn format:check && yarn typecheck && yarn test && yarn build",
  "prepare": "husky"
}
```

## Fase 2: Arquitetura Base

Estrutura sugerida:

```txt
src/
  app.module.ts
  main.ts
  config/
  database/
  common/
    decorators/
    filters/
    guards/
    interceptors/
    pipes/
  modules/
    health/
    auth/
    users/
    breeds/
    dogs/
    posts/
    media/
    favorites/
    contact-interests/
    analytics/
```

Decisões iniciais:

- controllers só expõem contrato HTTP;
- services concentram regra de domínio;
- Prisma fica encapsulado em `database`;
- responses seguem `{ data }` ou `{ data, pagination }`;
- erros públicos seguem `{ error: { code, message, details } }`;
- validação de env deve falhar no boot quando variável obrigatória estiver ausente;
- upload começa por multipart na API e pode evoluir para URL assinada.

## Fase 3: Prisma E Supabase

Criar:

- `prisma/schema.prisma`;
- Prisma Client;
- migrations;
- seed inicial de raças;
- documentação de conexão Supabase;
- scripts `prisma:generate`, `prisma:migrate:dev`, `prisma:migrate:deploy` e `prisma:validate`.

Modelagem inicial deve seguir a spec:

- `User`;
- `Dog`;
- `DogMembership`;
- `DogInvite`;
- `Breed`;
- `Post`;
- `Media`;
- `PostLike`;
- `DogFavorite`;
- `ContactInterest`;
- `AnalyticsEvent`;
  Autenticação, refresh token e password reset ficam no Supabase Auth.

## Fase 4: Observabilidade E Contrato

Criar:

- `GET /health`;
- Swagger em `/docs`;
- OpenAPI JSON em `/docs-json`;
- tags por módulo;
- exemplos sem tokens reais;
- filtro global de erros;
- pipe global de validação;
- CORS configurável por ambiente.

## Fase 5: CI E Qualidade

Criar `.github/workflows/ci.yml` com:

- install;
- lint;
- format check;
- typecheck;
- test;
- build;
- Prisma validate.

Regras esperadas:

- PR para `develop` roda validação completa.
- PR para `main` só pode vir de `develop`.
- `develop` representa API dev.
- `main` representa API prod.

## Fase 6: Collection HTTP

Criar uma collection para facilitar testes manuais durante desenvolvimento.

Opções:

- Postman;
- Insomnia;
- Bruno.

Decisão pendente:

- escolher formato principal da collection;
- decidir se será gerada manualmente, exportada da ferramenta ou derivada do OpenAPI;
- versionar collection sem tokens reais;
- incluir variáveis de ambiente fake/local;
- manter exemplos para auth, dogs, breeds, posts, media e health.

## Primeira Entrega Considerada Pronta

A primeira entrega de scaffold está pronta quando:

- o projeto sobe localmente;
- `GET /health` responde;
- Swagger abre;
- Prisma valida schema;
- `yarn validate` passa;
- `.env.example` existe;
- CI está configurado;
- backlog local tem issues priorizadas;
- collection HTTP inicial está planejada ou criada.
