# Dogs API Spec

Este documento descreve o backend próprio do Dogs, pensado para ser criado em outro repositório e evoluir junto com o frontend `react-dogs`.

Repositório sugerido:

```txt
dogs-api
```

Frontend consumidor:

```txt
react-dogs
```

## Contexto Do Produto

Dogs é uma rede social para tutores exibirem seus cachorros, descobrirem outros cachorros por raça, localização e interesses, e manterem perfis compartilhados quando mais de uma pessoa cuida do mesmo pet.

A regra central do produto é:

```txt
O perfil social principal é do cachorro, mas a gestão pertence a um ou mais tutores.
```

Isso significa que o domínio não deve ser modelado como `User -> Photos`, e sim como:

```txt
User -> DogMembership -> Dog -> Post
```

## Objetivos Da API

- Substituir gradualmente a API pública da Origamid.
- Dar ao Dogs um domínio próprio, centrado em tutores, cachorros e posts.
- Permitir que um cachorro tenha mais de um tutor.
- Preparar descoberta por raça e interesses.
- Preparar estatísticas no backend sem exigir tela avançada no frontend agora.
- Publicar Swagger/OpenAPI para avaliadores e integração.
- Ter ambientes isolados para desenvolvimento, homologação e produção.
- Manter o repositório público sem expor segredos.

## Stack Recomendada

Recomendação principal:

- Node.js
- TypeScript
- NestJS
- Prisma ORM
- PostgreSQL via Supabase
- Supabase Storage
- Supabase Auth
- Swagger/OpenAPI com `@nestjs/swagger`
- Zod ou class-validator para validação
- Docker Compose para desenvolvimento local, quando não usar Supabase local
- GitHub Actions para CI/CD

Por que essa stack:

- O time já conhece um pouco de Node.js.
- NestJS deixa o backend com arquitetura clara para portfólio: módulos, controllers, services, guards, pipes e providers.
- Swagger é bem suportado no ecossistema NestJS.
- Prisma acelera modelagem relacional, migrations e consultas tipadas.
- Supabase atende a preferência do projeto e entrega PostgreSQL, storage, Auth, painel e gestão de ambientes.
- O repositório pode ser público porque segredos ficam em variáveis de ambiente e nunca no código.

Alternativas consideradas:

- Fastify puro: mais leve, mas exige desenhar mais arquitetura manualmente.
- Firebase: bom para realtime e velocidade, mas menos adequado se queremos mostrar modelagem relacional e API REST documentada.
- Supabase sem API própria: rápido, mas menos forte como backend de portfólio e espalha regras de domínio no cliente ou em policies.

## Decisão Sobre Supabase

Usar Supabase como infraestrutura, não como substituto completo da API.

Responsabilidades do Supabase:

- PostgreSQL gerenciado.
- Storage de imagens.
- Supabase Auth para identidade, sessões, email/senha e social login.
- Ambientes de banco separados.
- Backups e painel operacional.

Responsabilidades da Dogs API:

- Validação do token Supabase recebido pelo frontend.
- Sincronização do perfil local do tutor.
- Regras de domínio.
- Permissões de tutores em perfis de cachorro.
- Upload orquestrado.
- Endpoints REST públicos e privados.
- Swagger/OpenAPI.
- Validações e mensagens de erro.
- Estatísticas e eventos.

## Público-Alvo

Usuários principais:

- Donos de pets que querem exibir seus cachorros.
- Tutores que querem encontrar cachorros da mesma raça.
- Pessoas que querem descobrir outros tutores para contato, passeios, comunidade ou eventual reprodução/cruzamento.

Tom do produto:

- Comunidade de tutores e perfis de cachorro.
- Descoberta por raça e localização.
- Interesses declarados pelo tutor, sem transformar o app apenas em cruzamento.

## Jornada Principal

### Visitante

1. Acessa o app.
2. Vê feed público de cachorros/posts.
3. Filtra ou busca por raça.
4. Abre perfil público de um cachorro.
5. É convidado a criar conta para postar, favoritar ou demonstrar interesse.

### Novo Tutor

1. Cria uma conta.
2. Confirma login.
3. É direcionado para cadastrar o primeiro cachorro.
4. Cria o perfil do cachorro.
5. Publica a primeira foto.
6. Passa a ver o feed principal.

### Tutor Logado

1. Entra no app.
2. Cai no feed principal, não em "Minha conta".
3. Pode navegar para seus cachorros.
4. Pode postar uma foto escolhendo o cachorro.
5. Pode editar perfis dos cachorros nos quais possui permissão.
6. Pode convidar outro tutor para gerenciar um cachorro.

### Cachorro Com Mais De Um Tutor

1. Um tutor cria o perfil do cachorro.
2. Esse tutor vira `owner`.
3. Ele convida outro usuário por email ou username.
4. O convidado aceita.
5. O convidado vira `owner` ou `editor`.
6. Ambos podem postar fotos no perfil do cachorro, respeitando permissões.

## Permissões De Tutor

Roles iniciais:

```txt
owner
editor
```

Possível role futura:

```txt
viewer
```

Permissões sugeridas:

| Ação                              | owner | editor  |
| --------------------------------- | ----- | ------- |
| Ver dashboard do cachorro         | sim   | sim     |
| Editar dados do cachorro          | sim   | parcial |
| Postar foto                       | sim   | sim     |
| Remover o próprio post            | sim   | sim     |
| Remover qualquer post do cachorro | sim   | não     |
| Convidar tutor                    | sim   | não     |
| Remover tutor                     | sim   | não     |
| Excluir perfil do cachorro        | sim   | não     |

Regras:

- Um cachorro deve ter pelo menos um `owner` ativo.
- Um usuário não pode remover o último `owner` de um cachorro.
- Convites devem expirar.
- Um convite aceito vira membership ativa.

## Entidades Principais

### User

Representa o perfil local de uma pessoa/tutor autenticada pelo Supabase Auth.

Campos:

- `id`
- `supabaseAuthId`
- `username`
- `name`
- `email`
- `avatarUrl`
- `bio`
- `city`
- `state`
- `createdAt`
- `updatedAt`

Regras:

- `supabaseAuthId` único.
- `username` único.
- `email` único.
- senha e provedores sociais são gerenciados pelo Supabase Auth, não pela Dogs API.
- conta pode existir sem cachorro, mas o onboarding deve sugerir cadastro do primeiro pet.

### Dog

Representa o perfil social de um cachorro.

Campos:

- `id`
- `slug`
- `name`
- `breedId`
- `birthDate`
- `sex`
- `size`
- `weight`
- `bio`
- `avatarUrl`
- `city`
- `state`
- `interests`
- `isPublic`
- `createdAt`
- `updatedAt`

Valores possíveis para `sex`:

```txt
male
female
unknown
```

Valores possíveis para `interests`:

```txt
friendship
walks
community
breeding
```

Regras:

- `slug` único para URLs públicas.
- `breedId` deve apontar para uma raça válida.
- localização pode herdar do tutor, mas deve poder ser ajustada por cachorro.

### DogMembership

Relaciona usuários e cachorros.

Campos:

- `id`
- `dogId`
- `userId`
- `role`
- `status`
- `invitedByUserId`
- `createdAt`
- `updatedAt`

Valores de `role`:

```txt
owner
editor
```

Valores de `status`:

```txt
active
pending
removed
```

Regras:

- `dogId + userId` deve ser único para memberships ativas ou pendentes.
- Somente `owner` pode convidar/remover tutores.
- Um cachorro não pode ficar sem `owner`.

### DogInvite

Representa convite para outro tutor gerenciar um cachorro.

Campos:

- `id`
- `dogId`
- `email`
- `role`
- `tokenHash`
- `expiresAt`
- `acceptedAt`
- `createdByUserId`
- `createdAt`

Regras:

- token deve ser salvo como hash.
- convite expirado não pode ser aceito.
- convite aceito cria ou ativa `DogMembership`.

### Breed

Representa raça de cachorro.

Campos:

- `id`
- `name`
- `slug`
- `createdAt`
- `updatedAt`

Regras:

- `slug` único.
- lista pode começar manual e depois evoluir para catálogo mais completo.

### Post

Representa uma publicação no feed, geralmente uma foto com legenda.

Campos:

- `id`
- `dogId`
- `authorUserId`
- `caption`
- `visibility`
- `publishedAt`
- `createdAt`
- `updatedAt`
- `deletedAt`

Valores de `visibility`:

```txt
public
private
unlisted
```

Regras:

- post pertence a um cachorro.
- autor deve ser tutor ativo do cachorro no momento da publicação.
- remoção deve ser soft delete no MVP.

### Media

Representa arquivo enviado.

Campos:

- `id`
- `postId`
- `dogId`
- `uploadedByUserId`
- `storageBucket`
- `storageKey`
- `url`
- `mimeType`
- `size`
- `width`
- `height`
- `createdAt`

Regras:

- aceitar inicialmente apenas imagens.
- validar tamanho máximo.
- armazenar no Supabase Storage.
- banco guarda URL pública ou URL assinada, conforme decisão de privacidade.

### PostLike

Preparado para interação social mínima.

Campos:

- `id`
- `postId`
- `userId`
- `createdAt`

Regras:

- `postId + userId` único.
- pode ficar fora do frontend na primeira etapa.

### DogFavorite

Permite usuário favoritar ou acompanhar cachorro.

Campos:

- `id`
- `dogId`
- `userId`
- `createdAt`

Regras:

- `dogId + userId` único.
- pode entrar antes de chat/mensagens.

### ContactInterest

Representa interesse de contato sem implementar chat completo.

Campos:

- `id`
- `dogId`
- `fromUserId`
- `message`
- `status`
- `createdAt`
- `updatedAt`

Valores de `status`:

```txt
pending
accepted
rejected
cancelled
```

Regras:

- deve evitar spam com rate limit.
- pode notificar por email no futuro.

### AnalyticsEvent

Prepara estatísticas sem obrigar UI avançada agora.

Campos:

- `id`
- `eventType`
- `userId`
- `dogId`
- `postId`
- `metadata`
- `createdAt`

Eventos iniciais:

```txt
post_view
dog_profile_view
post_created
dog_created
```

Regras:

- eventos podem ser agregados depois em tabelas de estatísticas.
- não bloquear fluxo principal se gravação de analytics falhar.

### Auth Supabase

A Dogs API não salva senha, refresh token ou tokens de recuperação.

Responsabilidades do Supabase Auth:

- credenciais por email e senha;
- social login, incluindo Google, Apple e Azure (Microsoft);
- recuperação de senha;
- emissão e renovação de sessão;
- armazenamento de identidades no schema interno `auth`.

Responsabilidades da Dogs API:

- validar access token Supabase;
- extrair o `sub` do token como identificador do usuário Supabase;
- associar esse identificador a `User.supabaseAuthId`;
- aplicar permissões e regras de domínio.

## Endpoints REST

Prefixo recomendado:

```txt
/v1
```

Health:

```txt
GET /health
```

Swagger:

```txt
GET /docs
GET /docs-json
```

### Auth

```txt
GET  /v1/auth/me
POST /v1/auth/sync
```

Observação:

- register, login, refresh, logout e password reset acontecem no frontend com Supabase Auth.
- `POST /v1/auth/sync` cria ou atualiza o perfil local `User` após autenticação no Supabase.

### Users

```txt
GET   /v1/users/me
PATCH /v1/users/me
GET   /v1/users/:username
```

### Dogs

```txt
POST   /v1/dogs
GET    /v1/dogs
GET    /v1/dogs/:slug
PATCH  /v1/dogs/:dogId
DELETE /v1/dogs/:dogId
GET    /v1/dogs/:dogId/members
POST   /v1/dogs/:dogId/invites
POST   /v1/dogs/invites/:token/accept
DELETE /v1/dogs/:dogId/members/:userId
```

Filtros para `GET /v1/dogs`:

```txt
breed
city
state
interest
page
perPage
```

### Breeds

```txt
GET /v1/breeds
GET /v1/breeds/:slug
```

### Posts

```txt
POST   /v1/posts
GET    /v1/posts
GET    /v1/posts/:postId
PATCH  /v1/posts/:postId
DELETE /v1/posts/:postId
POST   /v1/posts/:postId/like
DELETE /v1/posts/:postId/like
```

Filtros para `GET /v1/posts`:

```txt
dogId
dogSlug
breed
city
state
page
perPage
```

### Media

Opção simples para MVP:

```txt
POST /v1/media
```

Opção mais escalável:

```txt
POST /v1/media/upload-url
POST /v1/media/complete
```

Recomendação:

- MVP pode começar com upload multipart para a API.
- Depois evoluir para URL assinada do Supabase Storage.

### Favorites

```txt
POST   /v1/dogs/:dogId/favorite
DELETE /v1/dogs/:dogId/favorite
GET    /v1/users/me/favorites
```

### Contact Interest

```txt
POST /v1/dogs/:dogId/contact-interests
GET  /v1/users/me/contact-interests
POST /v1/contact-interests/:id/accept
POST /v1/contact-interests/:id/reject
```

Pode ficar fora da primeira entrega se o foco for feed, perfis e posts.

### Stats

Preparar backend:

```txt
GET /v1/dogs/:dogId/stats
GET /v1/users/me/stats
POST /v1/events
```

O frontend não precisa priorizar telas de estatísticas agora.

## Compatibilidade Com O Frontend Atual

O frontend atual usa a API antiga por `src/api.ts`.

Rotas antigas relevantes:

```txt
POST /jwt-auth/v1/token
POST /jwt-auth/v1/token/validate
GET  /api/user
POST /api/user
POST /api/password/lost
POST /api/password/reset
GET  /api/photo/?_page=1&_total=6&_user=0
POST /api/photo
GET  /api/photo/:id
GET  /api/stats
```

Estratégia recomendada:

1. Criar a API nova em `/v1`.
2. Manter o frontend atual usando modo demo enquanto as novas telas não existem.
3. Refatorar o frontend para o domínio novo: `users`, `dogs`, `posts`.
4. Evitar criar camada de compatibilidade antiga, exceto se for necessário para migração temporária.

Motivo:

- O produto mudou de fotos por usuário para posts por cachorro.
- Uma camada antiga preservaria conceitos errados no backend novo.

## Formatos De Resposta

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

Resposta de item:

```json
{
  "data": {}
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

Regras:

- `message` deve ser segura para exibir no frontend.
- `code` deve ser estável para tratamento programático.
- logs internos podem ter detalhes técnicos, mas a resposta pública não.

## Autenticação E Segurança

Recomendação:

- Supabase Auth emite e renova tokens.
- Frontend autentica com Supabase Auth.
- Dogs API valida `Authorization: Bearer <supabase_access_token>`.
- Senhas e provedores sociais ficam fora da Dogs API.
- Rate limit em endpoints sensíveis da Dogs API, como upload e interesse de contato.
- CORS limitado aos domínios do frontend.
- Helmet/security headers.
- Validação de payload em todos os endpoints.
- Logs sem dados sensíveis.
- Upload com validação de MIME type, extensão e tamanho.

Variáveis sensíveis não entram no repositório.

Arquivos esperados:

```txt
.env.example
.env.local
```

`.env.local` deve ser ignorado pelo Git.

## Repositório Público

O repositório da API pode ser público desde que:

- nenhum `.env` real seja commitado.
- service role key do Supabase nunca apareça no código.
- connection strings reais fiquem apenas no provedor de deploy e GitHub Secrets.
- Swagger não exponha credenciais nem exemplos reais de tokens.
- seeds não usem dados pessoais reais.
- logs e mensagens de erro não revelem secrets.

Arquivos seguros para versionar:

- `.env.example`
- `README.md`
- `docs/`
- `prisma/schema.prisma`
- `prisma/migrations/`
- seeds com dados fake
- collection HTTP sem tokens reais

## Ambientes

Ambientes recomendados:

```txt
local
dev
hml
prod
```

Minha sugestão prática:

- `local`: desenvolvimento na máquina.
- `dev`: integração contínua da branch `develop`.
- `hml`: opcional no começo; útil quando quiser validar releases antes da produção.
- `prod`: branch `main`.

Para este projeto, eu criaria `dev` e `prod` desde o início. `hml` pode ser ativado quando houver usuários reais ou fluxo de release mais rígido.

Mapeamento de branches:

```txt
feature/* -> develop -> main
```

Deploy:

```txt
develop -> API dev
main    -> API prod
```

Se `hml` entrar:

```txt
release/* -> API hml
main      -> API prod
```

## Supabase Por Ambiente

Para ambientes persistentes, usar projetos separados:

```txt
dogs-dev
dogs-hml
dogs-prod
```

Alternativa:

- Supabase Branching para previews de PR e validação de migrations.

Recomendação:

- Projetos separados para `dev` e `prod`.
- Branching ou projeto separado para `hml`, dependendo do custo e da maturidade do fluxo.

## Variáveis De Ambiente Da API

Exemplo:

```txt
NODE_ENV=development
APP_ENV=local
PORT=3333
API_BASE_URL=http://localhost:3333
WEB_APP_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173

DATABASE_URL=
DIRECT_DATABASE_URL=

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_JWT_SECRET=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=dogs-media

MAIL_PROVIDER=console
MAIL_FROM=Dogs <no-reply@example.com>
MAIL_API_KEY=

SWAGGER_ENABLED=true
SWAGGER_BASIC_AUTH_USER=
SWAGGER_BASIC_AUTH_PASSWORD=
```

Observação sobre Prisma e Supabase:

- `DATABASE_URL` pode usar conexão pooled para runtime.
- `DIRECT_DATABASE_URL` deve usar conexão direta para migrations.

## CI/CD Da API

Checks em pull request:

- install
- lint
- format check
- typecheck
- test unitário
- test de integração, se houver banco disponível
- build
- validar Prisma schema

Deploy em `develop`:

- aplicar migrations no banco dev
- build
- deploy API dev
- publicar Swagger dev

Deploy em `main`:

- aplicar migrations no banco prod com cuidado
- build
- deploy API prod
- publicar Swagger prod

Regras de branch:

- ninguém commita direto em `develop`.
- ninguém commita direto em `main`.
- feature entra em `develop` por PR.
- produção recebe PR de `develop` para `main`.
- CI precisa passar antes do merge.

## Swagger/OpenAPI

Swagger deve ficar publicado.

Sugestão:

```txt
dev:  https://dogs-api-dev.example.com/docs
prod: https://dogs-api.example.com/docs
```

Em produção, há duas opções seguras:

1. Swagger público, sem dados sensíveis e com autenticação documentada.
2. Swagger protegido por basic auth.

Recomendação inicial:

- Swagger público no dev.
- Swagger público ou com basic auth em prod, dependendo do provedor e da exposição desejada no portfólio.

Para avaliadores, publicar Swagger é positivo, mas a API deve ter rate limit e endpoints protegidos corretamente.

## Testes

Camadas recomendadas:

- unitários para services e regras de permissão.
- integração para controllers com banco de teste.
- e2e para auth, dogs, posts e upload.
- testes de contrato para garantir formato das respostas.

Cenários críticos:

- criar usuário.
- validar token Supabase.
- sincronizar perfil local.
- criar cachorro.
- convidar tutor.
- aceitar convite.
- bloquear editor removendo owner.
- criar post como tutor ativo.
- bloquear post de usuário sem membership.
- filtrar feed por raça.
- bloquear acesso com token inválido.

## Módulos NestJS Sugeridos

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
    auth/
    users/
    dogs/
    breeds/
    posts/
    media/
    favorites/
    contact-interests/
    analytics/
    health/
```

## Modelo Prisma Inicial

O schema final deve ser refinado no backend, mas a base conceitual é:

```txt
User
Dog
DogMembership
DogInvite
Breed
Post
Media
PostLike
DogFavorite
ContactInterest
AnalyticsEvent
PasswordResetToken
RefreshToken
```

Observação: `PasswordResetToken` e `RefreshToken` pertenciam ao plano de JWT próprio. Com Supabase Auth, eles ficam fora do schema da Dogs API.

## Seed Inicial

Seeds úteis:

- raças populares.
- usuário demo.
- cachorro demo.
- posts demo.
- membership do usuário demo como owner.

Usuário demo em ambiente não produtivo deve ser criado via Supabase Auth quando necessário.

Em produção, usuário demo deve ser opcional, controlado por env e nunca conter credenciais reais versionadas.

## Integração Futura Com O Frontend

Mudanças esperadas no `react-dogs`:

- tela pós-login ir para feed principal.
- criar onboarding para primeiro cachorro.
- substituir conceito de foto por post.
- criar perfil público do cachorro.
- criar seleção de cachorro no upload.
- adicionar filtros de raça no feed.
- trocar `src/api.ts` para `/v1`.
- manter `VITE_DEMO_MODE=true` enquanto o backend estiver em construção.

## MVP Recomendado

Ordem de implementação:

1. Bootstrap do repositório `dogs-api`.
2. Configuração de NestJS, Prisma, Supabase e Swagger.
3. Health check.
4. Supabase Auth guard, sync de perfil e auth/me.
5. Users/me.
6. Breeds seed e listagem.
7. Dogs com membership owner.
8. Convite de tutor.
9. Posts com upload de imagem.
10. Feed público com filtros.
11. Fluxos de Auth no Supabase, se necessário.
12. Favorites ou contact interest.
13. Stats/analytics básico.
14. Collection HTTP para Postman, Insomnia ou Bruno.
15. Deploy dev.
16. Deploy prod.

## Fora Do MVP

- Chat em tempo real.
- Comentários.
- Notificações completas.
- Moderação avançada.
- Painel administrativo.
- Pagamentos.
- Recomendações por geolocalização precisa.

## Referências Oficiais

- Supabase Deployment & Branching: <https://supabase.com/docs/guides/deployment>
- Supabase Managing Environments: <https://supabase.com/docs/guides/cli/managing-environments>
- Supabase Postgres Connections: <https://supabase.com/docs/guides/database/connecting-to-postgres>
- NestJS OpenAPI: <https://docs.nestjs.com/openapi/introduction>
- Prisma Database Connections: <https://docs.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections>
