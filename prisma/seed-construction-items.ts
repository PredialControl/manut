import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedConstructionItems() {
  // Buscar um contrato existente ou usar um ID específico
  const contract = await prisma.contract.findFirst();
  
  if (!contract) {
    console.log('Nenhum contrato encontrado. Crie um contrato primeiro.');
    return;
  }

  console.log(`Adicionando itens da construtora para o contrato: ${contract.name}`);

  const constructionItems = [
    {
      number: "72246",
      description: "Fissura no muro do hall de entrada social do residencial",
      status: "EM_ANDAMENTO",
      openedAt: new Date("2025-05-14"),
      deadline: new Date("2025-07-22"),
      feedback: "Atualização 30/06 - Mitre iniciou o tratamento = = era 04/07/2025",
      contractId: contract.id,
    },
    {
      number: "71187",
      description: "Piso do salão de festas do residencial com caimento inadequado ocasionando o acúmulo de água da chuva",
      status: "EM_ANDAMENTO",
      openedAt: new Date("2025-04-10"),
      deadline: new Date("2025-08-21"),
      feedback: "Prazo de 10 dias - Perdeu o prazo era 21/07/2025",
      contractId: contract.id,
    },
    {
      number: "71315",
      description: "A sala da governança está com vazamento de água",
      status: "EM_ANDAMENTO",
      openedAt: new Date("2025-04-30"),
      deadline: new Date("2025-08-08"),
      feedback: "Será tratado em conjunto com a infiltração do centro de medição",
      contractId: contract.id,
    },
    {
      number: "73103",
      description: "Infiltração sala técnica quadros OGBT - QUADRO COM UMIDADE",
      status: "EM_ANDAMENTO",
      openedAt: new Date("2025-06-09"),
      deadline: new Date("2025-08-30"),
      feedback: "Era - 16/06/2025 - Será feito injeção até 30/08 - o quadro será feito manutenção doa 09/07",
      contractId: contract.id,
    },
    {
      number: "74521",
      description: "Problema na tubulação do sistema de ar condicionado do salão de festas",
      status: "AGUARDANDO_VISTORIA",
      openedAt: new Date("2025-07-15"),
      deadline: new Date("2025-09-10"),
      feedback: "Aguardando vistoria técnica para definir solução",
      contractId: contract.id,
    },
    {
      number: "74832",
      description: "Rachadura na parede externa do bloco B",
      status: "FINALIZADO",
      openedAt: new Date("2025-06-01"),
      deadline: new Date("2025-07-01"),
      feedback: "Concluído em 28/06/2025 - Reparo realizado com sucesso",
      contractId: contract.id,
    },
    {
      number: "75104",
      description: "Defeito no portão eletrônico da garagem",
      status: "CONCLUIDO",
      openedAt: new Date("2025-07-20"),
      deadline: new Date("2025-08-15"),
      feedback: "Manutenção concluída - Motor substituído",
      contractId: contract.id,
    },
    {
      number: "75298",
      description: "Infiltração no teto da área comum do térreo",
      status: "IMPROCEDENTE",
      openedAt: new Date("2025-07-10"),
      deadline: null,
      feedback: "Análise técnica concluiu que não há defeito construtivo",
      contractId: contract.id,
    },
  ];

  try {
    // Limpar itens existentes (opcional)
    console.log('Limpando itens existentes...');
    await prisma.constructionItem.deleteMany({
      where: { contractId: contract.id }
    });

    // Inserir novos itens
    console.log('Inserindo novos itens...');
    for (const item of constructionItems) {
      await prisma.constructionItem.create({
        data: item,
      });
      console.log(`✓ Item ${item.number} criado`);
    }

    console.log(`\n🎉 ${constructionItems.length} itens da construtora foram adicionados com sucesso!`);
    
    // Mostrar estatísticas
    const stats = {
      total: constructionItems.length,
      emAndamento: constructionItems.filter(item => item.status === 'EM_ANDAMENTO').length,
      finalizado: constructionItems.filter(item => item.status === 'FINALIZADO').length,
      concluido: constructionItems.filter(item => item.status === 'CONCLUIDO').length,
      aguardandoVistoria: constructionItems.filter(item => item.status === 'AGUARDANDO_VISTORIA').length,
      improcedente: constructionItems.filter(item => item.status === 'IMPROCEDENTE').length,
    };

    console.log('\n📊 Estatísticas:');
    console.log(`- Total: ${stats.total}`);
    console.log(`- Em andamento: ${stats.emAndamento}`);
    console.log(`- Finalizado: ${stats.finalizado}`);
    console.log(`- Concluído: ${stats.concluido}`);
    console.log(`- Aguardando vistoria: ${stats.aguardandoVistoria}`);
    console.log(`- Improcedente: ${stats.improcedente}`);

  } catch (error) {
    console.error('Erro ao inserir itens da construtora:', error);
  }
}

async function main() {
  try {
    await seedConstructionItems();
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 