# Development

Guia de desenvolvimento local do backend `dogs-api`.

## Requisitos

- Node.js 18+
- Yarn 1.x

## Instalação

```sh
yarn install
```

## Comandos

```sh
yarn dev
yarn build
yarn start
yarn lint
yarn lint:fix
yarn format
yarn format:check
yarn typecheck
yarn test
yarn test:watch
yarn prisma:generate
yarn prisma:validate
yarn prisma:migrate:dev
yarn prisma:seed
yarn validate
```

## Fluxo Local

Fluxo recomendado antes de abrir PR:

```sh
yarn validate
```

O comando executa:

- lint;
- format check;
- typecheck;
- testes;
- build.

## Pre-Commit

O Husky executa:

```sh
yarn lint-staged
yarn typecheck
yarn test
```

Arquivos staged passam por `lint-staged`:

- `*.ts` e `*.js`: ESLint com fix e Prettier;
- `*.json`, `*.md`, `*.yml` e `*.yaml`: Prettier.

## Servidor Local

Crie seu arquivo local de env a partir do exemplo:

```sh
cp .env.example .env.local
```

```sh
yarn dev
```

URL padrão:

```txt
http://localhost:3333
```

Observação: nesta fase inicial ainda não há endpoint público implementado. O health check será criado em issue própria.

## Branch Flow

```txt
feature/* -> develop -> main
```

- features entram em `develop` por pull request;
- `main` representa produção;
- PR para `main` deve vir de `develop`.

## CI

O workflow de CI roda em pull requests e pushes para:

```txt
develop
main
```

O check principal se chama:

```txt
Typecheck, test and build
```

Use esse nome ao configurar required status checks no GitHub.

## Secrets

Nunca versionar arquivos reais de ambiente:

```txt
.env
.env.local
.env.dev
.env.prod
```

Versionar apenas `.env.example`.

## Prisma

Guia conceitual:

```txt
docs/PRISMA_GUIDE.md
```

Valide o schema sem precisar de banco real:

```sh
yarn prisma:validate
```

Gere o Prisma Client:

```sh
yarn prisma:generate
```

Para criar migrations locais, configure `DATABASE_URL` e `DIRECT_DATABASE_URL` no seu `.env.local` e rode:

```sh
yarn prisma:migrate:dev
```

Para executar o seed inicial de raças, rode:

```sh
yarn prisma:seed
```
