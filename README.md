# Dogs API

API oficial do projeto Dogs, responsável por autenticação integrada ao Supabase, perfis, cachorros, raças, publicações e arquivos de mídia.

[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Render](https://img.shields.io/badge/Render-Deploy-000000?logo=render&logoColor=white)](https://render.com/)

## Acesse O Projeto

| Ambiente        | Para que serve                          | API                                                        | Swagger                                                       | Frontend                                                            |
| --------------- | --------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------- |
| Desenvolvimento | Testes e validação das próximas versões | [dogs-api-dev](https://dogs-api-dev.onrender.com/health)   | [Abrir documentação](https://dogs-api-dev.onrender.com/docs)  | [Abrir aplicação](https://arturribeiro01.github.io/react-dogs/dev/) |
| Produção        | Versão estável disponível ao público    | [dogs-api-prod](https://dogs-api-prod.onrender.com/health) | [Abrir documentação](https://dogs-api-prod.onrender.com/docs) | [Abrir aplicação](https://arturribeiro01.github.io/react-dogs/)     |

> Os serviços usam o plano gratuito do Render. O primeiro acesso após um período sem uso pode levar alguns segundos enquanto a API é iniciada.

## Entenda Os Ambientes

O projeto mantém dados e serviços separados para que testes não alterem informações reais:

```txt
feature/* -> develop -> Dogs DEV  -> Supabase dogs-dev
develop   -> main    -> Dogs PROD -> Supabase dogs-prod
```

- **DEV** recebe as alterações da branch `develop` e é usado para testar novas funcionalidades.
- **PROD** recebe somente alterações promovidas para a branch `main` e representa a versão estável.
- Cada ambiente possui sua própria API, banco de dados, autenticação e armazenamento de imagens.

## O Que A API Oferece

- autenticação de usuários com Supabase Auth;
- sincronização e edição de perfis;
- catálogo de raças;
- cadastro e gerenciamento de cachorros;
- feed público e gerenciamento de publicações;
- upload de imagens no Supabase Storage;
- documentação interativa com Swagger;
- migrations e acesso ao PostgreSQL com Prisma.

## Como Usar O Swagger

O Swagger permite conhecer e testar os endpoints diretamente pelo navegador, sem instalar ferramentas adicionais.

1. Abra o [Swagger de desenvolvimento](https://dogs-api-dev.onrender.com/docs) ou o [Swagger de produção](https://dogs-api-prod.onrender.com/docs).
2. Expanda um endpoint para visualizar parâmetros, exemplos e respostas possíveis.
3. Para rotas públicas, clique em **Try it out** e depois em **Execute**.
4. Para rotas protegidas, autentique-se no frontend, obtenha um token válido e use o botão **Authorize** com `Bearer <token>`.

O contrato completo e os formatos de resposta estão em [docs/API_CONTRACT.md](docs/API_CONTRACT.md).

## Execução Local

### Requisitos

- Node.js 20;
- Yarn 1.x;
- acesso a um projeto Supabase configurado.

### Instalação

```sh
yarn install
```

Crie o arquivo `.env.local` a partir do `.env.example` e informe as credenciais do ambiente de desenvolvimento. Nunca versione esse arquivo.

Inicie a API:

```sh
yarn dev
```

Serviços locais:

| Recurso      | Endereço                        |
| ------------ | ------------------------------- |
| API          | http://localhost:3333           |
| Health check | http://localhost:3333/health    |
| Swagger      | http://localhost:3333/docs      |
| OpenAPI JSON | http://localhost:3333/docs-json |

## Autenticação

O frontend autentica o usuário no Supabase e envia o access token para a Dogs API:

```http
Authorization: Bearer <supabase_access_token>
```

Rotas públicas podem ser consultadas sem token. Operações de perfil, publicação, upload e gerenciamento de cachorros exigem autenticação.

## Scripts

| Comando                      | Finalidade                                       |
| ---------------------------- | ------------------------------------------------ |
| `yarn dev`                   | Inicia a API local com recarregamento automático |
| `yarn test`                  | Executa os testes automatizados                  |
| `yarn validate`              | Executa lint, formatação, tipos, testes e build  |
| `yarn build`                 | Compila a aplicação                              |
| `yarn start`                 | Inicia a aplicação compilada                     |
| `yarn prisma:migrate:deploy` | Aplica migrations versionadas                    |
| `yarn prisma:seed`           | Cadastra os dados iniciais idempotentes          |

## Documentação Técnica

| Documento                                           | Conteúdo                                      |
| --------------------------------------------------- | --------------------------------------------- |
| [Contrato da API](docs/API_CONTRACT.md)             | Swagger, autenticação e padrões de resposta   |
| [Arquitetura](docs/ARCHITECTURE.md)                 | Organização e decisões da aplicação           |
| [Ambientes](docs/ENVIRONMENTS.md)                   | Variáveis e separação entre local, dev e prod |
| [Deployment](docs/DEPLOYMENT.md)                    | Render, branches e processo de publicação     |
| [Segurança](docs/SECURITY.md)                       | Cuidados com credenciais e acesso             |
| [Desenvolvimento](docs/DEVELOPMENT.md)              | Fluxo de trabalho local                       |
| [Guia do Prisma](docs/PRISMA_GUIDE.md)              | Banco, migrations e seed                      |
| [Estratégia de autenticação](docs/AUTH_STRATEGY.md) | Integração com Supabase Auth                  |
| [Coleção HTTP](docs/http/README.md)                 | Requisições para testes manuais               |

## Tecnologias

Node.js, TypeScript, NestJS, Prisma, PostgreSQL, Supabase Auth, Supabase Storage, Swagger, Jest e Render.

## Repositórios

- Backend: [ArturRibeiro01/dogs-api](https://github.com/ArturRibeiro01/dogs-api)
- Frontend: [ArturRibeiro01/react-dogs](https://github.com/ArturRibeiro01/react-dogs)
