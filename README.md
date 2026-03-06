# Library App

Aplicação web full-stack para gerenciamento de um acervo de livros. Permite listar, visualizar, cadastrar, editar e remover livros de uma biblioteca.

---

## Visão Geral

### Arquitetura

A aplicação é dividida em três serviços, orquestrados via **Docker Compose**:

```
                        Docker Compose
  ┌─────────────────────────────────────────────────────────────────────┐
  │                                                                     │
  │   ┌──────────────────┐             ┌──────────────────┐            │
  │   │    frontend       │   HTTP/JSON │    backend       │            │
  │   │  ─────────────── │ ──────────► │  ─────────────── │            │
  │   │  React 19 + Vite  │  :5000      │  Fastify + Node  │            │
  │   │  Tailwind CSS     │ ◄────────── │  Knex + Zod      │            │
  │   │  TanStack Query   │             │                  │            │
  │   │                   │             └────────┬─────────┘            │
  │   │  porta 80 (nginx) │                      │ SQL                  │
  │   └──────────────────┘                      │ :5432                │
  │                                              ▼                      │
  │                                   ┌──────────────────┐             │
  │                                   │       db          │             │
  │                                   │  ─────────────── │             │
  │                                   │    PostgreSQL     │             │
  │                                   │                  │             │
  │                                   │  volume: db       │             │
  │                                   └──────────────────┘             │
  │                                                                     │
  └─────────────────────────────────────────────────────────────────────┘

  Usuário ──► http://localhost        (frontend)
              http://localhost:5000   (API)
```

### Frontend (`Front/Library`)
- **React 19** + **TypeScript**
- **Vite** como bundler
- **TanStack Query** para gerenciamento de estado assíncrono e cache
- **React Router** para navegação entre páginas
- **Tailwind CSS** para estilização
- **Zod** para validação de formulários
- Testes com **Vitest** + **Testing Library**

```
Front/Library/src/
├── api/                    # Configuração do cliente HTTP (axios)
├── assets/                 # Imagens e recursos estáticos
├── components/             # Componentes reutilizáveis
│   ├── header/             # Cabeçalhos de página 
│   ├── modal/              # Modais
│   └── ui/                 # Componentes de UI genéricos 
├── hooks/                  # Hooks customizados (useBooks)
├── lib/                    # Utilitários (dateUtils)
├── pages/                  # Páginas da aplicação
├── schemas/                # Schemas Zod compartilhados com validação
├── test/                   # Configuração global de testes
├── router.tsx              # Definição das rotas
└── App.tsx                 # Componente raiz
```

### Backend (`Back`)
- **Node.js** + **TypeScript**
- **Fastify** como framework HTTP
- **Knex** como query builder para PostgreSQL
- **Zod** para validação e tipagem dos dados de entrada
- Testes com **Vitest** + **Supertest**

```
Back/src/
├── controllers/            # Camada HTTP: recebe requisições, chama serviços e retorna respostas
│   └── BookController.ts
├── services/               # Regras de negócio
│   └── BookService.ts
├── repositories/           # Acesso ao banco de dados via Knex
│   └── BookRepository.ts
├── routes/                 # Definição e registro das rotas Fastify
│   └── bookRoutes.ts
├── schemas/                # Schemas Zod para validação de entrada
│   └── book.schemas.ts
├── database/               # Configuração da conexão com o PostgreSQL
│   └── connection.ts
└── server.ts               # Ponto de entrada da aplicação
```

### Banco de Dados (`Database`)
- **PostgreSQL**
- Tabela `books` com os campos: `id`, `title`, `author`, `published_date`, `book_description`, `book_img`, `created_at`, `updated_at`

### API — Endpoints disponíveis

| Método | Rota          | Descrição                  |
|--------|---------------|----------------------------|
| GET    | `/books`      | Lista todos os livros       |
| GET    | `/books/:id`  | Retorna um livro pelo ID    |
| POST   | `/books`      | Cadastra um novo livro      |
| PUT    | `/books/:id`  | Atualiza um livro existente |
| DELETE | `/books/:id`  | Remove um livro             |

---

## Pré-requisitos

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados na máquina.

> Para rodar localmente sem Docker, também é necessário **Node.js 20+** e uma instância do **PostgreSQL** disponível.

---

## Instalação e Execução

### Com Docker (recomendado)

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd <nome-da-pasta>
   ```

2. Suba todos os serviços com um único comando:
   ```bash
   docker compose up --build
   ```

3. Acesse a aplicação no navegador:
   - **Frontend:** http://localhost
   - **API (Backend):** http://localhost:5000

Para parar os serviços:
```bash
docker compose down
```

Para remover também os volumes (apaga os dados do banco):
```bash
docker compose down -v
```

---

## Testes

### Backend
```bash
cd Back
npm run test
```

### Frontend
```bash
cd Front/Library
npm run test
```

Para gerar relatório de cobertura (frontend):
```bash
npm run test:coverage
```
