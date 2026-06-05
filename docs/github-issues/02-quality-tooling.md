# Configurar Qualidade Local

## Contexto

O backend deve manter padrão parecido com o frontend: ESLint, Prettier, Husky, lint-staged e comando único de validação.

## Objetivo

Configurar ferramentas de qualidade e scripts de validação.

## Escopo

- Configurar ESLint.
- Configurar Prettier.
- Configurar Husky.
- Configurar lint-staged.
- Criar scripts `lint`, `format:check`, `typecheck`, `test`, `build` e `validate`.
- Configurar pre-commit com lint-staged, typecheck e test.

## Fora De Escopo

- CI.
- Testes e2e completos.
- Regras específicas de domínio.

## Critérios De Aceite

- `yarn validate` executa lint, format check, typecheck, testes e build.
- Pre-commit roda validações rápidas.
- Arquivos formatáveis entram no lint-staged.
