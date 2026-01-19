import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("--- INICIO SCRIPT ---");
    const contract = await prisma.contract.findFirst({
        where: { name: { contains: "Samoa" } },
        include: {
            buildings: {
                include: {
                    floors: {
                        include: {
                            locations: true
                        }
                    }
                }
            }
        }
    });

    if (!contract) {
        console.log("Samoa contract not found");
        return;
    }

    console.log("Contract Found:", contract.name, "(ID:", contract.id + ")");
    console.log("Buildings count:", contract.buildings.length);

    for (const b of contract.buildings) {
        console.log("  Building:", b.name, "(ID:", b.id + ")");
        console.log("    Floors count:", b.floors.length);
        for (const f of b.floors) {
            console.log("    Floor:", f.name, "(ID:", f.id + ")");
            console.log("      Locations count:", f.locations.length);
            for (const l of f.locations) {
                console.log("      Location:", l.name, "(ID:", l.id + ")");
            }
        }
    }

    const hydraulicPlan = await prisma.maintenancePlan.findFirst({
        where: { description: { contains: "Hidráulico" } }
    });
    console.log("Maintenance Plan (Hidráulico):", hydraulicPlan?.description, "(ID:", hydraulicPlan?.id + ")");

    console.log("--- FIM SCRIPT ---");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
