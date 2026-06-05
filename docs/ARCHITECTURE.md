# Architecture

Visão arquitetural planejada para o backend `dogs-api`.

## Objetivo

Criar uma API REST própria para o Dogs, separada do frontend `react-dogs`, com domínio centrado em cachorros, tutores e posts.

Domínio principal:

```txt
User -> DogMembership -> Dog -> Post
```

Regra central:

```txt
O perfil social principal é do cachorro, mas a gestão pertence a um ou mais tutores.
```

## Stack

- Node.js
- TypeScript
- NestJS
- Prisma ORM
- PostgreSQL via Supabase
- Supabase Storage
- JWT com refresh token
- Swagger/OpenAPI

## Estrutura De Pastas

Estrutura planejada:

```txt
src/
  app.module.ts
  main.ts
  config/
  database/
  common/
    decorators/
    filters/
    guards/
    interceptors/
    pipes/
  modules/
    health/
    auth/
    users/
    breeds/
    dogs/
    posts/
    media/
    favorites/
    contact-interests/
    analytics/
```

## Responsabilidades

Controllers:

- expõem contrato HTTP;
- recebem DTOs;
- delegam regra de negócio para services.

Services:

- concentram regras de domínio;
- coordenam permissões;
- chamam repositórios/providers quando existirem.

Database:

- encapsula Prisma Client;
- concentra integração com PostgreSQL.
- expõe `PrismaService` por `DatabaseModule`.

Common:

- guarda filtros, guards, decorators, interceptors e pipes compartilhados.

Config:

- lê variáveis de ambiente;
- valida configuração no boot;
- fornece configuração tipada para módulos.

## Contrato REST

Prefixo da API:

```txt
/v1
```

Endpoints planejados de infraestrutura:

```txt
GET /health
GET /docs
GET /docs-json
```

Resposta de item:

```json
{
  "data": {}
}
```

Resposta de lista:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "perPage": 12,
    "total": 100,
    "totalPages": 9
  }
}
```

Erro:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Revise os campos informados.",
    "details": []
  }
}
```

Detalhes do contrato ficam em:

```txt
docs/API_CONTRACT.md
```

## Módulos Planejados

- `health`: status operacional.
- `auth`: register, login, refresh, logout e usuário autenticado.
- `users`: perfil de tutor.
- `breeds`: catálogo de raças.
- `dogs`: perfis de cachorro e memberships.
- `posts`: publicações no feed.
- `media`: upload e metadados de arquivos.
- `favorites`: cachorros favoritados.
- `contact-interests`: interesse de contato.
- `analytics`: eventos e estatísticas.

## Fora Do Scaffold Atual

- Autenticação ainda não foi implementada.

## Prisma

Guia conceitual:

```txt
docs/PRISMA_GUIDE.md
```

O schema inicial está em:

```txt
prisma/schema.prisma
```

O seed inicial está em:

```txt
prisma/seed.ts
```

O `DatabaseModule` existe, mas ainda não é importado pelo `AppModule` para evitar conexão obrigatória com banco antes dos endpoints de domínio existirem.
