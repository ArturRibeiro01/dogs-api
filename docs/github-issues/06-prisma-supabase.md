# Configurar Prisma E Supabase

## Contexto

O banco principal será PostgreSQL via Supabase, acessado pela API com Prisma.

## Objetivo

Configurar Prisma, schema inicial e conexão Supabase.

## Escopo

- Criar `prisma/schema.prisma`.
- Configurar Prisma Client.
- Criar service/module de database.
- Modelar entidades iniciais da spec.
- Criar seed inicial de raças.
- Adicionar scripts Prisma.

## Fora De Escopo

- Endpoints de domínio.
- Upload no Supabase Storage.
- Migrations de produção.

## Critérios De Aceite

- `yarn prisma:generate` funciona.
- `yarn prisma:validate` funciona.
- Schema representa entidades principais da spec.
- Seed usa apenas dados fake/públicos.
