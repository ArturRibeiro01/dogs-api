# Breeds E Seed Inicial

## Contexto

Raças são necessárias para cadastro e descoberta de cachorros.

## Objetivo

Criar endpoints de raças e seed inicial.

## Escopo

- Modelar `Breed`.
- Criar seed com lista inicial.
- `GET /v1/breeds`.
- `GET /v1/breeds/:slug`.
- Garantir slug único.

## Fora De Escopo

- Catálogo completo de todas as raças.
- Administração de raças por painel.

## Critérios De Aceite

- Seed cria raças iniciais de forma idempotente.
- Listagem retorna raças ordenadas.
- Busca por slug retorna 404 padronizado quando não existir.
