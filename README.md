# Library App

Aplicação web full-stack para gerenciamento de um acervo de livros — listar, visualizar, cadastrar, editar e remover.

> Para detalhes sobre arquitetura, escolhas técnicas e melhorias futuras, consulte o [OVERVIEW.md](OVERVIEW.md).

---

## Pré-requisitos

- [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/)

> Para rodar sem Docker: **Node.js 20+** e uma instância **PostgreSQL** disponível.

---

## Instalação e Execução

### 1. Configurar variáveis de ambiente

O arquivo `.env` está disponivel no git porem de forma apenas a facilitar no envio da avalição, isso não é correto.

### 2. Subir os serviços

```bash
docker compose up --build
```

### 3. Acessar

| Serviço | URL |
|---|---|
| Frontend | http://localhost |
| API | http://localhost:5000 |

---

## API — Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/books` | Lista todos os livros |
| GET | `/books/:id` | Retorna um livro pelo ID |
| POST | `/books` | Cadastra um novo livro |
| PUT | `/books/:id` | Atualiza um livro existente |
| DELETE | `/books/:id` | Remove um livro |

Todos os endpoints requerem o header `x-api-key` com o valor configurado em `.env`.

---

## Testes

```bash
# Backend
cd Back && npm run test

# Frontend
cd Front/Library && npm run test

# Frontend com cobertura
cd Front/Library && npm run test:coverage
```
