# Collection HTTP Para Desenvolvimento

## Contexto

Uma collection facilita testes manuais no Postman, Insomnia ou Bruno durante o desenvolvimento da API.

## Objetivo

Criar e versionar uma collection segura para uso local/dev.

## Escopo

- Escolher ferramenta principal: Postman, Insomnia ou Bruno.
- Criar requests para health, auth, users, breeds, dogs, posts e media.
- Criar variáveis de ambiente fake/local.
- Documentar como importar/usar.
- Garantir que nenhum token real seja versionado.

## Fora De Escopo

- Testes automatizados substituindo e2e.
- Dados reais de produção.

## Critérios De Aceite

- Collection pode ser importada na ferramenta escolhida.
- Requests usam variáveis para `baseUrl` e tokens.
- Arquivos versionados não contêm secrets reais.
- README explica o fluxo básico de uso.
