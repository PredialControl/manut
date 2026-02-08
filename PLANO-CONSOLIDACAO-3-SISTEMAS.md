# Plano de Consolidação: Manut + Chamados + App Ronda

## Análise Completa dos 3 Sistemas

### 1. Sistema MANUT (Atual - Prisma + PostgreSQL)

**Tabelas Principais:**
- `User` - Usuários com role e vinculação a contrato
- `Contract` - Contratos (equivalente a clientes/condomínios)
- `Building` → `Floor` → `Location` → `Asset` (Hierarquia de localização)
- `CorrectiveCall` - Chamados corretivos (OMC)
- `PreventiveTask` - Tarefas preventivas (OMP)
- `Execution` - Execuções de tarefas
- `Report` - Relatórios/laudos
- `Attachment` - Anexos/fotos
- `MaintenancePlan` - Planos de manutenção padrão
- `ConstructionItem` - Chamados da construtora

**Estrutura de Dados:**
- Hierarquia: Contract → Building → Floor → Location → Asset
- Usuários vinculados a um contrato único
- Sistema completo de manutenção preventiva e corretiva

---

### 2. Sistema CHAMADOS (Supabase - SQL Direto)

**Tabelas Principais:**
- `profiles` - Perfis de usuários
  - `id`, `name`, `email`, `role` (admin, building_admin, user)
  - `allowedBuildings` (array de IDs de prédios permitidos)
  - `turma` (classificação opcional)

- `buildings` - Prédios/Empreendimentos
  - 17 prédios cadastrados (Terra Brasilis, América do Sul, Central Park, etc.)
  - `id`, `name`, `address`

- `tickets` - Chamados/Ocorrências
  - `id`, `buildingId`, `userId`, `location`, `description`
  - `photoUrls` (array de URLs de fotos)
  - `status`: itens_apontados, em_andamento, improcedente, aguardando_vistoria, concluido, f_indevido
  - `deadline`, `reprogrammingDate`, `reprogrammingHistory`
  - `constructorReturn`, `externalTicketId`
  - `responsible`: 'Condomínio' ou 'Construtora'

- `push_subscriptions` - Assinaturas de notificações push

**Características:**
- Foco em gestão de chamados para construtoras
- Sistema de permissões por prédio (allowedBuildings)
- Histórico de reprogramações
- Notificações push
- Vinculação entre chamados internos e externos

---

### 3. Sistema APP RONDA (Supabase - SQL Direto)

**Tabelas Principais:**

**Módulo de Contratos:**
- `contratos` - Contratos de ronda
  - `id`, `nome`, `sindico`, `endereco`, `periodicidade`, `observacoes`

- `agenda` - Agendamento de rondas
  - `contrato_id`, `contrato_nome`, `endereco`
  - `dia_semana` (SEGUNDA-DOMINGO), `horario`
  - `ativo`, `recorrencia` (JSONB)

**Módulo de Rondas:**
- `rondas` - Registro de rondas realizadas
  - `id`, `nome`, `contrato`, `data`, `hora`, `responsavel`
  - `observacoes_gerais`

- `areas_tecnicas` - Áreas técnicas vistoriadas
  - `ronda_id`, `nome`, `status`, `contrato`, `endereco`
  - `data`, `hora`, `foto`, `observacoes`

- `fotos_ronda` - Fotos da ronda
  - `ronda_id`, `descricao`, `responsavel`, `url_foto`
  - `nome_arquivo`, `tamanho`, `tipo_mime`

- `outros_itens_corrigidos` - Outros itens corrigidos
  - `ronda_id`, `nome`, `descricao`, `local`
  - `tipo`, `prioridade`, `status`, `foto`

**Módulo de Relatórios de Pendências:**
- `relatorios_pendencias` - Relatórios principais
  - `id`, `contrato_id`, `titulo`
  - `capa_url`, `foto_localidade_url`
  - `data_inicio_vistoria`, `historico_visitas` (array)
  - `data_situacao_atual`

- `relatorio_secoes` - Seções do relatório (ex: VIII, IX, X)
  - `relatorio_id`, `ordem`, `titulo_principal`, `subtitulo`
  - `tem_subsecoes` (boolean)

- `relatorio_subsecoes` - Subseções (ex: VIII.1A, VIII.1B)
  - `secao_id`, `ordem`, `titulo`

- `relatorio_pendencias` - Itens de pendência
  - `secao_id`, `subsecao_id` (opcional)
  - `ordem`, `local`, `descricao`
  - `foto_url`, `foto_depois_url`

**Características:**
- Sistema de rondas e inspeções técnicas
- Gestão de agenda semanal
- Relatórios estruturados com seções/subseções
- Fotos antes/depois
- Histórico de visitas

---

## Estratégia de Consolidação

### Visão Geral

Consolidar os 3 sistemas em uma única aplicação **MANUT** com módulos integrados, mantendo:
- ✅ Todos os dados existentes
- ✅ Todos os contratos atuais
- ✅ Sistema de autenticação único
- ✅ Permissões granulares por módulo/contrato

### Arquitetura Proposta

```
MANUT (Sistema Unificado)
│
├── Módulo Core (já existe)
│   ├── Contratos
│   ├── Usuários e Permissões
│   ├── Predios/Pavimentos/Locais/Ativos
│   └── Manutenção Preventiva e Corretiva
│
├── Módulo Chamados (novo - integrado)
│   ├── Gestão de Tickets/Chamados
│   ├── Vinculação com Construtoras
│   ├── Status e Reprogramações
│   └── **INTEGRAÇÃO COM CORRETIVAS**
│
└── Módulo Rondas (novo)
    ├── Agendamento de Rondas
    ├── Registro de Vistorias
    ├── Áreas Técnicas
    └── Relatórios de Pendências
```

---

## Modelo de Dados Unificado

### 1. Sistema de Autenticação Único

**Modelo User (expandido):**
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  password      String
  role          String    // ADMIN, MANAGER, TECHNICIAN, CLIENT

  // Múltiplos contratos com permissões
  userContracts UserContract[]

  // Dados existentes
  executions    Execution[]
  tickets       Ticket[]      // Novo
  rondas        Ronda[]       // Novo

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model UserContract {
  id         String   @id @default(cuid())
  user       User     @relation(fields: [userId], references: [id])
  userId     String
  contract   Contract @relation(fields: [contractId], references: [id])
  contractId String

  // Permissões por módulo
  canAccessPreventive   Boolean @default(false)
  canAccessCorrective   Boolean @default(false)
  canAccessTickets      Boolean @default(false)  // Módulo Chamados
  canAccessRondas       Boolean @default(false)  // Módulo Rondas
  canAccessReports      Boolean @default(false)  // Relatórios de Pendências

  // Permissões específicas de buildings (para Chamados)
  allowedBuildings String[] // Array de IDs de prédios

  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())

  @@unique([userId, contractId])
}
```

### 2. Modelo Contract (expandido)

```prisma
model Contract {
  id        String    @id @default(cuid())
  name      String
  acronym   String?   @unique
  cnpj      String?
  address   String?
  sindico   String?
  phone     String?
  status    String?
  imageUrl  String?

  // Tipo de contrato (para diferenciar)
  type      String    // MAINTENANCE, RONDA, MIXED

  // Configurações específicas para rondas
  periodicidade String? // SEMANAL, QUINZENAL, MENSAL

  deleted   Boolean   @default(false)

  // Relações existentes
  userContracts     UserContract[]
  buildings         Building[]
  constructionItems ConstructionItem[]

  // Novas relações
  tickets           Ticket[]      // Chamados
  rondas            Ronda[]       // Rondas
  relatorios        RelatorioPendencia[] // Relatórios
  agendas           AgendaRonda[] // Agendamentos

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([deleted])
  @@index([type])
}
```

### 3. Módulo Chamados (Novo)

```prisma
// Tickets/Chamados (integra com CorrectiveCall)
model Ticket {
  id                String   @id @default(cuid())
  number            String?  @unique // Número externo

  building          Building @relation(fields: [buildingId], references: [id])
  buildingId        String

  user              User     @relation(fields: [userId], references: [id])
  userId            String

  contract          Contract @relation(fields: [contractId], references: [id])
  contractId        String

  location          String   // Local específico
  description       String
  photoUrls         String[] // Array de URLs

  status            String   // itens_apontados, em_andamento, improcedente,
                             // aguardando_vistoria, concluido, f_indevido

  priority          String?  // BAIXA, MEDIA, ALTA, URGENTE

  responsible       String?  // Condomínio, Construtora

  deadline          DateTime?
  reprogrammingDate DateTime?
  reprogrammingHistory String? // JSON com histórico

  constructorReturn String?  // Feedback da construtora

  // INTEGRAÇÃO COM CORRETIVAS
  correctiveCall    CorrectiveCall? @relation(fields: [correctiveCallId], references: [id])
  correctiveCallId  String?

  isRegistered      Boolean @default(false) // Indica se virou OMC

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([contractId])
  @@index([buildingId])
  @@index([status])
  @@index([userId])
}
```

### 4. Módulo Rondas (Novo)

```prisma
// Agendamento de Rondas
model AgendaRonda {
  id            String   @id @default(cuid())

  contract      Contract @relation(fields: [contractId], references: [id])
  contractId    String

  diaSemana     String   // SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO
  horario       DateTime @db.Time

  endereco      String
  observacoes   String?

  ativo         Boolean  @default(true)
  recorrencia   String?  // JSON com regras de recorrência

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([contractId])
  @@index([ativo])
}

// Rondas Realizadas
model Ronda {
  id                 String   @id @default(cuid())
  nome               String

  contract           Contract @relation(fields: [contractId], references: [id])
  contractId         String

  data               DateTime
  hora               DateTime @db.Time

  responsavel        User?    @relation(fields: [responsavelId], references: [id])
  responsavelId      String?

  observacoesGerais  String?

  // Relações
  areasTecnicas      AreaTecnica[]
  fotosRonda         FotoRonda[]
  outrosItens        OutroItemCorrigido[]

  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  @@index([contractId])
  @@index([data])
}

model AreaTecnica {
  id          String   @id @default(cuid())

  ronda       Ronda    @relation(fields: [rondaId], references: [id], onDelete: Cascade)
  rondaId     String

  nome        String
  status      String   // ATIVO, INATIVO
  endereco    String
  data        DateTime
  hora        DateTime @db.Time
  foto        String?
  observacoes String?

  createdAt   DateTime @default(now())

  @@index([rondaId])
}

model FotoRonda {
  id            String   @id @default(cuid())

  ronda         Ronda    @relation(fields: [rondaId], references: [id], onDelete: Cascade)
  rondaId       String

  descricao     String
  responsavel   String
  urlFoto       String
  nomeArquivo   String
  tamanho       Int
  tipoMime      String

  local         String?
  pendencia     String?  // BAIXA, MEDIA, ALTA
  especialidade String?
  observacoes   String?

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([rondaId])
}

model OutroItemCorrigido {
  id          String   @id @default(cuid())

  ronda       Ronda    @relation(fields: [rondaId], references: [id], onDelete: Cascade)
  rondaId     String

  nome        String
  descricao   String
  local       String
  tipo        String
  prioridade  String
  status      String
  foto        String?
  observacoes String?

  createdAt   DateTime @default(now())

  @@index([rondaId])
}

// Relatórios de Pendências
model RelatorioPendencia {
  id                  String   @id @default(cuid())

  contract            Contract @relation(fields: [contractId], references: [id])
  contractId          String

  titulo              String
  capaUrl             String?
  fotoLocalidadeUrl   String?
  dataInicioVistoria  String?
  historicoVisitas    String[] // Array de datas
  dataSituacaoAtual   String?

  secoes              RelatorioSecao[]

  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@index([contractId])
}

model RelatorioSecao {
  id              String   @id @default(cuid())

  relatorio       RelatorioPendencia @relation(fields: [relatorioId], references: [id], onDelete: Cascade)
  relatorioId     String

  ordem           Int
  tituloPrincipal String
  subtitulo       String
  temSubsecoes    Boolean  @default(false)

  subsecoes       RelatorioSubsecao[]
  pendencias      RelatorioPendenciaItem[]

  createdAt       DateTime @default(now())

  @@index([relatorioId])
}

model RelatorioSubsecao {
  id        String   @id @default(cuid())

  secao     RelatorioSecao @relation(fields: [secaoId], references: [id], onDelete: Cascade)
  secaoId   String

  ordem     Int
  titulo    String

  pendencias RelatorioPendenciaItem[]

  createdAt DateTime @default(now())

  @@index([secaoId])
}

model RelatorioPendenciaItem {
  id            String   @id @default(cuid())

  secao         RelatorioSecao @relation(fields: [secaoId], references: [id], onDelete: Cascade)
  secaoId       String

  subsecao      RelatorioSubsecao? @relation(fields: [subsecaoId], references: [id], onDelete: Cascade)
  subsecaoId    String?

  ordem         Int
  local         String
  descricao     String
  fotoUrl       String?
  fotoDepoisUrl String?

  createdAt     DateTime @default(now())

  @@index([secaoId])
  @@index([subsecaoId])
}
```

### 5. CorrectiveCall Atualizado

```prisma
model CorrectiveCall {
  id          String     @id @default(cuid())
  omcNumber   String?    @unique
  title       String
  description String?
  priority    String
  status      String
  asset       Asset?     @relation(fields: [assetId], references: [id])
  assetId     String?

  // NOVA RELAÇÃO COM TICKETS
  originTicket   Ticket?  // Ticket que originou essa OMC

  executions  Execution[]
  attachments Attachment[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}
```

---

## Plano de Migração de Dados

### Fase 1: Preparação do Schema

1. **Adicionar novos modelos ao schema.prisma**
   - UserContract
   - Ticket
   - AgendaRonda, Ronda, AreaTecnica, FotoRonda, OutroItemCorrigido
   - RelatorioPendencia, RelatorioSecao, RelatorioSubsecao, RelatorioPendenciaItem

2. **Atualizar modelos existentes**
   - User: adicionar relação userContracts
   - Contract: adicionar type, periodicidade e novas relações
   - CorrectiveCall: adicionar relação com Ticket
   - Building: adicionar relação com Ticket

3. **Executar migration**
   ```bash
   npx prisma migrate dev --name consolidacao_3_sistemas
   ```

### Fase 2: Migração de Dados - Chamados

**Script de Migração:**

```typescript
// scripts/migrate-chamados.ts

import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()
const supabase = createClient(SUPABASE_URL_CHAMADOS, SUPABASE_KEY)

async function migrateChamados() {
  // 1. Migrar Buildings (os 17 prédios)
  const { data: buildings } = await supabase.from('buildings').select('*')

  // Criar um contrato "master" para Chamados ou vincular a contratos existentes
  const chamadosContract = await prisma.contract.create({
    data: {
      name: 'Sistema de Chamados - Construtoras',
      acronym: 'CHAMADOS',
      type: 'MAINTENANCE',
      status: 'ATIVO'
    }
  })

  for (const building of buildings) {
    await prisma.building.create({
      data: {
        id: building.id,
        name: building.name,
        contractId: chamadosContract.id
      }
    })
  }

  // 2. Migrar Users/Profiles
  const { data: profiles } = await supabase.from('profiles').select('*')

  for (const profile of profiles) {
    const user = await prisma.user.create({
      data: {
        email: profile.email,
        name: profile.name,
        password: 'TEMP_PASSWORD', // Forçar reset na primeira login
        role: profile.role.toUpperCase()
      }
    })

    // Criar UserContract com permissões
    await prisma.userContract.create({
      data: {
        userId: user.id,
        contractId: chamadosContract.id,
        canAccessTickets: true,
        canAccessCorrective: profile.role === 'admin',
        allowedBuildings: profile.allowedBuildings || []
      }
    })
  }

  // 3. Migrar Tickets
  const { data: tickets } = await supabase.from('tickets').select('*')

  for (const ticket of tickets) {
    await prisma.ticket.create({
      data: {
        id: ticket.id,
        number: ticket.externalTicketId,
        buildingId: ticket.buildingId,
        userId: ticket.userId,
        contractId: chamadosContract.id,
        location: ticket.location,
        description: ticket.description,
        photoUrls: ticket.photoUrls || [],
        status: ticket.status,
        responsible: ticket.responsible,
        deadline: ticket.deadline ? new Date(ticket.deadline) : null,
        reprogrammingDate: ticket.reprogrammingDate ? new Date(ticket.reprogrammingDate) : null,
        reprogrammingHistory: JSON.stringify(ticket.reprogrammingHistory || []),
        constructorReturn: ticket.constructorReturn,
        isRegistered: ticket.isRegistered || false,
        createdAt: new Date(ticket.createdAt)
      }
    })
  }

  console.log('✅ Migração de Chamados concluída!')
}
```

### Fase 3: Migração de Dados - App Ronda

**Script de Migração:**

```typescript
// scripts/migrate-rondas.ts

async function migrateRondas() {
  const supabase = createClient(SUPABASE_URL_RONDAS, SUPABASE_KEY)

  // 1. Migrar Contratos
  const { data: contratos } = await supabase.from('contratos').select('*')

  const contratoMap = new Map()

  for (const contrato of contratos) {
    const newContract = await prisma.contract.create({
      data: {
        name: contrato.nome,
        sindico: contrato.sindico,
        address: contrato.endereco,
        periodicidade: contrato.periodicidade,
        type: 'RONDA',
        status: 'ATIVO'
      }
    })
    contratoMap.set(contrato.id, newContract.id)
  }

  // 2. Migrar Agenda
  const { data: agendas } = await supabase.from('agenda').select('*')

  for (const agenda of agendas) {
    await prisma.agendaRonda.create({
      data: {
        contractId: contratoMap.get(agenda.contrato_id),
        diaSemana: agenda.dia_semana,
        horario: new Date(`1970-01-01T${agenda.horario}`),
        endereco: agenda.endereco,
        observacoes: agenda.observacoes,
        ativo: agenda.ativo,
        recorrencia: JSON.stringify(agenda.recorrencia)
      }
    })
  }

  // 3. Migrar Rondas
  const { data: rondas } = await supabase.from('rondas').select('*')

  const rondaMap = new Map()

  for (const ronda of rondas) {
    const newRonda = await prisma.ronda.create({
      data: {
        nome: ronda.nome,
        contractId: contratoMap.get(ronda.contrato), // Buscar pelo nome
        data: new Date(ronda.data),
        hora: new Date(`1970-01-01T${ronda.hora}`),
        observacoesGerais: ronda.observacoes_gerais
      }
    })
    rondaMap.set(ronda.id, newRonda.id)
  }

  // 4. Migrar Áreas Técnicas
  const { data: areas } = await supabase.from('areas_tecnicas').select('*')

  for (const area of areas) {
    await prisma.areaTecnica.create({
      data: {
        rondaId: rondaMap.get(area.ronda_id),
        nome: area.nome,
        status: area.status,
        endereco: area.endereco,
        data: new Date(area.data),
        hora: new Date(`1970-01-01T${area.hora}`),
        foto: area.foto,
        observacoes: area.observacoes
      }
    })
  }

  // 5. Migrar Fotos da Ronda
  const { data: fotos } = await supabase.from('fotos_ronda').select('*')

  for (const foto of fotos) {
    await prisma.fotoRonda.create({
      data: {
        rondaId: rondaMap.get(foto.ronda_id),
        descricao: foto.descricao,
        responsavel: foto.responsavel,
        urlFoto: foto.url_foto,
        nomeArquivo: foto.nome_arquivo,
        tamanho: foto.tamanho,
        tipoMime: foto.tipo_mime
      }
    })
  }

  // 6. Migrar Outros Itens Corrigidos
  const { data: itens } = await supabase.from('outros_itens_corrigidos').select('*')

  for (const item of itens) {
    await prisma.outroItemCorrigido.create({
      data: {
        rondaId: rondaMap.get(item.ronda_id),
        nome: item.nome,
        descricao: item.descricao,
        local: item.local,
        tipo: item.tipo,
        prioridade: item.prioridade,
        status: item.status,
        foto: item.foto,
        observacoes: item.observacoes
      }
    })
  }

  // 7. Migrar Relatórios de Pendências
  const { data: relatorios } = await supabase
    .from('relatorios_pendencias')
    .select(`
      *,
      relatorio_secoes (
        *,
        relatorio_subsecoes (*),
        relatorio_pendencias (*)
      )
    `)

  for (const relatorio of relatorios) {
    const newRelatorio = await prisma.relatorioPendencia.create({
      data: {
        contractId: contratoMap.get(relatorio.contrato_id),
        titulo: relatorio.titulo,
        capaUrl: relatorio.capa_url,
        fotoLocalidadeUrl: relatorio.foto_localidade_url,
        dataInicioVistoria: relatorio.data_inicio_vistoria,
        historicoVisitas: relatorio.historico_visitas || [],
        dataSituacaoAtual: relatorio.data_situacao_atual
      }
    })

    // Migrar seções
    for (const secao of relatorio.relatorio_secoes) {
      const newSecao = await prisma.relatorioSecao.create({
        data: {
          relatorioId: newRelatorio.id,
          ordem: secao.ordem,
          tituloPrincipal: secao.titulo_principal,
          subtitulo: secao.subtitulo,
          temSubsecoes: secao.tem_subsecoes || false
        }
      })

      // Migrar subseções (se houver)
      if (secao.relatorio_subsecoes) {
        for (const subsecao of secao.relatorio_subsecoes) {
          await prisma.relatorioSubsecao.create({
            data: {
              secaoId: newSecao.id,
              ordem: subsecao.ordem,
              titulo: subsecao.titulo
            }
          })
        }
      }

      // Migrar pendências
      if (secao.relatorio_pendencias) {
        for (const pend of secao.relatorio_pendencias) {
          await prisma.relatorioPendenciaItem.create({
            data: {
              secaoId: newSecao.id,
              subsecaoId: pend.subsecao_id,
              ordem: pend.ordem,
              local: pend.local,
              descricao: pend.descricao,
              fotoUrl: pend.foto_url,
              fotoDepoisUrl: pend.foto_depois_url
            }
          })
        }
      }
    }
  }

  console.log('✅ Migração de App Ronda concluída!')
}
```

---

## Integração Chamados ↔ Corretivas

### Fluxo de Integração

**1. Ticket → OMC (Chamado vira Corretiva)**

```typescript
// app/api/tickets/[id]/convert-to-omc/route.ts

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id },
    include: { building: { include: { floors: true } } }
  })

  // Criar OMC a partir do Ticket
  const omc = await prisma.correctiveCall.create({
    data: {
      title: `Chamado #${ticket.number} - ${ticket.description.substring(0, 50)}`,
      description: ticket.description,
      priority: ticket.priority || 'MEDIA',
      status: 'ABERTO',
      // Vincular a um asset se possível ou deixar sem asset
      assetId: null // Usuário escolhe depois
    }
  })

  // Atualizar ticket para indicar que foi registrado
  await prisma.ticket.update({
    where: { id: ticket.id },
    data: {
      isRegistered: true,
      correctiveCallId: omc.id
    }
  })

  return Response.json({ success: true, omcId: omc.id })
}
```

**2. Interface Unificada**

Na tela de Chamados, adicionar botão "Converter para OMC" que:
- Cria a OMC automaticamente
- Vincula o ticket à OMC
- Redireciona para edição da OMC (para vincular ao ativo)
- Mantém referência bidirecional

**3. Visualização Integrada**

- Na tela de OMC, mostrar se ela originou de um ticket
- Na tela de Tickets, mostrar se já virou OMC (com link)

---

## Sistema de Permissões

### Níveis de Acesso

**1. ADMIN (Super Admin)**
- Acesso total a todos contratos e módulos
- Gerencia usuários e permissões

**2. MANAGER (Gerente de Contrato)**
- Acesso completo ao(s) contrato(s) vinculado(s)
- Pode ver todos os módulos do contrato
- Pode criar/editar dentro do contrato

**3. TECHNICIAN (Técnico)**
- Acesso específico por módulo
- Pode executar tarefas, criar chamados, realizar rondas
- Não pode alterar configurações

**4. CLIENT (Cliente/Síndico)**
- Visualização apenas
- Pode ver relatórios e status
- Pode criar chamados (se tiver permissão)

### Controle de Acesso por Módulo

```typescript
// middleware/checkPermissions.ts

export function checkModuleAccess(module: string) {
  return async (req: Request) => {
    const session = await getSession(req)

    // Admin sempre tem acesso
    if (session.user.role === 'ADMIN') return true

    // Verificar permissão específica
    const userContract = await prisma.userContract.findFirst({
      where: {
        userId: session.user.id,
        contractId: req.params.contractId,
        isActive: true
      }
    })

    if (!userContract) return false

    switch (module) {
      case 'preventive':
        return userContract.canAccessPreventive
      case 'corrective':
        return userContract.canAccessCorrective
      case 'tickets':
        return userContract.canAccessTickets
      case 'rondas':
        return userContract.canAccessRondas
      case 'reports':
        return userContract.canAccessReports
      default:
        return false
    }
  }
}
```

### Interface de Gestão de Permissões

```typescript
// Tela: /admin/users/[id]/permissions

// Exemplo de UI:
<UserPermissionsForm>
  <ContractSelector contract={contract}>
    <h3>{contract.name}</h3>

    <ModulePermissions>
      <Checkbox name="canAccessPreventive">Manutenção Preventiva</Checkbox>
      <Checkbox name="canAccessCorrective">Manutenção Corretiva</Checkbox>
      <Checkbox name="canAccessTickets">Chamados</Checkbox>
      <Checkbox name="canAccessRondas">Rondas</Checkbox>
      <Checkbox name="canAccessReports">Relatórios de Pendências</Checkbox>
    </ModulePermissions>

    {canAccessTickets && (
      <BuildingSelector>
        <h4>Prédios Permitidos (para Chamados)</h4>
        {buildings.map(b => (
          <Checkbox key={b.id} value={b.id}>{b.name}</Checkbox>
        ))}
      </BuildingSelector>
    )}
  </ContractSelector>
</UserPermissionsForm>
```

---

## Estrutura de Menu/Navegação

```
Dashboard
│
├── Contratos
│   ├── Lista de Contratos
│   ├── Detalhes do Contrato
│   └── Configurações
│
├── Usuários
│   ├── Lista de Usuários
│   ├── Permissões por Usuário
│   └── Novo Usuário
│
├── Manutenção (módulo existente)
│   ├── Preventivas (OMP)
│   ├── Corretivas (OMC)
│   ├── Predios/Pavimentos/Locais
│   ├── Ativos
│   └── Itens de Construção
│
├── Chamados (novo módulo)
│   ├── Lista de Tickets
│   ├── Criar Ticket
│   ├── Converter para OMC 🔄
│   └── Relatório de Chamados
│
└── Rondas (novo módulo)
    ├── Agenda de Rondas
    ├── Registrar Ronda
    ├── Áreas Técnicas
    ├── Relatórios de Pendências
    │   ├── Lista de Relatórios
    │   ├── Criar Relatório
    │   └── Exportar PDF
    └── Histórico de Visitas
```

---

## Estimativa de Implementação

### Complexidade por Fase

**FASE 1: Preparação do Schema (1-2 dias)**
- ✅ Baixa complexidade
- Criar novos modelos no Prisma
- Executar migrations
- Testar conexões

**FASE 2: Migração Chamados (2-3 dias)**
- ⚠️ Média complexidade
- Script de migração de dados
- Validação de integridade
- Mapeamento de usuários

**FASE 3: Migração Rondas (3-4 dias)**
- ⚠️ Média-Alta complexidade
- Maior volume de dados
- Estrutura mais complexa (seções/subseções)
- Migração de fotos/arquivos

**FASE 4: Interface Chamados (3-5 dias)**
- 🔴 Alta complexidade
- CRUD completo de tickets
- Interface de conversão para OMC
- Sistema de permissões por building

**FASE 5: Interface Rondas (5-7 dias)**
- 🔴 Alta complexidade
- Interface de agendamento
- Registro de rondas
- Criação de relatórios estruturados
- Geração de PDFs

**FASE 6: Sistema de Permissões (2-3 dias)**
- ⚠️ Média complexidade
- Middleware de autenticação
- Interface de gestão de permissões
- Testes de acesso

**FASE 7: Integração e Testes (3-4 dias)**
- ⚠️ Média complexidade
- Testes de integração
- Ajustes finais
- Documentação

**TOTAL: 19-28 dias de desenvolvimento**

---

## Próximos Passos

### Decisões Necessárias

1. **Estrutura de Contratos**
   - ❓ Os 17 prédios de Chamados pertencem a um único contrato ou são contratos separados?
   - ❓ Contratos de Ronda já existem no sistema Manut ou são todos novos?

2. **Usuários**
   - ❓ Forçar reset de senha na primeira migração?
   - ❓ Manter emails duplicados entre sistemas ou unificar?

3. **Fotos e Arquivos**
   - ❓ Manter no Supabase Storage ou migrar para outro serviço?
   - ❓ Estratégia de backup das imagens?

4. **Priorização**
   - ❓ Qual módulo implementar primeiro: Chamados ou Rondas?
   - ❓ Implementar tudo de uma vez ou por fases com deploy gradual?

### Recomendação

**Abordagem Recomendada: Implementação Faseada**

1. **Fase 1**: Schema + Migração Chamados (mais simples, menos dados)
2. **Fase 2**: Interface Chamados + Integração OMC
3. **Fase 3**: Migração Rondas
4. **Fase 4**: Interface Rondas
5. **Fase 5**: Sistema de Permissões Completo
6. **Fase 6**: Polimento e Testes Finais

Isso permite:
- ✅ Validar a arquitetura com o módulo mais simples primeiro
- ✅ Deploy incremental (menos risco)
- ✅ Feedback rápido do usuário
- ✅ Ajustes no meio do caminho se necessário

---

## Conclusão

A consolidação dos 3 sistemas em um único MANUT é **PERFEITAMENTE VIÁVEL** e trará grandes benefícios:

✅ **Login único** para todos os sistemas
✅ **Permissões granulares** por contrato e módulo
✅ **Integração direta** entre Chamados e Corretivas
✅ **Manutenção unificada** de código
✅ **Experiência consistente** para o usuário
✅ **Todos os dados preservados**

O sistema resultante será mais robusto, escalável e fácil de manter do que 3 sistemas separados.
