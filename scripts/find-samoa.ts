import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const contracts = await prisma.contract.findMany({
        where: {
            name: {
                contains: "Samoa",
            },
        },
        select: {
            id: true,
            name: true,
        },
    });

    console.log(JSON.stringify(contracts, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
