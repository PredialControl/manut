# Sistema de Manutenção Predial

Sistema web full-stack para gestão de manutenção predial com Next.js 14, React 18 e TypeScript.

## 🚀 Funcionalidades

- **Gestão Hierárquica**: Contratos → Edifícios → Andares → Locais → Ativos
- **Manutenção Preventiva**: Tarefas agendadas com checklists customizáveis
- **Manutenção Corretiva**: Chamados com rastreamento completo
- **Planos de Manutenção**: Modelos padronizados reutilizáveis
- **Autenticação**: NextAuth com 4 níveis de acesso (ADMIN, GESTOR, MANUTENCAO, ACOMPANHAMENTO)
- **QR Codes**: Geração automática para ativos
- **Importação CSV**: Para itens de construtora

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL (produção) ou SQLite (desenvolvimento)

## 🛠️ Instalação Local

```bash
# Clone o repositório
git clone https://github.com/PredialControl/manut.git
cd manut

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Execute as migrações do banco
npx prisma db push

# Popule o banco com dados iniciais
npx prisma db seed

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

**Login padrão:**
- Email: `admin@manut.app`
- Senha: `password123`

## 🌐 Deploy na Vercel

### 1. Importe o projeto na Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/PredialControl/manut)

### 2. Configure o banco de dados Vercel Postgres

No dashboard da Vercel:
1. Vá em "Storage" → "Create Database" → "Postgres"
2. Copie a `POSTGRES_PRISMA_URL` gerada

### 3. Configure as variáveis de ambiente

Na Vercel, adicione:

```env
DATABASE_URL="sua-postgres-url-aqui"
NEXTAUTH_SECRET="gere-uma-chave-secreta-forte"
NEXTAUTH_URL="https://seu-dominio.vercel.app"
```

**Gerar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Execute as migrações

Após o deploy, execute no terminal da Vercel ou localmente:

```bash
npx prisma db push
npx prisma db seed
```

## 🔐 Segurança

- Troque o `NEXTAUTH_SECRET` em produção
- Use senhas fortes para o usuário admin
- Configure CORS se necessário

## 📚 Stack Tecnológica

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, NextAuth.js
- **Banco**: Prisma ORM, PostgreSQL
- **Deploy**: Vercel

## 📄 Licença

Privado

## 👤 Autor

Ricardo Oliveira - manutencaopredialricardo@gmail.com
