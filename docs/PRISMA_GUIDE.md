# Prisma Guide

Este guia explica o papel do Prisma no `dogs-api`.

## O Que É Prisma?

Prisma é uma camada entre a API e o banco de dados.

No nosso projeto:

```txt
NestJS API -> Prisma -> PostgreSQL/Supabase
```

Ele não é o banco. O banco será PostgreSQL hospedado no Supabase. O Prisma é a ferramenta que a API usa para modelar, migrar e consultar esse banco com TypeScript.

## Para Que Serve?

Prisma serve principalmente para três coisas:

1. Modelar o banco.
2. Criar migrations.
3. Consultar o banco com TypeScript.

## 1. Modelar O Banco

Os modelos ficam em:

```txt
prisma/schema.prisma
```

Exemplo simplificado:

```prisma
model User {
  id       String @id @default(uuid())
  email    String @unique
  name     String
}
```

Esse modelo representa uma tabela no banco.

No Dogs API, o schema descreve entidades como:

- `User`
- `Dog`
- `DogMembership`
- `Breed`
- `Post`
- `Media`

Observação: autenticação, refresh token e recuperação de senha ficam no Supabase Auth. O Prisma modela apenas o perfil local `User` e o domínio Dogs.

## 2. Criar Migrations

Migration é uma alteração versionada no banco.

Exemplos:

- criar tabela `User`;
- adicionar campo `avatarUrl`;
- criar tabela `Dog`;
- criar relacionamento entre `Dog` e `Breed`.

Quando o schema mudar, o Prisma pode gerar uma migration:

```sh
yarn prisma:migrate:dev
```

Em produção, a ideia é aplicar migrations versionadas:

```sh
yarn prisma:migrate:deploy
```

## 3. Consultar O Banco Com TypeScript

Sem Prisma, poderíamos escrever SQL manual:

```sql
SELECT * FROM users WHERE email = 'a@b.com';
```

Com Prisma, escrevemos TypeScript:

```ts
const user = await prisma.user.findUnique({
  where: { email: 'a@b.com' },
});
```

O benefício é ter autocomplete, tipos e menos risco de consultar campos inexistentes.

Exemplo futuro no Dogs:

```ts
const dog = await prisma.dog.create({
  data: {
    name: 'Nina',
    slug: 'nina',
    breedId: '...',
  },
});
```

Se `breedId` não existisse no schema, o TypeScript avisaria.

## Como Ele Entra Na Arquitetura?

Fluxo esperado:

```txt
Controller recebe request
Service aplica regra de negócio
PrismaService busca ou salva dados
PostgreSQL armazena os dados
```

Exemplo futuro:

```ts
@Injectable()
export class DogsService {
  constructor(private readonly prisma: PrismaService) {}

  createDog() {
    return this.prisma.dog.create({
      data: {
        name: 'Nina',
        slug: 'nina',
        breedId: '...',
      },
    });
  }
}
```

## Prisma, PostgreSQL E Supabase

Resumo:

```txt
PostgreSQL é o banco.
Supabase hospeda o banco.
Prisma conversa com o banco.
NestJS usa o Prisma para buscar e salvar dados.
```

## Comandos Úteis

Validar o schema:

```sh
yarn prisma:validate
```

Gerar Prisma Client:

```sh
yarn prisma:generate
```

Criar migration local:

```sh
yarn prisma:migrate:dev
```

Aplicar migrations em ambiente remoto:

```sh
yarn prisma:migrate:deploy
```

Rodar seed:

```sh
yarn prisma:seed
```

## O Que Já Existe No Projeto?

Arquivos principais:

```txt
prisma/schema.prisma
prisma/seed.ts
src/database/prisma.service.ts
src/database/database.module.ts
```

O schema e o Prisma Client já estão configurados. O `DatabaseModule` existe, mas ainda não foi importado no `AppModule`, porque a API ainda não precisa conectar no banco para subir.
