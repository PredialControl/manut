import prisma from "@/lib/prisma";
import { CorrectiveListClient } from "./_components/corrective-list-client";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";

interface CorrectivePageProps {
  searchParams: {
    contractId?: string;
    status?: string;
    priority?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export default async function CorrectivePage({ searchParams }: CorrectivePageProps) {
  const {
    contractId,
    status = "todos",
    priority = "all",
    search = "",
    dateFrom = "",
    dateTo = ""
  } = searchParams;

  if (!contractId) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              Manutenções Corretivas
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Por favor, selecione um contrato no portal para visualizar as manutenções corretivas.
          </p>
        </div>
      </div>
    );
  }

  // Construir filtros dinamicamente
  let whereClause: any = {
    OR: [
      {
        asset: {
          location: {
            floor: {
              building: {
                contractId: contractId
              }
            }
          }
        }
      },
      {
        asset: null
      }
    ]
  };

  // Filtro por status
  if (status && status !== "todos") {
    whereClause.status = status;
  }

  // Filtro por prioridade
  if (priority && priority !== "all") {
    whereClause.priority = priority;
  }

  // Filtro por data de criação
  if (dateFrom || dateTo) {
    whereClause.createdAt = {};
    if (dateFrom) {
      whereClause.createdAt.gte = new Date(dateFrom);
    }
    if (dateTo) {
      whereClause.createdAt.lte = new Date(dateTo);
    }
  }

  // Filtro por busca (título ou descrição)
  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  const correctiveCalls = await prisma.correctiveCall.findMany({
    where: whereClause,
    include: {
      asset: {
        include: {
          location: {
            include: {
              floor: {
                include: {
                  building: true
                }
              }
            }
          }
        }
      },
      executions: {
        include: {
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      attachments: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Revalidar a página para garantir dados atualizados
  revalidatePath(`/corrective?contractId=${contractId}`);

  // Formatar dados para a tabela
  const formattedCalls = correctiveCalls.map(call => ({
    id: call.id,
    omcNumber: call.omcNumber || "N/A",
    title: call.title,
    description: call.description || "",
    priority: call.priority,
    status: call.status,
    assetName: call.asset?.name || undefined,
    locationName: call.asset?.location?.name || undefined,
    assetId: call.asset?.id || undefined,
    assetTag: call.asset?.tag || undefined,
    createdAt: call.createdAt,
  }));

  return (
    <div className="flex-1 space-y-8 p-6 pt-6 bg-background min-h-screen">
      <div className="flex flex-col space-y-6 w-full">
        <Suspense fallback={<div>Carregando...</div>}>
          <CorrectiveListClient data={formattedCalls} contractId={contractId} />
        </Suspense>
      </div>
    </div>
  );
} 