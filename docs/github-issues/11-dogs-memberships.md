# Dogs E Memberships

## Contexto

O domínio central do produto é o perfil social do cachorro gerenciado por um ou mais tutores.

## Objetivo

Implementar criação, edição, listagem e permissões iniciais de cachorros.

## Escopo

- `POST /v1/dogs`.
- `GET /v1/dogs`.
- `GET /v1/dogs/:slug`.
- `PATCH /v1/dogs/:dogId`.
- `DELETE /v1/dogs/:dogId`.
- `GET /v1/dogs/:dogId/members`.
- Criar membership `owner` ao criar cachorro.
- Bloquear remoção do último owner.
- Filtros por raça, cidade, estado e interesse.

## Fora De Escopo

- Convites por email.
- Posts.
- Upload de avatar.

## Critérios De Aceite

- Cachorro criado tem tutor owner ativo.
- Somente tutor autorizado edita perfil.
- Cachorro não pode ficar sem owner.
- Listagem pública respeita `isPublic`.
