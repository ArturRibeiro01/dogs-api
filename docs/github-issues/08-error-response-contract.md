# Contrato De Respostas E Erros

## Contexto

O frontend precisa consumir respostas previsíveis e erros seguros para exibição.

## Objetivo

Padronizar respostas de sucesso, paginação e erro.

## Escopo

- Criar formato `{ data }`.
- Criar formato `{ data, pagination }`.
- Criar formato `{ error: { code, message, details } }`.
- Criar filtro global de exceções.
- Criar helpers ou interceptors se fizer sentido.

## Fora De Escopo

- Implementar todos os endpoints.
- Internacionalização completa de mensagens.

## Critérios De Aceite

- Erros públicos têm `code` estável.
- Mensagens são seguras para exibir no frontend.
- Detalhes técnicos não vazam na resposta.
