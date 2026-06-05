# Configuração E Validação De Ambiente

## Contexto

O backend terá secrets e configurações diferentes por ambiente.

## Objetivo

Criar módulo de configuração com validação de variáveis de ambiente.

## Escopo

- Criar `.env.example`.
- Configurar leitura de envs.
- Validar envs obrigatórias no boot.
- Tipar configuração usada pela aplicação.
- Documentar envs em `docs/ENVIRONMENTS.md`.

## Fora De Escopo

- Criar projetos Supabase reais.
- Configurar secrets no provedor.

## Critérios De Aceite

- Aplicação falha no boot quando env obrigatória está ausente.
- `.env.example` não contém secrets reais.
- Configuração diferencia `local`, `dev` e `prod`.
