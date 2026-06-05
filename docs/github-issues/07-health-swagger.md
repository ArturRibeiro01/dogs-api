# Health Check E Swagger

## Contexto

A API precisa ser fácil de validar localmente e demonstrável para portfólio.

## Objetivo

Criar health check e documentação Swagger/OpenAPI.

## Escopo

- Criar `GET /health`.
- Configurar Swagger em `/docs`.
- Configurar OpenAPI JSON em `/docs-json`.
- Adicionar metadata básica da API.
- Preparar tags por módulo.

## Fora De Escopo

- Documentar todos os endpoints futuros.
- Basic auth em produção.

## Critérios De Aceite

- `GET /health` responde com status operacional.
- `/docs` abre localmente.
- `/docs-json` expõe OpenAPI.
- Swagger não contém secrets ou tokens reais.
