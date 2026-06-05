# Dogs API - Codex Notes

## Projeto

- Backend separado do frontend `react-dogs`.
- Stack planejada: Node.js, TypeScript, NestJS, Prisma, Supabase Postgres, Supabase Storage.
- API REST versionada em `/v1`.
- Swagger em `/docs` e OpenAPI JSON em `/docs-json`.
- Health check em `/health`.

## Comandos

- `yarn dev`
- `yarn validate`
- `yarn test`
- `yarn build`
- `yarn lint`
- `yarn format:check`
- `yarn typecheck`
- `yarn prisma:migrate:dev` quando Prisma existir

## Preferências De Trabalho

- Conversar em português.
- Fazer mudanças pequenas e verificáveis.
- Rodar validações antes de finalizar tarefas quando os scripts existirem.
- Atualizar docs quando mudar setup, scripts, arquitetura, envs ou contrato.
- Não versionar secrets.

## Backlog

- Issues ficam em `docs/github-issues`.
- Ordem fica em `docs/github-issues/PRIORITY.md`.
- Status consolidado fica em `docs/PROJECT_STATUS.md`.
- Decisões pendentes ficam em `docs/PENDING_DECISIONS.md`.

## Docs

- Setup local: `docs/DEVELOPMENT.md`.
- Arquitetura: `docs/ARCHITECTURE.md`.
- Ambientes: `docs/ENVIRONMENTS.md`.
- Segurança: `docs/SECURITY.md`.
- Deploy planejado: `docs/DEPLOYMENT.md`.
