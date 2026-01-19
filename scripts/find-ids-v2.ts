import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const data: any = {};

    const contract = await prisma.contract.findFirst({
        where: { name: { contains: "Samoa" } }
    });
    data.contract = contract;

    if (contract) {
        const building = await prisma.building.findFirst({
            where: { contractId: contract.id }
        });
        data.building = building;

        if (building) {
            const floor = await prisma.floor.findFirst({
                where: { buildingId: building.id, name: "Cobertura" }
            });
            data.floor = floor;

            if (floor) {
                const location = await prisma.location.findFirst({
                    where: { floorId: floor.id }
                });
                data.location = location;
            }
        }
    }

    const plan = await prisma.maintenancePlan.findFirst({
        where: { description: { contains: "Hidráulico" } }
    });
    data.plan = plan;

    console.log(JSON.stringify(data, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
