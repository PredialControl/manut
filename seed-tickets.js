const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de dados de teste para Chamados...');

  // 1. Criar usuário admin de teste
  const hashedPassword = await bcrypt.hash('123456', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@teste.com' },
    update: {},
    create: {
      email: 'admin@teste.com',
      name: 'Administrador Teste',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✓ Usuário criado:', user.email);

  // 2. Criar contrato de teste
  const contract = await prisma.contract.upsert({
    where: { id: 'contract-teste-001' },
    update: {},
    create: {
      id: 'contract-teste-001',
      name: 'Contrato de Teste - Chamados',
      type: 'MAINTENANCE',
      deleted: false,
    },
  });
  console.log('✓ Contrato criado:', contract.name);

  // 3. Criar prédios de teste
  const buildings = await Promise.all([
    prisma.building.upsert({
      where: { id: 'building-teste-001' },
      update: {},
      create: {
        id: 'building-teste-001',
        name: 'Edifício Solar',
        contractId: contract.id,
        address: 'Rua das Flores, 123',
      },
    }),
    prisma.building.upsert({
      where: { id: 'building-teste-002' },
      update: {},
      create: {
        id: 'building-teste-002',
        name: 'Residencial Vista Mar',
        contractId: contract.id,
        address: 'Av. Beira Mar, 456',
      },
    }),
    prisma.building.upsert({
      where: { id: 'building-teste-003' },
      update: {},
      create: {
        id: 'building-teste-003',
        name: 'Condomínio Jardim Paulista',
        contractId: contract.id,
        address: 'Rua Augusta, 789',
      },
    }),
  ]);
  console.log('✓ Prédios criados:', buildings.length);

  // 4. Criar chamados de teste
  const tickets = await Promise.all([
    // Chamado 1 - Itens Apontados
    prisma.ticket.create({
      data: {
        number: 'CH-2024-001',
        buildingId: buildings[0].id,
        userId: user.id,
        contractId: contract.id,
        location: 'Hall de Entrada',
        description: 'Piso quebrado próximo à recepção',
        photoUrls: [],
        status: 'itens_apontados',
        priority: 'ALTA',
        responsible: 'Construtora',
        deadline: new Date('2024-02-15'),
      },
    }),
    // Chamado 2 - Em Andamento
    prisma.ticket.create({
      data: {
        number: 'CH-2024-002',
        buildingId: buildings[0].id,
        userId: user.id,
        contractId: contract.id,
        location: 'Garagem Subsolo 2',
        description: 'Infiltração na parede lateral',
        photoUrls: [],
        status: 'em_andamento',
        priority: 'URGENTE',
        responsible: 'Construtora',
        deadline: new Date('2024-02-10'),
      },
    }),
    // Chamado 3 - Aguardando Vistoria
    prisma.ticket.create({
      data: {
        number: 'CH-2024-003',
        buildingId: buildings[1].id,
        userId: user.id,
        contractId: contract.id,
        location: 'Apartamento 501',
        description: 'Porta da sacada não fecha corretamente',
        photoUrls: [],
        status: 'aguardando_vistoria',
        priority: 'MEDIA',
        responsible: 'Condomínio',
        deadline: new Date('2024-02-20'),
      },
    }),
    // Chamado 4 - Concluído
    prisma.ticket.create({
      data: {
        number: 'CH-2024-004',
        buildingId: buildings[1].id,
        userId: user.id,
        contractId: contract.id,
        location: 'Área de Lazer',
        description: 'Lâmpada queimada na piscina',
        photoUrls: [],
        status: 'concluido',
        priority: 'BAIXA',
        responsible: 'Condomínio',
      },
    }),
    // Chamado 5 - Improcedente
    prisma.ticket.create({
      data: {
        number: 'CH-2024-005',
        buildingId: buildings[2].id,
        userId: user.id,
        contractId: contract.id,
        location: 'Apartamento 302',
        description: 'Reclamação de barulho - não procede',
        photoUrls: [],
        status: 'improcedente',
        priority: 'BAIXA',
        responsible: 'Condomínio',
      },
    }),
    // Chamado 6 - Mais um em andamento
    prisma.ticket.create({
      data: {
        number: 'CH-2024-006',
        buildingId: buildings[2].id,
        userId: user.id,
        contractId: contract.id,
        location: 'Elevador 1',
        description: 'Porta do elevador com ruído ao abrir',
        photoUrls: [],
        status: 'em_andamento',
        priority: 'ALTA',
        responsible: 'Construtora',
        deadline: new Date('2024-02-12'),
      },
    }),
    // Chamado 7 - Itens apontados
    prisma.ticket.create({
      data: {
        number: 'CH-2024-007',
        buildingId: buildings[0].id,
        userId: user.id,
        contractId: contract.id,
        location: 'Salão de Festas',
        description: 'Tomadas sem tampa de proteção',
        photoUrls: [],
        status: 'itens_apontados',
        priority: 'MEDIA',
        responsible: 'Construtora',
        deadline: new Date('2024-02-18'),
      },
    }),
  ]);
  console.log('✓ Chamados criados:', tickets.length);

  console.log('\n✅ Seed concluído com sucesso!\n');
  console.log('📋 Dados de acesso:');
  console.log('   Email: admin@teste.com');
  console.log('   Senha: 123456');
  console.log('   Contrato: Contrato de Teste - Chamados');
  console.log('\n📊 Dados criados:');
  console.log(`   - ${buildings.length} prédios`);
  console.log(`   - ${tickets.length} chamados`);
  console.log('   - Status: 2 itens apontados, 2 em andamento, 1 aguardando vistoria, 1 concluído, 1 improcedente');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
