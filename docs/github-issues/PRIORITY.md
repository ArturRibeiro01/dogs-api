# Prioridade Das Issues

## P0: Base Do Projeto

1. `01-bootstrap-nestjs-api.md`
2. `02-quality-tooling.md`
3. `03-docs-and-codex-notes.md`
4. `04-ci-validate.md`

## P1: Infra De API

5. `05-config-env-validation.md`
6. `06-prisma-supabase.md`
7. `07-health-swagger.md`
8. `08-error-response-contract.md`

## P2: Primeiro Domínio

9. `09-auth-users.md`
10. `10-breeds-seed.md`
11. `11-dogs-memberships.md`
12. `12-posts-media-feed.md`

## P3: Apoio Ao Desenvolvimento

13. `13-http-collection.md`

## Dependências

- `02-quality-tooling.md` depende de `01-bootstrap-nestjs-api.md`.
- `04-ci-validate.md` depende de `02-quality-tooling.md`.
- `06-prisma-supabase.md` depende de `05-config-env-validation.md`.
- `09-auth-users.md` depende de `06-prisma-supabase.md` e `08-error-response-contract.md`.
- `11-dogs-memberships.md` depende de `09-auth-users.md` e `10-breeds-seed.md`.
- `12-posts-media-feed.md` depende de `11-dogs-memberships.md`.
- `13-http-collection.md` pode começar após `07-health-swagger.md`, mas ganha valor real depois de `09-auth-users.md`.
