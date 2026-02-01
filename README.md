# Auth Project (Node.js + React)

Projeto simples de autenticação com backend em Node.js e frontend em React, utilizando JWT para login e cadastro de usuários.

O objetivo deste projeto é demonstrar uma implementação clara e funcional de autenticação, com frontend e backend separados.

---

## Requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js (versão 18 ou superior)
- npm ou pnpm
- Docker e Docker Compose
- Git (opcional)

---

## Estrutura do Projeto

O projeto é dividido em dois diretórios principais:

```
backend/
frontend/
```

Cada parte deve ser executada em um terminal separado.

---

## Banco de Dados (PostgreSQL com Docker)

Este projeto utiliza PostgreSQL rodando via Docker.

### 1. Subir o banco de dados

No diretório do backend, execute:

```bash
docker compose up -d
```

Isso irá iniciar um container PostgreSQL local.

### 2. Credenciais padrão do banco

Exemplo de configuração utilizada no Docker:

- Usuário: auth_user
- Senha: auth_password
- Banco: auth_db
- Porta: 5432

---

## Variável DATABASE_URL

A variável `DATABASE_URL` deve seguir o formato padrão do PostgreSQL:

```
postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO
```

Exemplo usando o banco Docker local:

```
postgresql://auth_user:auth_password@localhost:5432/auth_db
```

---

## Configuração do Backend

### 1. Acessar o diretório do backend

```bash
cd backend
```

### 2. Instalar dependências

Com npm:
```bash
npm install
```

Ou com pnpm:
```bash
pnpm install
```

---

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do backend:

```env
DATABASE_URL=postgresql://auth_user:auth_password@localhost:5432/auth_db
JWT_SECRET=uma_chave_secreta
```

---

### 4. Executar migrations

```bash
npx prisma migrate dev
```

---

### 5. Iniciar o backend

```bash
npm run dev
```

ou

```bash
pnpm dev
```

O backend será iniciado em:

```
http://localhost:3001
```

Endpoints disponíveis:

```
POST /register
POST /login
```

---

## Configuração do Frontend

### 1. Acessar o diretório do frontend

```bash
cd frontend
```

---

### 2. Instalar dependências

```bash
npm install
```

ou

```bash
pnpm install
```

---

### 3. Iniciar o frontend

```bash
npm run dev
```

O frontend será iniciado em:

```
http://localhost:5173
```

---

## Comunicação Frontend ↔ Backend

- O frontend faz requisições HTTP diretamente para:
  ```
  http://localhost:3001
  ```
- O backend possui CORS configurado para permitir requisições do frontend.
- Não é utilizado proxy do Vite neste projeto.

---

## Fluxo da Aplicação

1. Usuário acessa a página de cadastro (`/register`)
2. Cria uma conta
3. Realiza login (`/login`)
4. É redirecionado para o dashboard
5. Pode encerrar a sessão através do logout

---

## Observações

- Projeto focado em simplicidade e clareza.
- Banco de dados isolado via Docker.
- Ideal para demonstração de autenticação em entrevistas técnicas.

---

## Próximas melhorias possíveis

- Persistência de sessão após reload
- Endpoint `/me`
- Testes automatizados
- Dockerização completa do backend
- Deploy

---
