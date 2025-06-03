# 🧠 GestorPlay API

API RESTful robusta para alimentar o sistema de gestão de projetos e tarefas **GestorPlay**.

## ⚙️ Tecnologias

- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Socket.IO](https://socket.io/) 🔁
- JWT para autenticação 🔐
- SQL Server (Banco de Dados) 📓

## 📦 Funcionalidades

✅ CRUD de tarefas, usuários, projetos e equipes  
✅ Play/Pause das tarefas com tracking de tempo  
✅ WebSocket para autenticação em tempo real  
✅ Middleware de autenticação e validação  

## ▶️ Scripts

```bash
# Instalar pnpm
npm install -g pnpm

# Instalar dependências
pnpm install

# Rodar servidor
pnpm run dev

# Rodar em Produção
pnpm run start
```