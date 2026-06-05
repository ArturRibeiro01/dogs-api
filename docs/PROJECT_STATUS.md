# Project Status

Status inicial do backend `dogs-api`.

## Fase Atual

Configuração de ambiente validada.

## Já Definido

- Backend será separado do frontend `react-dogs`.
- API será REST e versionada em `/v1`.
- Stack recomendada: Node.js, TypeScript, NestJS, Prisma, Supabase PostgreSQL, Supabase Storage e Swagger.
- Ambientes iniciais: `local`, `dev`, `prod`.
- Branch flow: `feature/* -> develop -> main`.
- Domínio principal: `User -> DogMembership -> Dog -> Post`.

## Próximo Marco

Concluir Prisma e Supabase com schema inicial, Prisma Client e seed de raças.

## Concluído

- `01-bootstrap-nestjs-api`: scaffold NestJS inicial com TypeScript e Yarn.
- Estrutura inicial de `src/`, `test/`, `nest-cli.json` e configs TypeScript.
- Scripts básicos: `yarn dev`, `yarn build` e `yarn start`.
- README atualizado com setup local mínimo.
- `02-quality-tooling`: ESLint, Prettier, Jest, Husky, lint-staged e `yarn validate`.
- Teste mínimo de compilação do `AppModule`.
- `03-docs-and-codex-notes`: docs de desenvolvimento, arquitetura, ambientes, segurança, deploy e notas do Codex.
- `04-ci-validate`: GitHub Actions com install, lint, format check, typecheck, test, build e bloqueio de PR para `main` fora de `develop`.
- `05-config-env-validation`: `.env.example`, módulo de configuração, validação de envs no boot e config tipada.

## Pendências Relevantes

Ver `docs/PENDING_DECISIONS.md`.
