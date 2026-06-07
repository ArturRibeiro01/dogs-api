# Frontend Integration Handoff

Este documento orienta a integração do frontend `react-dogs` com a `dogs-api`.

## Estado Do Backend

A Dogs API já possui:

- Supabase Auth como provedor de identidade.
- Perfil local `User` sincronizado pela API.
- Catálogo de raças.
- CRUD inicial de cachorros com memberships.
- Posts/feed público.
- Upload multipart de imagem para Supabase Storage.
- Swagger em `/docs`.
- OpenAPI JSON em `/docs-json`.
- Collection Insomnia em `docs/http/dogs-api.insomnia.json`.

## Base URL

Local:

```txt
http://localhost:3333
```

Dev/prod ainda devem ser configurados quando houver deploy.

## Autenticação

O frontend deve autenticar diretamente com Supabase Auth.

Fluxo:

```txt
Frontend -> Supabase Auth
Supabase retorna session/access_token
Frontend -> Dogs API com Authorization: Bearer <access_token>
Dogs API valida token no Supabase
Dogs API cria/sincroniza perfil local
```

Header para endpoints autenticados:

```txt
Authorization: Bearer <supabase_access_token>
```

O frontend não deve chamar endpoints de login/senha na Dogs API. Cadastro, login, logout, refresh, recuperação de senha e OAuth ficam no Supabase.

## Endpoints De Auth/User

```txt
GET   /v1/auth/me
POST  /v1/auth/sync
GET   /v1/users/me
PATCH /v1/users/me
```

Uso recomendado:

1. Depois do login Supabase, chamar `POST /v1/auth/sync` ou `GET /v1/auth/me`.
2. Guardar o perfil local retornado pela Dogs API no estado do app.
3. Usar `PATCH /v1/users/me` para edição do perfil do tutor.

## Breeds

Públicos:

```txt
GET /v1/breeds
GET /v1/breeds/:slug
```

Uso no frontend:

- Carregar raças para selects/filtros.
- Usar `breed.id` ao criar cachorro.
- Usar `breed.slug` em filtros públicos.

## Dogs

Públicos:

```txt
GET /v1/dogs
GET /v1/dogs/:slug
```

Autenticados:

```txt
POST   /v1/dogs
PATCH  /v1/dogs/:dogId
DELETE /v1/dogs/:dogId
GET    /v1/dogs/:dogId/members
```

Regras importantes:

- Ao criar cachorro, a API cria membership `owner` para o usuário autenticado.
- Apenas `owner` ou `editor` edita.
- Apenas `owner` remove.
- Listagem pública mostra apenas `isPublic=true`.

Filtros em `GET /v1/dogs`:

```txt
breed
city
state
interest
page
perPage
```

## Posts E Feed

Públicos:

```txt
GET /v1/posts
GET /v1/posts/:postId
```

Autenticados:

```txt
POST   /v1/posts
PATCH  /v1/posts/:postId
DELETE /v1/posts/:postId
```

Regras importantes:

- Apenas tutor ativo do cachorro pode publicar.
- `DELETE` usa soft delete.
- Feed retorna apenas posts públicos, publicados e não deletados.

Filtros em `GET /v1/posts`:

```txt
dog
breed
city
state
page
perPage
```

## Media Upload

Autenticado:

```txt
POST /v1/media
```

Multipart form-data:

```txt
postId=<id do post>
file=<imagem>
```

Validações atuais:

- arquivo obrigatório;
- MIME permitido: `image/jpeg`, `image/png`, `image/webp`;
- tamanho máximo: `5 MB`;
- usuário precisa ser `owner` ou `editor` do cachorro do post.

Resposta cria um registro `Media` e retorna URL pública do Supabase Storage.

## Contrato De Resposta

Item:

```json
{
  "data": {}
}
```

Lista:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "perPage": 12,
    "total": 0,
    "totalPages": 1
  }
}
```

Erro:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token de autenticação ausente.",
    "details": []
  }
}
```

## Ordem Recomendada Para Migrar O Frontend

1. Instalar/configurar Supabase client no frontend.
2. Implementar login/logout/session listener com Supabase Auth.
3. Criar client HTTP da Dogs API com `Authorization: Bearer <token>`.
4. Trocar fluxo de `user` por `GET /v1/users/me` e `PATCH /v1/users/me`.
5. Trocar catálogo de raças por `GET /v1/breeds`.
6. Migrar criação/listagem de cachorros para `/v1/dogs`.
7. Migrar feed para `/v1/posts`.
8. Migrar criação de post:
   - criar post com `POST /v1/posts`;
   - subir imagem com `POST /v1/media`.
9. Remover chamadas da API antiga quando os fluxos estiverem estáveis.

## Variáveis Esperadas No Frontend

Sugestão:

```txt
VITE_DOGS_API_URL=http://localhost:3333
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

Nunca expor service role key no frontend.

## Observações Para O Codex No Front

- Preferir adaptar chamadas existentes gradualmente em vez de reescrever telas inteiras.
- Manter a API antiga apenas como fallback temporário se necessário.
- Mapear cuidadosamente diferenças de contrato entre API antiga e Dogs API.
- Para upload, usar `FormData`.
- Para requests autenticados, buscar token da sessão atual do Supabase antes da chamada.
