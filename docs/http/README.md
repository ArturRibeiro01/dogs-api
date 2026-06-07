# HTTP Collection

Collection inicial para testar a Dogs API no Insomnia.

Ferramenta escolhida para o projeto:

```txt
Insomnia
```

## Arquivo

```txt
docs/http/dogs-api.insomnia.json
```

## Importar No Insomnia

1. Abra o Insomnia.
2. Clique em `Create` ou `Import`.
3. Escolha `From File`.
4. Selecione `docs/http/dogs-api.insomnia.json`.
5. Selecione o ambiente `Local`.

## Variáveis

Configure as variáveis do ambiente importado:

```txt
base_url=http://localhost:3333
supabase_url=https://seu-projeto.supabase.co
supabase_anon_key=sb_publishable_...
auth_email=email-do-usuario-de-teste
auth_password=senha-do-usuario-de-teste
access_token=preencher depois do login
breed_id=preencher depois de listar raças
dog_id=preencher depois de criar cachorro
dog_slug=preencher depois de criar cachorro
post_id=preencher depois de criar post
```

Nunca versione tokens reais, senhas ou service role key na collection.

## Fluxo De Login

1. Crie um usuário de teste no Supabase em `Authentication -> Users`.
2. Rode `Supabase Auth -> POST password login`.
3. O after-response script salva `access_token` automaticamente no ambiente selecionado.
4. Rode `Dogs API - Auth -> GET /v1/auth/me` ou `Users -> GET /v1/users/me`.

## Raças

Requests públicos:

```txt
GET /v1/breeds
GET /v1/breeds/golden-retriever
```

## Cachorros

Antes de criar cachorro, copie o `id` de uma raça retornada por `GET /v1/breeds` e preencha a variável:

```txt
breed_id=id-da-raca
```

Requests principais:

```txt
POST   /v1/dogs
GET    /v1/dogs
GET    /v1/dogs/:slug
PATCH  /v1/dogs/:dogId
GET    /v1/dogs/:dogId/members
DELETE /v1/dogs/:dogId
```

Depois de criar um cachorro, copie `data.id` para `dog_id` e `data.slug` para `dog_slug`.

## Posts

Requests principais:

```txt
POST   /v1/posts
GET    /v1/posts
GET    /v1/posts/:postId
PATCH  /v1/posts/:postId
DELETE /v1/posts/:postId
```

Depois de criar um post, copie `data.id` para `post_id`.

## Media

Request multipart:

```txt
POST /v1/media
```

Campos:

```txt
postId=id-do-post
file=imagem jpeg, png ou webp ate 5 MB
```

Se a collection já tinha sido importada antes deste script existir, abra o request `POST password login`,
vá em `Scripts -> After-response` e cole:

```js
insomnia.test('Supabase login returned access token', () => {
  insomnia.expect(insomnia.response.code).to.eql(200);

  const jsonBody = insomnia.response.json();
  insomnia.expect(jsonBody.access_token).to.be.a('string');

  insomnia.environment.set('access_token', jsonBody.access_token);

  if (jsonBody.refresh_token) {
    insomnia.environment.set('refresh_token', jsonBody.refresh_token);
  }
});
```

## Ambientes

A collection já vem com:

- `Local`: API rodando em `http://localhost:3333`.
- `Dev`: placeholder para deploy de desenvolvimento.
- `Prod`: placeholder para produção.

Atualize `base_url` de `Dev` e `Prod` quando esses ambientes existirem.

## Segurança

- A collection versionada usa placeholders.
- Não versionar `auth_password`, tokens reais, service role key ou connection strings.
- Se um token real for colado em chat, issue, commit ou print público, gere uma nova sessão.

## Atualizando A Collection

Quando novos endpoints forem implementados:

1. Adicione o request em `docs/http/dogs-api.insomnia.json`.
2. Use variáveis em vez de valores reais.
3. Rode:

```sh
node -e "JSON.parse(require('fs').readFileSync('docs/http/dogs-api.insomnia.json','utf8')); console.log('valid json')"
yarn prettier --check docs/http/dogs-api.insomnia.json docs/http/README.md
```

4. Reimporte o arquivo no Insomnia se necessário.
