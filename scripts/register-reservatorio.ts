import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Iniciando cadastro do ativo: Reservatório Superior...");

    // 1. Encontrar o Prédio Samoa
    const building = await prisma.building.findFirst({
        where: { name: { contains: "Samoa" } }
    });

    if (!building) {
        throw new Error("❌ Prédio Samoa não encontrado.");
    }
    console.log(`🏢 Prédio encontrado: ${building.name} (${building.id})`);

    // 2. Garantir Pavimento "Cobertura"
    const floor = await prisma.floor.upsert({
        where: { id: "cl_cobertura_samoa" }, // ID determinístico ou busca por nome
        update: {},
        create: {
            id: "cl_cobertura_samoa",
            name: "Cobertura",
            buildingId: building.id
        }
    }).catch(async () => {
        // Se falhar pelo ID, tenta buscar por nome
        return await prisma.floor.findFirst({
            where: { name: "Cobertura", buildingId: building.id }
        }) || await prisma.floor.create({
            data: { name: "Cobertura", buildingId: building.id }
        });
    });
    console.log(`📍 Pavimento: ${floor.name}`);

    // 3. Garantir Local "Área Técnica"
    const location = await prisma.location.upsert({
        where: { id: "loc_area_tecnica_samoa" },
        update: {},
        create: {
            id: "loc_area_tecnica_samoa",
            name: "Área Técnica",
            floorId: floor.id
        }
    }).catch(async () => {
        return await prisma.location.findFirst({
            where: { name: "Área Técnica", floorId: floor.id }
        }) || await prisma.location.create({
            data: { name: "Área Técnica", floorId: floor.id }
        });
    });
    console.log(`🔍 Local: ${location.name}`);

    // 4. Cadastrar o Ativo
    const asset = await prisma.asset.create({
        data: {
            name: "Reservatório Superior",
            locationId: location.id,
            tag: "RES-SUP-01/02",
            imageUrl: "/uploads/assets/reservatorio_superior.png",
            status: "ATIVO"
        }
    });
    console.log(`✅ Ativo cadastrado: ${asset.name} (ID: ${asset.id})`);

    // 5. Vincular ao Plano de Manutenção Hidráulico
    const plan = await prisma.maintenancePlan.findFirst({
        where: { description: { contains: "Hidráulico" } },
        include: { tasks: { include: { checklist: true } } }
    });

    if (plan) {
        console.log(`📋 Vinculando tarefas do plano: ${plan.description}`);

        for (const template of plan.tasks) {
            const ompNumber = `OMP-${asset.id.substring(asset.id.length - 4)}-${Math.random().toString(36).substring(7).toUpperCase()}`;

            await prisma.preventiveTask.create({
                data: {
                    ompNumber,
                    description: template.atividade,
                    frequency: template.periodicidade,
                    startDate: new Date(),
                    assetId: asset.id,
                    checklist: JSON.stringify(template.checklist.map(i => ({ description: i.description, completed: false })))
                }
            });
            console.log(`  - Tarefa criada: ${template.atividade} (${template.periodicidade})`);
        }
    } else {
        console.warn("⚠️ Plano de Manutenção Hidráulico não encontrado. Nenhuma tarefa vinculada.");
    }

    console.log("\n✨ Cadastro concluído com sucesso!");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
