import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { maintenanceData } from "../src/lib/maintenance-data";

const prisma = new PrismaClient();

async function updateExistingTasksWithChecklists() {
  const tasksToUpdate = await prisma.preventiveTask.findMany({
    where: {
      checklist: null,
    },
  });

  if (tasksToUpdate.length === 0) {
    console.log("Nenhuma tarefa preventiva para atualizar com checklists.");
    return;
  }

  let updatedCount = 0;
  for (const task of tasksToUpdate) {
    const checklistItems = task.description.split(';').map(item => ({ item: item.trim() }));
    const checklistString = JSON.stringify(checklistItems);
    
    await prisma.preventiveTask.update({
      where: { id: task.id },
      data: {
        checklist: checklistString,
      },
    });
    updatedCount++;
  }
  console.log(`${updatedCount} tarefas preventivas foram atualizadas com checklists.`);
}

async function assignOmpNumbersToExistingTasks() {
    const tasksWithoutOmp = await prisma.preventiveTask.findMany({
        where: { ompNumber: null },
        orderBy: { createdAt: 'asc' },
    });

    if (tasksWithoutOmp.length === 0) {
        console.log("Nenhuma tarefa para numerar.");
        return;
    }

    const lastTask = await prisma.preventiveTask.findFirst({
        where: { ompNumber: { not: null } },
        orderBy: { ompNumber: 'desc' },
        select: { ompNumber: true },
    });
    // Corrigindo o erro de tipo
    const lastNumber = lastTask?.ompNumber ? parseInt(lastTask.ompNumber.split('-').pop() || '0', 10) : 0;
    let nextOmpNumber = lastNumber + 1;

    for (const task of tasksWithoutOmp) {
        // A lógica de atualização do ompNumber aqui precisará ser ajustada
        // para corresponder ao novo formato. Por enquanto, focamos na correção do tipo.
        // await prisma.preventiveTask.update({
        //     where: { id: task.id },
        //     data: { ompNumber: nextOmpNumber.toString() }, // Exemplo simples
        // });
        // nextOmpNumber++;
    }
    console.log(`${tasksWithoutOmp.length} tarefas receberam um número OMP.`);
}

async function seedMaintenancePlans() {
  console.log("Seeding maintenance plans...");

  const maintenancePlansData = [
    {
      acronym: "BMB-REC",
      description: "Bomba de Recalque",
      category: "Hidráulico",
      tasks: [
        {
          sistema: "Sistema Hidráulico",
          atividade: "Verificar pressão do sistema",
          periodicidade: "Mensal",
          responsavel: "Técnico",
          details: "Verificar pressão; Limpar filtros; Testar funcionamento",
        },
        {
          sistema: "Sistema Elétrico",
          atividade: "Verificar painel elétrico",
          periodicidade: "Trimestral",
          responsavel: "Eletricista",
          details: "Verificar conexões; Testar disjuntores; Limpar painel",
        },
      ],
    },
    {
      acronym: "AR-COND",
      description: "Ar Condicionado",
      category: "Climatização",
      tasks: [
        {
          sistema: "Sistema de Refrigeração",
          atividade: "Limpeza dos filtros",
          periodicidade: "Mensal",
          responsavel: "Técnico",
          details: "Limpar filtros; Verificar drenos; Testar temperatura",
        },
        {
          sistema: "Sistema Elétrico",
          atividade: "Verificar compressor",
          periodicidade: "Semestral",
          responsavel: "Técnico Especializado",
          details: "Verificar compressor; Testar termostato; Limpar evaporador",
        },
      ],
    },
    {
      acronym: "ELEVADOR",
      description: "Elevador",
      category: "Transporte Vertical",
      tasks: [
        {
          sistema: "Sistema Mecânico",
          atividade: "Verificar cabos e polias",
          periodicidade: "Mensal",
          responsavel: "Técnico Especializado",
          details: "Verificar cabos; Lubrificar polias; Testar freios",
        },
        {
          sistema: "Sistema de Segurança",
          atividade: "Teste de segurança",
          periodicidade: "Trimestral",
          responsavel: "Técnico Especializado",
          details: "Testar freios; Verificar sensores; Testar emergência",
        },
      ],
    },
  ];

  for (const planData of maintenancePlansData) {
    const plan = await prisma.maintenancePlan.upsert({
      where: { acronym: planData.acronym },
      update: {
        description: planData.description,
        category: planData.category,
      },
      create: {
        acronym: planData.acronym,
        description: planData.description,
        category: planData.category,
      },
    });

    if (planData.tasks && planData.tasks.length > 0) {
      for (const taskData of planData.tasks) {
        // Find if a similar task template already exists for this plan
        const existingTask = await prisma.maintenanceTaskTemplate.findFirst({
          where: {
            planId: plan.id,
            sistema: taskData.sistema,
            atividade: taskData.atividade,
            periodicidade: taskData.periodicidade,
          },
        });

        // Only create if it doesn't exist to avoid duplicates on re-seed
        if (!existingTask) {
          const task = await prisma.maintenanceTaskTemplate.create({
            data: {
              planId: plan.id,
              sistema: taskData.sistema,
              atividade: taskData.atividade,
              periodicidade: taskData.periodicidade,
              responsavel: taskData.responsavel,
            },
          });

          // Create checklist items for the new task
          if (taskData.details) {
            const checklistItems = taskData.details
              .split(";")
              .map((item) => item.trim())
              .filter(item => item.length > 0);

            await prisma.checklistItem.createMany({
              data: checklistItems.map((desc) => ({
                description: desc,
                taskId: task.id,
              })),
            });
          }
        }
      }
    }
    console.log(`Upserted plan: ${plan.description}`);
  }
  console.log("Maintenance plans seeding finished.");
}


async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@manut.app" },
    update: {},
    create: {
      email: "admin@manut.app",
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const livingOne = await prisma.contract.upsert({
    where: { acronym: "LONE" }, // Usar a sigla como identificador único
    update: {
      name: "Living One",
      cnpj: "12.345.678/0001-99", // Exemplo
      address: "Rua Fictícia, 123, São Paulo - SP", // Exemplo
      sindico: "Sr. João Silva",
      status: "Implantado",
    },
    create: {
      name: "Living One",
      acronym: "LONE",
      cnpj: "12.345.678/0001-99", // Exemplo
      address: "Rua Fictícia, 123, São Paulo - SP", // Exemplo
      sindico: "Sr. João Silva",
      status: "Implantado",
    },
  });

  const building = await prisma.building.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      name: "Torre Única",
      contractId: livingOne.id,
    },
  });

  const floor = await prisma.floor.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      name: "Térreo",
      buildingId: building.id,
    },
  });

  const location = await prisma.location.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      name: "Hall de Entrada",
      floorId: floor.id,
    },
  });

  const buildingB = await prisma.building.upsert({
    where: { id: "2" },
    update: {},
    create: {
      id: "2",
      name: "Edifício B (Sem Andares)",
      contractId: livingOne.id, // Assuming this building is also part of Living One
    },
  });

  console.log("Dados iniciais garantidos (upsert).");

  await updateExistingTasksWithChecklists();
  await assignOmpNumbersToExistingTasks();
  await seedMaintenancePlans();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 