# Decisões Pendentes

Este arquivo concentra decisões que precisam ser tomadas antes ou durante o scaffold inicial.

## Produto E Escopo

- Confirmar se o MVP terá apenas feed, perfis de cachorro, posts e upload.
- Confirmar se favoritos entram no MVP ou ficam para a segunda fase.
- Confirmar se interesse de contato entra no MVP ou fica preparado apenas no backend.
- Definir tamanho máximo inicial de upload.
- Definir se posts privados/unlisted serão implementados já no MVP ou apenas modelados.

## Arquitetura E Stack

- Confirmar NestJS como framework inicial.
- Escolher validação de DTOs: `class-validator` ou Zod.
- Escolher Jest ou Vitest para testes.
- Definir se uploads começam via multipart na API ou URL assinada do Supabase.
- Definir estratégia de geração de slugs para cachorros e raças.

## Ambientes E Deploy

- Escolher provedor de deploy da API.
- Confirmar ambientes persistentes iniciais: `dev` e `prod`.
- Decidir quando criar `hml`.
- Criar projetos Supabase separados: `dogs-dev` e `dogs-prod`.
- Definir se Supabase Branching será usado para previews ou validação de migrations.
- Definir política de migrations em produção.

## Segurança

- Definir se Swagger em produção será público ou protegido por basic auth.
- Definir rate limits iniciais para uploads e contact interests.
- Confirmar estratégia de validação de token Supabase na Dogs API.
- Confirmar se usaremos `SUPABASE_JWT_SECRET` localmente ou validação via Supabase Admin API/JWKS.
- Definir política de CORS por ambiente.

## Email

- Escolher provider de email.
- Definir se emails transacionais de Auth ficam todos no Supabase Auth ou se alguns serão customizados depois.
- Definir templates para convite de tutor.
- Definir comportamento local com `MAIL_PROVIDER=console`.

## Supabase Auth

- Criar projeto Supabase `dogs-dev`.
- Configurar email/senha.
- Configurar Google.
- Configurar Apple.
- Configurar Azure (Microsoft).
- Definir redirect URLs do frontend local, dev e prod.
- Definir se confirmação de email será obrigatória no MVP.

## Collection HTTP

- Criar uma collection para Postman, Insomnia ou Bruno.
- Escolher a ferramenta principal recomendada para o projeto.
- Decidir se a collection será mantida manualmente ou gerada a partir do OpenAPI.
- Versionar apenas ambientes fake/local, sem tokens reais.
- Incluir requests mínimos para health, auth, users, breeds, dogs, invites, posts, media e favorites.

## Documentação

- Decidir se `DOGS_API_SPEC.md` será mantido com esse nome ou copiado para `PRODUCT_AND_API_SPEC.md`.
- Criar `DEVELOPMENT.md`, `ARCHITECTURE.md`, `ENVIRONMENTS.md`, `SECURITY.md` e `DEPLOYMENT.md`.
- Criar `PROJECT_STATUS.md` para registrar progresso e issues concluídas.
