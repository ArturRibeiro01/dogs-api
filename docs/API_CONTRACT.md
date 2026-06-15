# API Contract

## Documentação Interativa

O Swagger apresenta todos os endpoints, parâmetros, schemas e respostas disponíveis em cada ambiente.

| Ambiente        | Swagger                                                                    | OpenAPI JSON                                                                         | Health check                                                                   |
| --------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Local           | [localhost:3333/docs](http://localhost:3333/docs)                          | [localhost:3333/docs-json](http://localhost:3333/docs-json)                          | [localhost:3333/health](http://localhost:3333/health)                          |
| Desenvolvimento | [dogs-api-dev.onrender.com/docs](https://dogs-api-dev.onrender.com/docs)   | [dogs-api-dev.onrender.com/docs-json](https://dogs-api-dev.onrender.com/docs-json)   | [dogs-api-dev.onrender.com/health](https://dogs-api-dev.onrender.com/health)   |
| Produção        | [dogs-api-prod.onrender.com/docs](https://dogs-api-prod.onrender.com/docs) | [dogs-api-prod.onrender.com/docs-json](https://dogs-api-prod.onrender.com/docs-json) | [dogs-api-prod.onrender.com/health](https://dogs-api-prod.onrender.com/health) |

### Testar Uma Rota Pública

1. Abra o Swagger do ambiente desejado.
2. Selecione um endpoint que não exija autenticação, como `GET /v1/breeds`.
3. Clique em **Try it out**.
4. Preencha os parâmetros opcionais e clique em **Execute**.

### Testar Uma Rota Autenticada

As rotas protegidas esperam um access token emitido pelo Supabase Auth:

```http
Authorization: Bearer <supabase_access_token>
```

No Swagger, clique em **Authorize** e informe o token no formato indicado. Tokens e credenciais nunca devem ser adicionados a exemplos, documentação, issues ou commits.

> No plano gratuito do Render, o primeiro acesso pode demorar enquanto o serviço é iniciado.

Este documento registra o contrato base de respostas da `dogs-api`.

## Resposta De Item

Use para endpoints que retornam um único recurso.

```json
{
  "data": {}
}
```

Helper:

```ts
itemResponse(data);
```

## Resposta De Lista

Use para endpoints paginados.

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

Helper:

```ts
listResponse(data, pagination);
```

## Resposta De Erro

Todo erro público deve seguir:

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

- `code` deve ser estável para tratamento programático.
- `message` deve ser segura para exibir no frontend.
- `details` pode conter informações úteis para validação, mas nunca secrets.
- erros internos não devem vazar detalhes técnicos na resposta.

## Códigos Iniciais

```txt
BAD_REQUEST
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
CONFLICT
PAYLOAD_TOO_LARGE
TOO_MANY_REQUESTS
INTERNAL_SERVER_ERROR
```

## Filtro Global

O filtro global fica em:

```txt
src/common/filters/http-exception.filter.ts
```

Ele converte exceções Nest e exceções da aplicação para o formato `{ error }`.

## Exceção De Aplicação

Use `AppException` quando precisar controlar explicitamente `code`, `message`, status HTTP e detalhes.

Exemplo:

```ts
throw new AppException(apiErrorCodes.conflict, 'Username indisponível.', HttpStatus.CONFLICT);
```
