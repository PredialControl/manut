# 🏢 Sistema de Cadastro de Empresas e Usuários

## 📋 Cadastro de Empresa/Contrato

O cadastro de empresa/contrato agora inclui os seguintes campos:

### Campos Obrigatórios:
- **Nome da Empresa/Contrato**
- **Sigla** (ex: LONE) - deve ser única

### Campos Opcionais:
- **CNPJ**
- **Endereço**
- **Gestor** (Nome do gestor responsável)
- **Telefone**
- **Status** (Implantado / Em implantação)
- **Imagem/Logo** (Upload de imagem)

### Como Cadastrar:
1. Acesse a página inicial (`/`)
2. Clique em **"Novo Contrato"**
3. Preencha os campos do formulário
4. Clique em **"Salvar Contrato"**

## 👥 Sistema de Roles (Funções)

O sistema agora possui 4 tipos de usuários com diferentes permissões:

### 🔴 ADMIN (Administrador)
- ✅ Vê **todos os contratos** na página inicial
- ✅ Pode criar e gerenciar usuários
- ✅ Acessa a área `/admin/users`
- ✅ Pode criar contratos
- ✅ Pode editar qualquer contrato
- ✅ Menu "Gerenciar Usuários" aparece no sidebar

### 🟡 GESTOR (Gestor da Empresa)
- ✅ Vê apenas o **contrato associado** a ele
- ✅ **Pode alterar tudo** relacionado ao contrato dele:
  - Editar informações do contrato
  - Criar/editar ativos
  - Criar/editar corretivas
  - Criar/editar preventivas
  - Gerenciar planos de manutenção
- ❌ Não pode criar/gerenciar usuários (apenas ADMIN)
- ❌ Não acessa `/admin/users`

### 🟢 MANUTENCAO (Manutenção)
- ✅ Vê apenas o **contrato associado** a ele
- ✅ **Pode criar novas corretivas**
- ✅ **Pode executar atividades** que estiverem no nome dele:
  - Executar tarefas preventivas
  - Executar manutenções corretivas
  - Atualizar status de chamados
- ❌ Não pode editar informações do contrato
- ❌ Não pode criar/gerenciar usuários
- ❌ Acesso limitado a funcionalidades de manutenção

### 🔵 ACOMPANHAMENTO (Acompanhamento)
- ✅ Vê apenas o **contrato associado** a ele
- ✅ Pode **visualizar** informações:
  - Ver corretivas
  - Ver preventivas
  - Ver relatórios
  - Ver status de manutenções
- ❌ **Somente leitura** - não pode criar ou editar nada
- ❌ Não pode executar tarefas

## 📝 Como Criar Usuários

### Criar Usuário com Role Específica:

1. Faça login como **ADMIN** (`admin@manut.app` / `password123`)
2. Acesse **"Gerenciar Usuários"** no sidebar ou `/admin/users`
3. Clique em **"Novo Usuário"**
4. Preencha:
   - **Nome:** Nome completo do usuário
   - **Email:** Email único do usuário
   - **Senha:** Senha inicial
   - **Função:** Selecione uma das opções:
     - `ADMIN` - Administrador
     - `GESTOR` - Gestor
     - `MANUTENCAO` - Manutenção
     - `ACOMPANHAMENTO` - Acompanhamento
   - **Contrato:** Selecione o contrato da empresa (obrigatório para GESTOR, MANUTENCAO e ACOMPANHAMENTO)

## 🔒 Permissões por Funcionalidade

### Portal de Contratos (`/`)
- **ADMIN:** Vê todos os contratos
- **GESTOR/MANUTENCAO/ACOMPANHAMENTO:** Vê apenas o contrato associado

### Criar Contrato
- **ADMIN:** ✅ Pode criar
- **GESTOR/MANUTENCAO/ACOMPANHAMENTO:** ❌ Não pode criar

### Editar Contrato
- **ADMIN:** ✅ Pode editar qualquer contrato
- **GESTOR:** ✅ Pode editar o próprio contrato
- **MANUTENCAO/ACOMPANHAMENTO:** ❌ Não pode editar

### Criar Corretiva
- **ADMIN:** ✅ Pode criar
- **GESTOR:** ✅ Pode criar
- **MANUTENCAO:** ✅ Pode criar
- **ACOMPANHAMENTO:** ❌ Não pode criar

### Executar Manutenção/Atividade
- **ADMIN:** ✅ Pode executar
- **GESTOR:** ✅ Pode executar
- **MANUTENCAO:** ✅ Pode executar (apenas tarefas no nome dele)
- **ACOMPANHAMENTO:** ❌ Não pode executar

### Gerenciar Usuários (`/admin/users`)
- **ADMIN:** ✅ Acesso completo
- **GESTOR/MANUTENCAO/ACOMPANHAMENTO:** ❌ Sem acesso

## 🎯 Fluxo Típico de Uso

### 1. ADMIN cadastra a empresa:
   - Cria o contrato com todos os dados da empresa
   - Define Gestor, Telefone, CNPJ, Endereço

### 2. ADMIN cria usuários para a empresa:
   - Cria usuário com role `GESTOR` e associa ao contrato
   - Cria usuários com role `MANUTENCAO` e associa ao contrato
   - Cria usuários com role `ACOMPANHAMENTO` (se necessário) e associa ao contrato

### 3. GESTOR gerencia o contrato:
   - Edita informações da empresa quando necessário
   - Cria e gerencia ativos, corretivas, preventivas

### 4. MANUTENCAO trabalha:
   - Cria novas corretivas quando necessário
   - Executa tarefas preventivas e corretivas

### 5. ACOMPANHAMENTO acompanha:
   - Visualiza status de todas as manutenções
   - Acompanha relatórios e progresso

## 📂 Estrutura de Arquivos

- **Schema:** `prisma/schema.prisma` - Modelo Contract com campo `phone`
- **Migration:** `prisma/migrations/20260118210546_add_phone_to_contract/`
- **Formulário Criar:** `src/app/(app)/_components/add-contract-dialog.tsx`
- **Formulário Editar:** `src/app/(app)/_components/edit-contract-dialog.tsx`
- **Ações:** `src/app/(app)/_actions/create-contract.ts` e `update-contract.ts`
- **Gerenciamento Usuários:** `src/app/(app)/admin/users/`

## 🔄 Próximos Passos (Para Implementar)

As permissões baseadas em roles estão definidas, mas podem ser refinadas conforme necessário:
- Implementar verificações de permissão nas ações de criar/editar corretivas
- Implementar verificações nas ações de executar tarefas
- Adicionar validações para garantir que usuários só vejam/editem dados do seu contrato
