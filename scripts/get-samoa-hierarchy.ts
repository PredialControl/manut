import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const samoa = await prisma.contract.findFirst({
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

    if (!samoa) {
        console.log("Samoa contract not found");
        return;
    }

    console.log("Contract ID:", samoa.id);
    for (const b of samoa.buildings) {
        console.log("  Building:", b.name, "(ID:", b.id + ")");
        for (const f of b.floors) {
            console.log("    Floor:", f.name, "(ID:", f.id + ")");
            for (const l of f.locations) {
                console.log("      Location:", l.name, "(ID:", l.id + ")");
            }
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
