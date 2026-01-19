import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🧹 Iniciando limpeza de registros operacionais...");

    const attachments = await prisma.attachment.deleteMany({});
    console.log(`✅ Anexos removidos: ${attachments.count}`);

    const executions = await prisma.execution.deleteMany({});
    console.log(`✅ Histórico de execuções removido: ${executions.count}`);

    const preventiveTasks = await prisma.preventiveTask.deleteMany({});
    console.log(`✅ Tarefas preventivas ativas removidas: ${preventiveTasks.count}`);

    const correctiveCalls = await prisma.correctiveCall.deleteMany({});
    console.log(`✅ Chamados corretivos removidos: ${correctiveCalls.count}`);

    const constructionItems = await prisma.constructionItem.deleteMany({});
    console.log(`✅ Chamados da construtora removidos: ${constructionItems.count}`);

    console.log("\n✨ Sistema limpo de registros operacionais. Modelos de planos preservados.");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
