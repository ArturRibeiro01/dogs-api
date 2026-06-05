# Codex Backend Handoff

Este documento deve ser copiado para o novo repositório `dogs-api` e lido pelo Codex antes de iniciar o backend.

Ele complementa:

```txt
docs/DOGS_API_SPEC.md
docs/BACKEND_API_PLAN.md
```

## Objetivo

Criar um backend separado para o Dogs mantendo o mesmo padrão de organização, qualidade, documentação e esteira usado no frontend `react-dogs`.

O backend deve ser um projeto público de portfólio, bem documentado, com Swagger publicado, ambientes separados e validações locais/CI confiáveis.

## Contexto Do Frontend

Repositório frontend:

```txt
react-dogs
```

Stack atual do frontend:

- React 19
- TypeScript
- Vite
- React Router 6
- Zustand
- React Hook Form
- Zod
- Emotion
- Vitest
- Testing Library
- ESLint
- Prettier
- Husky
- lint-staged
- GitHub Actions
- GitHub Pages

O frontend já possui:

- modo demo/mock via `VITE_DEMO_MODE=true`
- configuração de API via `VITE_API_URL`
- CI/CD para dev e produção
- branch flow `feature/* -> develop -> main`
- docs em `docs/`
- backlog local em `docs/github-issues/`

## Stack Esperada Para O Backend

Stack recomendada:

- Node.js
- TypeScript
- NestJS
- Prisma ORM
- PostgreSQL via Supabase
- Supabase Storage
- JWT com refresh token
- Swagger/OpenAPI com `@nestjs/swagger`
- Zod ou class-validator
- Jest ou Vitest para testes
- ESLint
- Prettier
- Husky
- lint-staged
- GitHub Actions

O backend deve expor REST API versionada:

```txt
/v1
```

Swagger:

```txt
/docs
/docs-json
```

Health:

```txt
/health
```

## Padrão De Scripts

No backend, adaptar os scripts para NestJS, mas manter a ideia:

```json
{
  "scripts": {
    "dev": "nest start --watch",
    "start": "node dist/main.js",
    "build": "nest build",
    "lint": "eslint . --max-warnings=0",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit",
    "test": "jest --runInBand",
    "test:watch": "jest --watch",
    "test:e2e": "jest --config ./test/jest-e2e.json --runInBand",
    "prisma:generate": "prisma generate",
    "prisma:migrate:dev": "prisma migrate dev",
    "prisma:migrate:deploy": "prisma migrate deploy",
    "validate": "yarn lint && yarn format:check && yarn typecheck && yarn test && yarn build",
    "prepare": "husky"
  }
}
```

Se o projeto usar Vitest em vez de Jest, adaptar `test` e `test:e2e`, mas manter `yarn validate` como comando principal.

## Husky E lint-staged

O frontend usa:

```sh
yarn lint-staged
yarn typecheck
yarn test
```

No backend, usar o mesmo pre-commit:

```sh
yarn lint-staged
yarn typecheck
yarn test
```

Configuração de `lint-staged` sugerida:

```json
{
  "*.{ts,js}": ["eslint --fix --max-warnings=0", "prettier --write"],
  "*.{json,md,yml,yaml,prisma}": ["prettier --write"]
}
```

Não colocar `build` no pre-commit por padrão. O build deve rodar no CI e em `yarn validate`.

## CI/CD Esperado

Criar `.github/workflows/ci.yml`.

Fluxo de branches:

```txt
feature/* -> develop -> main
```

Regras:

- PR de feature entra em `develop`.
- PR para `main` só pode vir de `develop`.
- Push direto para `develop` e `main` deve ser bloqueado por ruleset no GitHub.
- CI precisa passar antes do merge.

Jobs mínimos em PR:

- install
- lint
- format check
- typecheck
- test
- build
- prisma validate

Jobs em deploy:

- `develop` publica API dev
- `main` publica API prod

Exemplo de validação de origem para PR em produção:

```yaml
- name: Validate production PR source
  if: github.event_name == 'pull_request' && github.base_ref == 'main' && github.head_ref != 'develop'
  run: |
    echo "Pull requests targeting main must come from develop."
    echo "Current source branch: ${{ github.head_ref }}"
    exit 1
```

No backend, adaptar deploy conforme provedor escolhido.

## Ambientes

Usar:

```txt
local
dev
prod
```

`hml` pode entrar depois, quando o fluxo amadurecer.

Mapeamento:

```txt
develop -> dev
main    -> prod
```

Supabase:

```txt
dogs-dev
dogs-prod
```

Se `hml` entrar:

```txt
dogs-hml
```

## Variáveis De Ambiente

Versionar apenas `.env.example`.

Nunca versionar:

```txt
.env
.env.local
.env.dev
.env.prod
```

Exemplo esperado:

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

## Segurança De Repo Público

O repositório pode ser público se:

- secrets não forem commitados.
- Supabase service role key ficar só em GitHub Secrets/provedor.
- connection strings reais não forem versionadas.
- seeds usarem dados fake.
- Swagger não tiver tokens reais em exemplos.
- logs não imprimirem dados sensíveis.
- `.gitignore` bloquear arquivos de ambiente reais.

## Estrutura De Docs

Manter no backend uma pasta:

```txt
docs/
```

Arquivos recomendados:

```txt
docs/README.md
docs/PRODUCT_AND_API_SPEC.md
docs/DEVELOPMENT.md
docs/DEPLOYMENT.md
docs/ARCHITECTURE.md
docs/ENVIRONMENTS.md
docs/SECURITY.md
docs/github-issues/
```

O arquivo `docs/PRODUCT_AND_API_SPEC.md` pode nascer copiando `docs/DOGS_API_SPEC.md` do frontend.

## Padrão De Issues Locais

No frontend, funcionou bem manter issues como markdown antes de publicar no GitHub.

Replicar no backend:

```txt
docs/github-issues/
  README.md
  PRIORITY.md
  create-issues.sh
  01-bootstrap-nestjs-api.md
  02-configure-prisma-supabase.md
  ...
```

Cada issue deve ter:

```md
## Contexto

## Objetivo

## Escopo

## Fora De Escopo

## Critérios De Aceite
```

`PRIORITY.md` deve organizar a execução por prioridade e dependência.

Quando uma issue for concluída:

- remover o arquivo da issue, se a equipe quiser deixar só pendências.
- registrar em `docs/PROJECT_STATUS.md`.
- atualizar `docs/github-issues/README.md`.
- atualizar `docs/github-issues/PRIORITY.md`.

## Script De Criação De Issues

Criar `docs/github-issues/create-issues.sh` inspirado no frontend.

O script deve:

- garantir labels
- criar issues via GitHub CLI
- usar `--body-file`
- apontar apenas para arquivos existentes

Labels recomendadas:

```txt
bug
feature
tech-debt
testing
ci
documentation
security
database
api
priority-high
priority-medium
priority-low
```

## Padrão Da Pasta `.codex`

Criar:

```txt
.codex/project.md
```

Esse arquivo deve ser atualizado conforme o backend evoluir.

Conteúdo inicial recomendado:

```md
# Dogs API - Codex Notes

## Projeto

- Backend separado do frontend `react-dogs`.
- Stack: Node.js, TypeScript, NestJS, Prisma, Supabase Postgres, Supabase Storage.
- API REST versionada em `/v1`.
- Swagger em `/docs`.

## Comandos

- `yarn dev`
- `yarn validate`
- `yarn test`
- `yarn build`
- `yarn prisma:migrate:dev`

## Preferências De Trabalho

- Conversar em português.
- Fazer mudanças pequenas e verificáveis.
- Rodar `yarn validate` antes de finalizar tarefas.
- Atualizar docs quando mudar setup, scripts, arquitetura, envs ou contrato.
- Não versionar secrets.

## Backlog

- Issues ficam em `docs/github-issues`.
- Ordem fica em `docs/github-issues/PRIORITY.md`.
- Status consolidado fica em `docs/PROJECT_STATUS.md`.
```

## Primeiras Issues Sugeridas Para O Backend

Ordem inicial sugerida:

1. Bootstrap NestJS com TypeScript e Yarn.
2. Configurar ESLint, Prettier, Husky e lint-staged.
3. Configurar GitHub Actions com `yarn validate`.
4. Configurar Prisma e Supabase.
5. Criar health check e Swagger.
6. Criar módulo de configuração/env validation.
7. Criar Auth com register/login/me/refresh/logout.
8. Criar Users/me.
9. Criar Breeds com seed.
10. Criar Dogs e DogMembership.
11. Criar convites de tutores.
12. Criar Posts e Media.
13. Criar feed público com filtros.
14. Criar password reset.
15. Criar analytics/stats base.
16. Criar deploy dev.
17. Criar deploy prod.
18. Criar collection HTTP para Postman, Insomnia ou Bruno.

## Prompt Para O Codex Do Backend

Use este prompt na primeira conversa do novo repositório:

```txt
Vamos iniciar o backend Dogs API do zero neste repositório.

Leia primeiro:
- docs/PRODUCT_AND_API_SPEC.md
- docs/BACKEND_API_PLAN.md
- docs/CODEX_BACKEND_HANDOFF.md

Quero criar uma API pública de portfólio usando Node.js, TypeScript, NestJS, Prisma, Supabase PostgreSQL, Supabase Storage e Swagger/OpenAPI.

O frontend `react-dogs` já usa branch flow feature/* -> develop -> main, Husky, lint-staged, yarn validate, GitHub Actions, docs em docs/ e backlog local em docs/github-issues. Quero que este backend siga o mesmo padrão adaptado para API.

Antes de implementar, faça:
1. leia os documentos;
2. proponha o scaffold inicial;
3. crie a estrutura de documentação;
4. crie as primeiras issues locais em docs/github-issues;
5. inclua uma decisão pendente sobre collection HTTP para Postman, Insomnia ou Bruno;
6. só depois comece a implementação da primeira issue.

Use português comigo, mantenha mudanças pequenas e rode validações ao final.
```
