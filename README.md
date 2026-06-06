# Dogs API

Backend próprio do Dogs, criado para substituir gradualmente a API pública usada pelo frontend `react-dogs`.

## Stack Inicial

- Node.js
- TypeScript
- NestJS
- Yarn

## Requisitos

- Node.js 18+
- Yarn 1.x

## Setup Local

Instale as dependências:

```sh
yarn install
```

Suba a API em modo desenvolvimento:

```sh
yarn dev
```

Por padrão a aplicação sobe em:

```txt
http://localhost:3333
```

Endpoints de infraestrutura:

```txt
GET /health
GET /docs
GET /docs-json
```

Endpoints iniciais autenticados:

```txt
GET   /v1/auth/me
POST  /v1/auth/sync
GET   /v1/users/me
PATCH /v1/users/me
```

Endpoints públicos de domínio:

```txt
GET /v1/breeds
GET /v1/breeds/:slug
```

Os endpoints autenticados usam Supabase Auth. O frontend autentica no Supabase e envia o token para a Dogs API:

```txt
Authorization: Bearer <supabase_access_token>
```

## Scripts

```sh
yarn dev
yarn build
yarn start
```

## Documentação

- `docs/DOGS_API_SPEC.md`
- `docs/BACKEND_API_PLAN.md`
- `docs/CODEX_BACKEND_HANDOFF.md`
- `docs/INITIAL_SCAFFOLD_PLAN.md`
- `docs/DEVELOPMENT.md`
- `docs/ARCHITECTURE.md`
- `docs/ENVIRONMENTS.md`
- `docs/SECURITY.md`
- `docs/DEPLOYMENT.md`
- `docs/PRISMA_GUIDE.md`
- `docs/API_CONTRACT.md`
- `docs/AUTH_STRATEGY.md`
- `docs/http/README.md`
