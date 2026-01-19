
# Projeto Manut

O Manut é uma aplicação web full-stack para gerenciamento de manutenção de ativos em edifícios e instalações. Ele permite o controle de manutenções preventivas e corretivas, a gestão de equipes e a geração de relatórios.

## ✨ Funcionalidades Principais

*   **Autenticação e Autorização:** Sistema de login com diferentes níveis de acesso (papéis de usuário).
*   **Gestão de Estrutura:** Cadastro e organização de Contratos, Edifícios, Andares e Locais.
*   **Controle de Ativos:** Cadastro detalhado de ativos (equipamentos), com status e localização.
*   **Manutenção Preventiva:** Criação e agendamento de tarefas de manutenção preventiva com checklists personalizados.
*   **Manutenção Corretiva:** Abertura e acompanhamento de chamados de manutenção corretiva com definição de prioridade.
*   **Execução e Histórico:** Registro de todas as execuções de manutenção, incluindo o responsável, datas e resultados do checklist.
*   **Relatórios e Anexos:** Capacidade de anexar arquivos e gerar relatórios para as manutenções.

## 🚀 Tecnologias Utilizadas

*   **Frontend:**
    *   [Next.js](https://nextjs.org/) - Framework React para produção.
    *   [React](https://reactjs.org/) - Biblioteca para construção de interfaces de usuário.
    *   [Tailwind CSS](https://tailwindcss.com/) - Framework de CSS utility-first.
    *   [shadcn/ui](https://ui.shadcn.com/) - Componentes de UI reusáveis.
    *   [Zod](https://zod.dev/) - Validação de esquemas.
*   **Backend:**
    *   [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - Para a construção da API.
    *   [NextAuth.js](https://next-auth.js.org/) - Para autenticação.
*   **Banco de Dados:**
    *   [Prisma](https://www.prisma.io/) - ORM para Node.js e TypeScript.
    *   [SQLite](https://www.sqlite.org/) - Banco de dados SQL embarcado (usado para desenvolvimento).

## ⚙️ Como Começar

Siga as instruções abaixo para configurar e rodar o projeto em seu ambiente local.

### Pré-requisitos

*   [Node.js](https://nodejs.org/) (versão 20.x ou superior)
*   [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://SEU_REPOSITORIO/manut.git
    cd manut
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Configure as variáveis de ambiente. Crie um arquivo `.env` na raiz do projeto e adicione as variáveis necessárias. No mínimo, você precisará de `NEXTAUTH_SECRET`.
    ```env
    # Secret para o NextAuth.js. Gere um em https://generate-secret.vercel.app/
    NEXTAUTH_SECRET=
    ```

4.  Aplique as migrações do banco de dados para criar as tabelas:
    ```bash
    npx prisma migrate dev
    ```

5.  (Opcional) Popule o banco de dados com dados iniciais:
    ```bash
    npm run prisma:seed
    ```

### Rodando a Aplicação

Para iniciar o servidor de desenvolvimento, execute:
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) em seu navegador para ver a aplicação.

## 📂 Estrutura do Projeto

```
manut/
├── prisma/               # Esquema e migrações do banco de dados
│   ├── schema.prisma     # Definição do modelo de dados
│   └── seed.ts           # Script para popular o banco
├── public/               # Arquivos estáticos
├── src/
│   ├── app/              # Rotas e páginas da aplicação (App Router)
│   │   ├── (app)/        # Rotas protegidas por autenticação
│   │   │   ├── assets/
│   │   │   ├── assets-list/
│   │   │   └── preventive/
│   │   ├── api/
│   │   └── login/
│   ├── components/       # Componentes React reutilizáveis
│   ├── lib/              # Funções utilitárias e helpers
│   └── types/            # Definições de tipos TypeScript
├── package.json          # Dependências e scripts do projeto
└── ...
``` 