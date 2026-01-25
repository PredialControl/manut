import prisma from "@/lib/prisma";
import { ScheduleClient } from "./_components/schedule-client";

export const dynamic = 'force-dynamic';

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: { contractId?: string };
}) {
  const { contractId } = searchParams;

  // Buscar todas as tarefas preventivas
  const preventiveTasks = await prisma.preventiveTask.findMany({
    where: contractId ? {
      asset: {
        location: {
          floor: {
            building: {
              contractId: contractId,
            },
          },
        },
      },
    } : undefined,
    include: {
      asset: {
        include: {
          location: {
            include: {
              floor: {
                include: {
                  building: true,
                },
              },
            },
          },
        },
      },
      executions: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      startDate: "asc",
    },
  });

  // Buscar todas as chamadas corretivas
  const correctiveCalls = await prisma.correctiveCall.findMany({
    where: contractId ? {
      asset: {
        location: {
          floor: {
            building: {
              contractId: contractId,
            },
          },
        },
      },
    } : undefined,
    include: {
      asset: {
        include: {
          location: {
            include: {
              floor: {
                include: {
                  building: true,
                },
              },
            },
          },
        },
      },
      executions: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4">
        <ScheduleClient
          preventiveTasks={preventiveTasks}
          correctiveCalls={correctiveCalls}
          contractId={contractId || ""}
        />
      </div>
    </div>
  );
}
