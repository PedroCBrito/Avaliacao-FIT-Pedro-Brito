# Overview Técnico — Library App

## Sumário

1. [Arquitetura Geral](#1-arquitetura-geral)
2. [Backend](#2-backend)
3. [Frontend](#3-frontend)
4. [Banco de Dados](#4-banco-de-dados)
5. [Infraestrutura](#5-infraestrutura)
6. [Testes](#6-testes)
7. [Melhorias Futuras](#7-melhorias-futuras)

---

## 1. Arquitetura Geral

```
  Usuário
    │
    ▼
 Frontend (React + Vite)    porta 80 — nginx serve o build estático
    │  HTTP/JSON + x-api-key header
    ▼
 Backend (Fastify + Node)   porta 5000
    │  SQL via Knex
    ▼
 PostgreSQL                 porta 5432 — volume persistente
```

Três serviços independentes orquestrados via Docker Compose. A separação permite escalar, fazer deploy e testar cada camada de forma isolada. O banco nunca fica exposto diretamente — todo acesso passa pela camada de serviço, onde validações residem.

---

## 2. Backend

### Arquitetura em camadas

| Camada | Responsabilidade |
|---|---|
| **Controller** | Recebe a requisição HTTP, extrai parâmetros, delega ao Service |
| **Service** | Lógica de negócio — ponto de melhoria futuro |
| **Repository** | Queries ao banco via Knex |

### Fastify

Escolhido por performance e integração nativa com Zod via `fastify-type-provider-zod`, os schemas geram validação automática nas rotas e inferem os tipos TypeScript dos handlers. O `setErrorHandler` global centraliza o tratamento: erros Zod → 400, demais → 500.

### Knex

Query builder em vez de ORM por transparência e facilidade.

### Zod

Usado tanto no backend quanto no frontend. Os schemas eliminam a necessidade de sincronizar tipos e validações manualmente. As regras são as mesmas nos dois lados da requisição.

### Autenticação via API Key

A API é protegida por um hook `onRequest` no Fastify que valida o header `x-api-key` em toda requisição:

Sem login e sem dados sensíveis, uma API Key estática é suficiente para bloquear acesso externo para o nível do projeto atual.

---

## 3. Frontend

### TanStack Query

Gerencia todo o estado assíncrono.

### Axios

A instância em `api.ts` configura base URL (via `VITE_API_URL`) e envia o header `x-api-key` (via `VITE_API_KEY`) em todo request automaticamente. A chave é embutida no bundle pelo Vite em tempo de build a partir de um build arg do Docker.

### Outras escolhas

- **React Router v7** — navegação client-side; redirect `/` → `/books` evita página em branco na raiz.
- **Tailwind CSS v4** — integrado diretamente ao Vite via plugin, sem arquivo de configuração separado.
- **`React.memo`** em `BookCard` e `BookDetails` — evita re-render de todos os cards ao digitar na busca.
- **Debounce de 300ms** na busca — evita filtragem a cada tecla.

---

## 4. Banco de Dados

Schema criado via `init.sql` na inicialização do container. A coluna `updated_at` é atualizada automaticamente em cada `UPDATE` via trigger PostgreSQL.

Isso garante que o campo reflita sempre a última modificação real sem depender da aplicação para setar o valor.

---

## 5. Infraestrutura

### Docker Compose

Toda a configuração das imagens docker estão configuradas dentro do docker-compose.

Toda configuração sensível (credenciais do banco, API Key) vem do `.env` local.

`O .env foi enviado ao git apenas para facilitar na tarefa, não deve ser feito nunca. `

---

## 6. Testes

### Backend

| Tipo | O que cobre |
|---|---|
| Unitário (Service) | Lógica de negócio isolada, repositório mockado em memória |
| Unitário (Repository) | Queries ao banco com Knex mockado |
| Integração (Routes) | Ciclo HTTP completo via Supertest |
| Unitário (Schemas) | Regras de validação Zod |

### Frontend

| Tipo | O que cobre |
|---|---|
| Hooks | `useBooks` com API mockada |
| Componentes | Renderização e interação via Testing Library |
| Schemas | Validação Zod no cliente |

---

## 7. Melhorias Futuras

### Armazenamento de imagens (TODO explícito no código)

Imagens hoje ficam como base64 na coluna `book_img TEXT`. Uma imagem JPEG de 200 KB vira ~270 KB no banco, infla o payload da API e impede uso de CDN.

**Solução**: upload para AWS S3/Cloudflare , armazenar apenas a URL. O frontend já lida com URLs externas (`startsWith('http')` já existe nos componentes).

---

### Paginação e busca server-side

`listAll()` faz `SELECT *` sem `LIMIT`. A busca por título filtra 100% no cliente — inviável com paginação, pois só filtra os registros da página atual.

**Solução**: `GET /books?search=...&page=1&limit=20`. O TanStack Query suporta `useInfiniteQuery` nativamente para scroll infinito.

---

### Migrations em vez de `init.sql`

O `init.sql` só executa na primeira inicialização do container. Se o volume já existe, o script é ignorado — não há como evoluir o schema por esse mecanismo.

**Solução**: usar as migrations do Knex (já configurado no `knexfile.ts`). Cada migration é versionada, rastreável e reversível.

---

### Rate Limiting

A API não tem proteção contra abuso. O plugin `@fastify/rate-limit` resolve em poucas linhas.

---

### Schema Zod compartilhado

Os schemas em `Back/src/schemas/` e `Front/Library/src/schemas/` são quase idênticos. Qualquer mudança de regra precisa ser replicada nos dois lugares.

**Solução**: extrair para um pacote compartilhado via `pnpm workspaces` ou `turborepo`.

---

### Enriquecimento da camada de Service e tratamento de dados

O `BookService` atual é um passthrough direto para o repositório — cada método apenas repassa a chamada sem nenhuma lógica intermediária. À medida que a aplicação cresce, essa camada é o lugar correto para centralizar regras de negócio e tratamento de dados.

Exemplos concretos do que poderia ser aplicado:

- **Verificação de duplicatas**: antes de criar ou atualizar um livro, checar se já existe um registro com o mesmo título e autor, retornando um erro descritivo em vez de deixar o banco falhar silenciosamente (ou salvar dados duplicados).

- **Regras de deleção**: antes de deletar, verificar se o livro existe e lançar um erro com mensagem clara caso não seja encontrado, em vez de tratar isso apenas na camada do controller com uma checagem de `null`.

- **Normalização de dados de entrada**: padronizar strings antes de persistir. ex.: title.trim(), capitalização consistente do nome do autor, conversão do formato de data para garantir uniformidade no banco.