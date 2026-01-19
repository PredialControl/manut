import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const buildings = await prisma.building.findMany({
        include: {
            floors: {
                include: {
                    locations: true
                }
            }
        }
    });
    console.log(JSON.stringify(buildings, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
