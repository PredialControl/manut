import prisma from "@/lib/prisma";
import { PreventiveListClient } from "./_components/preventive-list-client";

interface PreventivePageProps {
  searchParams: {
    contractId?: string;
    status?: string;
  };
}

export default async function PreventivePage({ searchParams }: PreventivePageProps) {
  const { contractId, status = "hoje" } = searchParams;

  if (!contractId) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              Manutenções Preventivas
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Por favor, selecione um contrato no portal para visualizar as manutenções preventivas.
          </p>
        </div>
      </div>
    );
  }

  // Buscar tarefas preventivas baseado no status
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let whereClause: any = {
    asset: {
      location: {
        floor: {
          building: {
            contractId: contractId
          }
        }
      }
    }
  };

  // Filtrar por status
  switch (status) {
    case "hoje":
      // Tarefas que vencem hoje
      whereClause.startDate = {
        gte: today,
        lt: tomorrow
      };
      break;
    case "pendente":
      // Tarefas em atraso
      whereClause.startDate = {
        lt: today
      };
      whereClause.executions = {
        none: {}
      };
      break;
    case "proximas":
      // Tarefas dos próximos 7 dias
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      whereClause.startDate = {
        gte: tomorrow,
        lte: nextWeek
      };
      break;
    case "executadas":
      // Tarefas já executadas
      whereClause.executions = {
        some: {}
      };
      break;
  }

  const preventiveTasks = await prisma.preventiveTask.findMany({
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
      }
    },
    orderBy: {
      startDate: 'asc'
    }
  });

  // Formatar dados para a tabela
  const formattedTasks = preventiveTasks.map(task => ({
    id: task.id,
    contractId: contractId,
    ompNumber: task.ompNumber || "N/A",
    description: task.description,
    frequency: task.frequency,
    startDate: task.startDate,
    assetName: task.asset.name,
    assetTag: task.asset.tag || "N/A",
    location: `${task.asset.location.floor.building.name} - ${task.asset.location.floor.name} - ${task.asset.location.name}`,
    status: task.executions.length > 0 ? "Executada" :
      task.startDate < today ? "Pendente" :
        task.startDate.toDateString() === today.toDateString() ? "Hoje" : "Próxima",
    lastExecution: task.executions[0] || null
  }));

  return (
    <div className="flex-1 space-y-8 p-6 pt-6 bg-background min-h-screen">
      <div className="flex flex-col space-y-6 w-full">
        <PreventiveListClient data={formattedTasks} />
      </div>
    </div>
  );
} 