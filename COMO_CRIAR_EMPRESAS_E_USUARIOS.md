# 🚀 Como Criar Empresas e Usuários - Guia Rápido

## 📋 FLUXO COMPLETO

### PASSO 1: Login como ADMIN

**Login:**
- Email: `admin@manut.app`
- Senha: `password123`

---

### PASSO 2: Criar uma Nova Empresa (Contrato)

1. Na **página inicial** (`/`), clique no botão **"Novo Contrato"** (canto superior direito)
2. Preencha o formulário:
   - **Nome da Empresa** (obrigatório)
   - **Sigla** (ex: LONE, BRASILIA) - obrigatório e deve ser única
   - **CNPJ** (opcional)
   - **Endereço** (opcional)
   - **Gestor** (opcional - nome do gestor)
   - **Telefone** (opcional)
   - **Status** (Implantado / Em implantação)
   - **Logo/Imagem** (opcional)
3. Clique em **"Salvar Contrato"**

✅ **Empresa criada!**

---

### PASSO 3: Criar o GESTOR da Empresa

1. Clique no menu **"Gerenciar Usuários"** no sidebar (só aparece para ADMIN)
2. Clique no botão **"Novo Usuário"**
3. Preencha:
   - **Nome:** Nome do gestor
   - **Email:** Email do gestor
   - **Senha:** Senha inicial
   - **Função:** Selecione **"Gestor"**
   - **Contrato:** Selecione a empresa que você acabou de criar
4. Clique em **"Salvar"**

✅ **Gestor criado e associado à empresa!**

---

### PASSO 4: Gestor Cria Usuários para a Empresa

1. O **GESTOR** faz login com o email e senha criados
2. **Clica no card da empresa** na página inicial
3. Dentro do contrato, aparece o menu **"Usuários do Contrato"** no sidebar
4. Clica em **"Novo Usuário"**
5. Preencha:
   - **Nome:** Nome do usuário
   - **Email:** Email do usuário
   - **Senha:** Senha inicial
   - **Função:** Selecione **"Manutenção"** ou **"Acompanhamento"**
6. Clique em **"Salvar"**

✅ **Usuário criado para a empresa!**

---

## 📍 ONDE CADASTRAR

### ADMIN pode:
- ✅ Criar **empresas/contratos** → Página inicial, botão "Novo Contrato"
- ✅ Criar **qualquer tipo de usuário** → Menu "Gerenciar Usuários"
- ✅ Ver **todos os contratos e usuários**

### GESTOR pode:
- ❌ **NÃO pode criar empresas** (só ADMIN)
- ✅ Criar **Manutenção e Acompanhamento** → Menu "Usuários do Contrato" (dentro do contrato)
- ❌ **NÃO pode criar ADMIN ou outro GESTOR**
- ✅ Ver apenas **seu próprio contrato**

---

## 🔑 RESUMO RÁPIDO

| O que fazer | Onde fazer | Quem pode fazer |
|------------|------------|-----------------|
| Criar Empresa | Página inicial → "Novo Contrato" | ADMIN |
| Criar GESTOR | "Gerenciar Usuários" → "Novo Usuário" | ADMIN |
| Criar MANUTENCAO/ACOMPANHAMENTO | Dentro do contrato → "Usuários do Contrato" | GESTOR |

---

## ⚠️ IMPORTANTE

- **ADMIN** cria empresas e gestores
- **GESTOR** gerencia apenas os usuários da sua própria empresa
- Cada empresa precisa ter pelo menos um GESTOR
- O GESTOR é criado pelo ADMIN e associado a uma empresa específica

---

## 🎯 EXEMPLO PRÁTICO

**Cenário:** Criar a empresa "Living One" com gestor e 2 usuários de manutenção

1. **ADMIN** cria empresa "Living One"
2. **ADMIN** cria usuário "João Silva" como GESTOR da "Living One"
3. **João Silva** (GESTOR) faz login
4. **João Silva** entra no contrato "Living One"
5. **João Silva** cria 2 usuários "Manutenção" pelo menu "Usuários do Contrato"

✅ **Pronto!** Empresa cadastrada com gestor e usuários funcionando!
