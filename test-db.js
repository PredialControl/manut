const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const contracts = await prisma.contract.findMany();
    console.log('✓ Connection successful!');
    console.log('Contracts found:', contracts.length);

    const tickets = await prisma.ticket.findMany();
    console.log('Tickets found:', tickets.length);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
