# Configurar GitHub Actions

## Contexto

O backend deve ter validação automática em pull requests.

## Objetivo

Criar workflow de CI com `yarn validate` e validação de branch para produção.

## Escopo

- Criar `.github/workflows/ci.yml`.
- Rodar install, lint, format check, typecheck, test e build.
- Adicionar validação de Prisma quando Prisma existir.
- Bloquear PR para `main` vindo de branch diferente de `develop`.

## Fora De Escopo

- Deploy dev.
- Deploy prod.
- Rulesets do GitHub, que devem ser configurados no painel.

## Critérios De Aceite

- CI roda em PR para `develop` e `main`.
- PR para `main` falha se origem não for `develop`.
- Workflow não exige secrets para validação básica.
