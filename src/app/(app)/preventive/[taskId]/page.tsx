import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PreventiveTaskDetails } from "./_components/preventive-task-details";

export const dynamic = 'force-dynamic';

interface PreventiveTaskPageProps {
  params: {
    taskId: string;
  };
  searchParams: {
    contractId?: string;
  };
}

export default async function PreventiveTaskPage({ 
  params, 
  searchParams 
}: PreventiveTaskPageProps) {
  const { taskId } = params;
  const { contractId } = searchParams;

  if (!contractId) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              Detalhes da Tarefa Preventiva
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Por favor, selecione um contrato no portal para visualizar os detalhes da tarefa.
          </p>
        </div>
      </div>
    );
  }

  // Buscar a tarefa preventiva específica
  const preventiveTask = await prisma.preventiveTask.findFirst({
    where: {
      id: taskId,
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
    }
  });

  if (!preventiveTask) {
    notFound();
  }

  // Formatar dados da tarefa
  const formattedTask = {
    id: preventiveTask.id,
    contractId: contractId,
    ompNumber: preventiveTask.ompNumber || "N/A",
    description: preventiveTask.description,
    frequency: preventiveTask.frequency,
    startDate: preventiveTask.startDate,
    assetName: preventiveTask.asset.name,
    assetTag: preventiveTask.asset.tag || "N/A",
    location: `${preventiveTask.asset.location.floor.building.name} - ${preventiveTask.asset.location.floor.name} - ${preventiveTask.asset.location.name}`,
    status: preventiveTask.executions.length > 0 ? "Executada" : 
            preventiveTask.startDate < new Date() ? "Pendente" :
            preventiveTask.startDate.toDateString() === new Date().toDateString() ? "Hoje" : "Próxima",
    lastExecution: preventiveTask.executions[0] || null,
    executions: preventiveTask.executions,
    checklist: preventiveTask.checklist
  };

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Detalhes da Tarefa Preventiva
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Visualize e gerencie os detalhes da tarefa preventiva.
        </p>
        <PreventiveTaskDetails task={formattedTask} />
      </div>
    </div>
  );
} 