# 🔐 Informações de Login e Gerenciamento de Usuários

## Credenciais de Administrador Padrão

- **Email:** `admin@manut.app`
- **Senha:** `password123`
- **Role:** `ADMIN`

## 📍 Como Acessar a Área de Administração

1. Faça login com as credenciais acima em: `http://localhost:3000/login`
2. No sidebar, você verá o menu **"Gerenciar Usuários"** (apenas para ADMIN)
3. Ou acesse diretamente: `http://localhost:3000/admin/users`

## 👥 Como Criar Novos Usuários

1. Faça login como ADMIN
2. Acesse "Gerenciar Usuários" no menu lateral ou `/admin/users`
3. Clique em **"Novo Usuário"**
4. Preencha:
   - **Nome:** Nome completo do usuário
   - **Email:** Email do usuário (deve ser único)
   - **Senha:** Senha inicial para o usuário
   - **Função:** 
     - `USER` - Usuário Comum (vê apenas seu contrato)
     - `ADMIN` - Administrador (vê todos os contratos)
     - `MANAGER` - Gerente
   - **Contrato:** Selecione o contrato que o usuário terá acesso (ou "Nenhum" para global)

## 🔒 Sistema de Permissões

### Administrador (ADMIN)
- ✅ Vê **todos os contratos** na página inicial
- ✅ Pode criar e gerenciar usuários
- ✅ Acessa a área `/admin/users`
- ✅ Menu "Gerenciar Usuários" aparece no sidebar

### Usuário Comum (USER)
- ✅ Vê apenas o **contrato associado** a ele
- ❌ Não pode criar usuários
- ❌ Não acessa `/admin/users`

### Gerente (MANAGER)
- Funcionalidade similar ao USER (pode ser expandida no futuro)

## 📝 Atribuir Contratos a Usuários

Ao criar ou editar um usuário:
- Selecione um **contrato específico** → usuário verá apenas aquele contrato
- Selecione **"Nenhum (Global)"** → usuário verá todos os contratos (mesmo comportamento do ADMIN se a role permitir)

## 🔄 Editar Usuário Existente

1. Acesse `/admin/users`
2. Clique no ícone de **lápis** ao lado do usuário
3. Modifique os dados (senha pode ficar em branco para manter a atual)
4. Salve as alterações

## 🗑️ Deletar Usuário

1. Acesse `/admin/users`
2. Clique no ícone de **lixeira** ao lado do usuário
3. O usuário será removido permanentemente

## ⚠️ Observações Importantes

- O usuário ADMIN padrão é criado automaticamente ao rodar `npm run prisma:seed`
- A senha do ADMIN pode ser alterada editando o usuário
- Cada email deve ser único no sistema
- Ao associar um contrato a um usuário, ele automaticamente verá apenas aquele contrato na página inicial (exceto ADMIN que sempre vê todos)

## 📂 Estrutura de Arquivos

- **Página de Admin:** `src/app/(app)/admin/users/page.tsx`
- **Componente de Dialog:** `src/app/(app)/admin/users/_components/user-dialog.tsx`
- **Ações Server:** `src/app/(app)/admin/actions.ts`
- **Configuração Auth:** `src/lib/auth.ts`
- **Seeder (usuário admin):** `prisma/seed.ts`
