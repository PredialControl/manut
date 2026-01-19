import prisma from "@/lib/prisma";

export async function generateOmNumber(contractAcronym: string): Promise<string> {
  // Contar todas as preventivas e corretivas do contrato
  const preventiveCount = await prisma.preventiveTask.count({
    where: {
      asset: {
        location: {
          floor: {
            building: {
              contract: {
                acronym: contractAcronym
              }
            }
          }
        }
      }
    }
  });

  const correctiveCount = await prisma.correctiveCall.count({
    where: {
      asset: {
        location: {
          floor: {
            building: {
              contract: {
                acronym: contractAcronym
              }
            }
          }
        }
      }
    }
  });

  // Total de chamados (preventivas + corretivas)
  const totalCount = preventiveCount + correctiveCount;
  const nextNumber = totalCount + 1;
  const formattedNumber = nextNumber.toString().padStart(5, '0');
  
  return `OM: ${contractAcronym} - ${formattedNumber}`;
}

export async function generateOMCNumber(): Promise<string> {
  // Contar todas as preventivas e corretivas globalmente
  const preventiveCount = await prisma.preventiveTask.count();
  const correctiveCount = await prisma.correctiveCall.count();
  
  // Total de chamados (preventivas + corretivas)
  const totalCount = preventiveCount + correctiveCount;
  const nextNumber = totalCount + 1;
  const formattedNumber = nextNumber.toString().padStart(5, '0');
  
  return `OM: LONE - ${formattedNumber}`;
} 