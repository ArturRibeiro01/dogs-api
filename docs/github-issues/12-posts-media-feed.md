# Posts, Media E Feed

## Contexto

Posts representam as publicações no feed do cachorro.

## Objetivo

Implementar posts com imagem e feed público filtrável.

## Escopo

- `POST /v1/posts`.
- `GET /v1/posts`.
- `GET /v1/posts/:postId`.
- `PATCH /v1/posts/:postId`.
- `DELETE /v1/posts/:postId`.
- `POST /v1/media` multipart para MVP.
- Upload de imagens no Supabase Storage.
- Filtros por cachorro, raça, cidade e estado.

## Fora De Escopo

- URL assinada para upload direto.
- Vídeos.
- Likes.
- Comentários.

## Critérios De Aceite

- Apenas tutor ativo pode publicar pelo cachorro.
- Upload valida MIME type, extensão e tamanho.
- Remoção de post usa soft delete.
- Feed retorna paginação padronizada.
