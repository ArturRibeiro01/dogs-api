# Project Status

Status inicial do backend `dogs-api`.

## Fase Atual

Qualidade local configurada.

## Já Definido

- Backend será separado do frontend `react-dogs`.
- API será REST e versionada em `/v1`.
- Stack recomendada: Node.js, TypeScript, NestJS, Prisma, Supabase PostgreSQL, Supabase Storage e Swagger.
- Ambientes iniciais: `local`, `dev`, `prod`.
- Branch flow: `feature/* -> develop -> main`.
- Domínio principal: `User -> DogMembership -> Dog -> Post`.

## Próximo Marco

Concluir documentação complementar e CI com:

- docs de desenvolvimento, arquitetura, ambientes, segurança e deploy;
- `.codex/project.md` revisado;
- GitHub Actions rodando `yarn validate`.

## Concluído

- `01-bootstrap-nestjs-api`: scaffold NestJS inicial com TypeScript e Yarn.
- Estrutura inicial de `src/`, `test/`, `nest-cli.json` e configs TypeScript.
- Scripts básicos: `yarn dev`, `yarn build` e `yarn start`.
- README atualizado com setup local mínimo.
- `02-quality-tooling`: ESLint, Prettier, Jest, Husky, lint-staged e `yarn validate`.
- Teste mínimo de compilação do `AppModule`.

## Pendências Relevantes

Ver `docs/PENDING_DECISIONS.md`.
