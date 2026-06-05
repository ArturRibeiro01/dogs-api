# API Contract

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
