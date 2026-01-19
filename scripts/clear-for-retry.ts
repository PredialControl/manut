import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🧹 Limpando dados da tentativa anterior...");

    await prisma.execution.deleteMany({});
    await prisma.preventiveTask.deleteMany({});
    await prisma.checklistItem.deleteMany({});
    await prisma.maintenanceTaskTemplate.deleteMany({});
    await prisma.maintenancePlan.deleteMany({});

    console.log("✅ Banco de dados limpo. Pronto para receber os novos dados.");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
