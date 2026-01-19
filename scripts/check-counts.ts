import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const plans = await prisma.maintenancePlan.count();
    const tasks = await prisma.maintenanceTaskTemplate.count();
    const items = await prisma.checklistItem.count();
    const activeTasks = await prisma.preventiveTask.count();

    console.log(`Remaining:`);
    console.log(`Maintenance Plans: ${plans}`);
    console.log(`Task Templates: ${tasks}`);
    console.log(`Checklist Items: ${items}`);
    console.log(`Active Preventive Tasks (on assets): ${activeTasks}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
