import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting cleanup of maintenance plans...");

    const executions = await prisma.execution.deleteMany({});
    console.log(`Deleted ${executions.count} executions.`);

    const pTasks = await prisma.preventiveTask.deleteMany({});
    console.log(`Deleted ${pTasks.count} active preventive tasks.`);

    const checklistItems = await prisma.checklistItem.deleteMany({});
    console.log(`Deleted ${checklistItems.count} checklist items.`);

    const taskTemplates = await prisma.maintenanceTaskTemplate.deleteMany({});
    console.log(`Deleted ${taskTemplates.count} task templates.`);

    const plans = await prisma.maintenancePlan.deleteMany({});
    console.log(`Deleted ${plans.count} maintenance plans.`);

    console.log("Cleanup complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
