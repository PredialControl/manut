import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const contract = await prisma.contract.findFirst({
        where: { name: { contains: "Samoa" } }
    });
    console.log("Contract:", contract);

    if (contract) {
        const building = await prisma.building.findFirst({
            where: { contractId: contract.id }
        });
        console.log("Building:", building);

        if (building) {
            const floor = await prisma.floor.findFirst({
                where: { buildingId: building.id, name: "Cobertura" }
            });
            console.log("Floor (Cobertura):", floor);

            if (floor) {
                const location = await prisma.location.findFirst({
                    where: { floorId: floor.id }
                });
                console.log("Location:", location);
            }
        }
    }

    const plan = await prisma.maintenancePlan.findFirst({
        where: { description: { contains: "Hidráulico" } }
    });
    console.log("Maintenance Plan (Hidráulico):", plan);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
