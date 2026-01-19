import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🧹 Iniciando limpeza do banco de dados (Ativos, Contratos, etc)...");

    try {
        // 1. Limpar Execuções e Mídias
        console.log("- Removendo Execuções, Anexos e Relatórios...");
        await prisma.execution.deleteMany({});
        await prisma.attachment.deleteMany({});
        await prisma.report.deleteMany({});

        // 2. Limpar Tarefas e Chamados
        console.log("- Removendo Tarefas Preventivas e Chamados Corretivos...");
        await prisma.preventiveTask.deleteMany({});
        await prisma.correctiveCall.deleteMany({});
        await prisma.constructionItem.deleteMany({});

        // 3. Limpar Ativos e Hierarquia Física
        console.log("- Removendo Ativos e Hierarquia (Locais, Pavimentos, Prédios)...");
        await prisma.asset.deleteMany({});
        await prisma.location.deleteMany({});
        await prisma.floor.deleteMany({});
        await prisma.building.deleteMany({});

        // 4. Limpar Contratos
        console.log("- Removendo Contratos...");
        await prisma.contract.deleteMany({});

        console.log("✅ Banco de dados limpo com sucesso!");
        console.log("ℹ️ Os Planos de Manutenção Padrão foram PRESERVADOS.");
        console.log("⚠️ Os usuários foram mantidos para permitir o login.");
    } catch (error) {
        console.error("❌ Erro durante a limpeza:", error);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
