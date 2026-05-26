# 🖥️ HelpDesk System

Um sistema web completo para gerenciamento de chamados técnicos (HelpDesk). Construído com uma arquitetura Full Stack, a aplicação implementa um robusto Controle de Acesso Baseado em Papéis (RBAC), dividindo as permissões entre Administradores, Técnicos e Clientes.

![Status do Projeto](https://img.shields.io/badge/Status-Concluído-success?style=for-the-badge)

## 🎯 Funcionalidades e Regras de Negócio

O sistema foi desenhado para atender três perfis distintos, cada um com seu nível de acesso:

- **👑 Administrador (Admin):**
  - Gestão total de usuários: Criação de contas de Técnicos (com senha provisória e horários padrão: 08h-18h) e listagem/exclusão de Clientes.
  - Gestão de Serviços: Criação, edição e exclusão lógica (*Soft Delete*) de serviços oferecidos.
  - Gestão de Chamados: Visualização de todos os chamados e alteração de status.

- **🛠️ Técnico (Tech):**
  - Painel exclusivo visualizando apenas os chamados atribuídos a si.
  - Controle de andamento: Alteração de status (Aberto -> Em atendimento -> Encerrado).
  - Flexibilidade no atendimento: Permissão para adicionar serviços extras em chamados em andamento, atualizando o valor total dinamicamente.
  - Gestão de Perfil: Atualização de avatar (Upload de imagem via Cloudinary).

- **👤 Cliente (Client):**
  - Autocadastro e gestão do próprio perfil.
  - Abertura de chamados escolhendo múltiplos serviços e selecionando um técnico disponível.
  - Visualização em tempo real do orçamento prévio.
  - Direitos de cancelamento: Pode excluir um chamado antes do início, ou solicitar cancelamento caso já esteja em andamento.

## 🚀 Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as ferramentas mais modernas do ecossistema JavaScript/TypeScript:

**Backend (API REST):**
* ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) **Node.js + Express:** Servidor e roteamento.
* ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) **TypeScript:** Tipagem estática e segurança.
* ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) **PostgreSQL:** Banco de dados relacional.
* ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) **Prisma ORM:** Modelagem, migrações e consultas ao banco.
* **Autenticação & Segurança:** JWT (JSON Web Tokens) e Bcrypt (Hash de senhas).
* **Validação:** Zod.
* **Uploads:** Multer + Cloudinary (Storage na nuvem).

**Frontend (SPA):**
* ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) **React.js:** Biblioteca de interfaces.
* ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) **Vite:** Bundler ultrarrápido.
* ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) **Tailwind CSS:** Estilização baseada em utilitários e abordagem *Mobile First*.
* **Roteamento & Requisições:** React Router Dom e Axios.

---

## 🌐 Links de Deploy

- **Frontend (Vercel):** [🔗 Insira o link do Vercel aqui]
- **Backend API (Render):** [🔗 Insira o link do Render aqui]

---

## ⚙️ Como executar o projeto localmente

Siga as instruções abaixo para rodar a aplicação no seu ambiente de desenvolvimento.

### Pré-requisitos
* Node.js (v18 ou superior)
* PostgreSQL rodando localmente ou via Docker.
* Conta gratuita no [Cloudinary](https://cloudinary.com/) (para upload de imagens).

### 1. Configurando o Backend

```bash
# Clone este repositório
$ git clone [https://github.com/SEU_USUARIO/helpdesk-system.git](https://github.com/SEU_USUARIO/helpdesk-system.git)

# Acesse a pasta do backend
$ cd helpdesk-system/backend

# Instale as dependências
$ npm install

# Crie um arquivo .env baseado no .env.example (ou adicione as variáveis abaixo)
# DATABASE_URL="postgresql://user:password@localhost:5432/helpdesk_db"
# JWT_SECRET="sua_chave_secreta"
# CLOUDINARY_CLOUD_NAME="seu_cloud_name"
# CLOUDINARY_API_KEY="sua_api_key"
# CLOUDINARY_API_SECRET="seu_api_secret"

# Execute as migrações para criar as tabelas no banco de dados
$ npx prisma migrate dev

# Popule o banco com o Administrador inicial
$ npx tsx src/seed.ts

# Inicie o servidor de desenvolvimento
$ npm run dev
```
A API estará rodando em: `http://localhost:3333`

### 2. Configurando o Frontend

Em um novo terminal, execute:

```bash
# Acesse a pasta do frontend a partir da raiz do projeto
$ cd helpdesk-system/frontend

# Instale as dependências
$ npm install

# Inicie a aplicação React
$ npm run dev
```
O Frontend estará rodando em: `http://localhost:5173`

Para acessar o sistema pela primeira vez, utilize as credenciais geradas pelo script de *Seed*:
- **E-mail:** `admin@helpdesk.com`
- **Senha:** `admin123`

---

## 👨‍💻 Autor

**Leonardo**
*Full Stack Developer - Resident in Technology @ Porto Digital*
