# Project Status

Status inicial do backend `dogs-api`.

## Fase Atual

Contrato de respostas e erros configurado.

## Já Definido

- Backend será separado do frontend `react-dogs`.
- API será REST e versionada em `/v1`.
- Stack recomendada: Node.js, TypeScript, NestJS, Prisma, Supabase PostgreSQL, Supabase Storage e Swagger.
- Autenticação definida via Supabase Auth, com perfil local `User` na Dogs API.
- Ambientes iniciais: `local`, `dev`, `prod`.
- Branch flow: `feature/* -> develop -> main`.
- Domínio principal: `User -> DogMembership -> Dog -> Post`.

## Próximo Marco

Concluir autenticação e usuários.

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
- `06-prisma-supabase`: Prisma schema inicial, Prisma Client, DatabaseModule, PrismaService e seed de raças.
- `07-health-swagger`: `GET /health`, Swagger em `/docs` e OpenAPI JSON em `/docs-json`.
- `08-error-response-contract`: helpers de resposta, códigos de erro estáveis, `AppException` e filtro global de exceções.

## Pendências Relevantes

Ver `docs/PENDING_DECISIONS.md`.
