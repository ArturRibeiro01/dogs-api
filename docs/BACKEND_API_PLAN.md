# Backend API Plan

Este documento registra a decisão arquitetural para substituir gradualmente a API pública da Origamid por uma API própria do Dogs.

A especificação completa da nova API está em:

```txt
docs/DOGS_API_SPEC.md
```

## Decisão

O backend deve ser criado em outro repositório, separado deste frontend.

Nome sugerido:

```txt
dogs-api
```

Este repositório continua sendo apenas o frontend:

```txt
react-dogs
```

Motivos:

- ciclos de deploy independentes
- CI/CD mais simples por projeto
- backend pode ter stack, banco e infraestrutura próprios
- frontend continua leve e focado em Vite/React
- backend vira um segundo projeto de portfólio com autenticação, banco, upload, storage, permissões e documentação de API

## Produto Alvo

O backend novo não deve apenas copiar a API antiga.

O domínio refinado do Dogs é:

```txt
User -> DogMembership -> Dog -> Post
```

Regras principais:

- um tutor pode ter vários cachorros
- um cachorro pode ter vários tutores
- um post pertence a um cachorro
- o post registra qual tutor publicou
- descoberta deve considerar raça, localização e interesses
- estatísticas devem ser preparadas no backend, mesmo sem tela prioritária no frontend agora

## Stack Recomendada

Stack inicial recomendada:

- Node.js
- TypeScript
- NestJS
- Prisma ORM
- PostgreSQL via Supabase
- Supabase Storage
- Supabase Auth
- Swagger/OpenAPI com `@nestjs/swagger`
- Zod ou class-validator
- GitHub Actions

Motivo da escolha:

- NestJS deixa o backend mais completo e organizado para portfólio.
- Swagger/OpenAPI é bem suportado no ecossistema NestJS.
- Prisma acelera modelagem relacional, migrações e queries tipadas.
- Supabase atende a preferência do projeto e entrega PostgreSQL, Storage, Auth e gestão operacional.
- A API própria concentra regras de domínio, permissões e contratos REST.

## Decisão De Autenticação

Usar Supabase Auth como provedor de identidade.

Responsabilidades do Supabase Auth:

- cadastro/login por email e senha;
- social login, incluindo Google, Apple e Azure (Microsoft);
- emissão e renovação de tokens;
- recuperação de senha;
- gestão de sessão no frontend.

Responsabilidades da Dogs API:

- validar access token Supabase recebido em `Authorization: Bearer`;
- sincronizar/criar perfil local `User`;
- aplicar regras de domínio;
- controlar permissões de tutores, cachorros, posts e uploads.

Motivo:

- social login é sensível e trabalhoso de implementar do zero;
- Supabase Auth já integra com PostgreSQL, Storage e políticas;
- o backend continua forte como projeto de portfólio por concentrar domínio, permissões, contratos REST, Swagger, Prisma e testes.

## Ambientes

Ambientes recomendados:

```txt
local
dev
prod
```

Homologação pode entrar depois:

```txt
hml
```

Mapeamento inicial:

```txt
feature/* -> develop -> main
develop   -> API dev
main      -> API prod
```

## Repositório Público

O repositório da API pode ser público desde que:

- nenhum `.env` real seja commitado
- secrets fiquem no provedor de deploy e no GitHub Secrets
- connection strings reais do Supabase não sejam versionadas
- service role key do Supabase nunca apareça no código
- Swagger não exponha tokens ou credenciais reais
- seeds usem dados fake

## Integração Com Este Frontend

Enquanto o backend é construído, este frontend deve continuar usando:

```txt
VITE_DEMO_MODE=true
```

Quando a API própria existir:

- atualizar `VITE_API_URL`
- trocar `src/api.ts` para consumir `/v1`
- criar telas novas para cachorro, membership e posts
- manter o modo demo/mock como fallback de portfólio

## Critério Para Começar A Implementação

Antes de implementar o backend, decidir:

- nome final do repositório
- provedor de deploy da API
- quantidade inicial de ambientes
- se `hml` entra agora ou depois
- estratégia de email para convites de tutor
- configuração de Supabase Auth para email/senha e provedores sociais
- tamanho máximo de upload
- se Swagger em produção será público ou protegido por basic auth
- se haverá uma collection versionada para Postman, Insomnia ou Bruno
- se a collection será mantida manualmente ou gerada a partir do OpenAPI
