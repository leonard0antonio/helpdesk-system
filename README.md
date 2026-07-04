# 🖥️ HelpDesk System

![Demo da aplicação](demo.png)

Publicação No Likedin: [link](https://www.linkedin.com/posts/leonardo-a-a063b519b_fullstackdevelopment-reactjs-nodejs-ugcPost-7478974684831866880-Cc5E/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAC7d9mYBte6k1Fyl6nFfCp63epIEG7BIEWo)

Sistema web Full Stack focado em gestão de chamados técnicos com controle de acesso (RBAC). A solução permite que administradores gerenciem o ecossistema, técnicos realizem atendimentos com precificação dinâmica e clientes acompanhem suas solicitações em tempo real.

![Status do Projeto](https://img.shields.io/badge/Status-Concluído-success?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

---

## 🎯 Visão Geral do Sistema

O projeto foi estruturado para garantir escalabilidade e segurança em cada papel:

### 👑 Administrador
* Gestão completa de usuários (Técnicos e Clientes).
* Curadoria do catálogo de serviços (*Soft Delete*).
* Monitoramento de todos os chamados abertos no sistema.

### 🛠️ Técnico
* Gestão de chamados atribuídos.
* Fluxo de atendimento: *Aberto* → *Em atendimento* → *Encerrado*.
* Funcionalidade de **Upsell**: Adição dinâmica de serviços extras durante o atendimento.

### 👤 Cliente
* Abertura de chamados com múltiplos serviços e seleção de técnico.
* Orçamento dinâmico em tempo real.
* Transparência total no histórico de solicitações.

---

## 🚀 Tecnologias

| Camada | Tecnologia |
| :--- | :--- |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM, PostgreSQL |
| **Frontend** | React.js, Vite, Tailwind CSS, Axios, Lucide React |
| **Segurança** | JWT (Auth), Bcrypt (Hash), Zod (Validação) |
| **Cloud** | Cloudinary (Assets), Vercel (Front), Render (API) |

---

## ⚙️ Instalação e Execução

### Pré-requisitos
* Node.js (v18+)
* Banco de Dados PostgreSQL (Local ou Nuvem)
* Git


### Frontend

```bash
cd helpdesk-system
npm install
# Garanta que VITE_API_URL esteja configurada no .env
npm run dev

```

---

## 👨‍💻 Autor

**Leonardo Antonio da Silva** *Full Stack Developer | Resident in Technology @ Porto Digital*
