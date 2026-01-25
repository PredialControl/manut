import prisma from "@/lib/prisma";
import { ConstructionItemsClient } from "./_components/construction-items-client";
import { StatusChart } from "./_components/status-chart";
import { EspecialidadeChart } from "./_components/especialidade-chart";
import { ItemsProgressChart } from "./_components/items-progress-chart";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";

interface ConstructionItemsPageProps {
  searchParams: {
    contractId?: string;
    status?: string;
    especialidade?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  };
}

export default async function ConstructionItemsPage({ searchParams }: ConstructionItemsPageProps) {
  const {
    contractId,
    status = "all",
    especialidade = "all",
    dateFrom = "",
    dateTo = "",
    search = ""
  } = searchParams;

  if (!contractId) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              Itens da Construtora
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Por favor, selecione um contrato no portal para visualizar os itens da construtora.
          </p>
        </div>
      </div>
    );
  }

  // Construir filtros dinamicamente
  let whereClause: any = {
    contractId: contractId
  };

  // Filtro por status
  if (status && status !== "all") {
    whereClause.status = status;
  }

  // Filtro por especialidade
  if (especialidade && especialidade !== "all") {
    whereClause.especialidade = especialidade;
  }

  // Filtro por data de abertura
  if (dateFrom || dateTo) {
    whereClause.openedAt = {};
    if (dateFrom) {
      whereClause.openedAt.gte = new Date(dateFrom);
    }
    if (dateTo) {
      whereClause.openedAt.lte = new Date(dateTo);
    }
  }

  // Filtro por busca (número ou descrição)
  if (search) {
    whereClause.OR = [
      { number: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  const constructionItems = await prisma.constructionItem.findMany({
    where: whereClause,
    include: {
      contract: true
    },
    orderBy: {
      openedAt: 'desc'
    }
  });

  // Revalidar a página para garantir dados atualizados
  revalidatePath(`/construction-items?contractId=${contractId}`);

  // Calcular estatísticas para o gráfico de status
  const stats = {
    emAndamento: constructionItems.filter(item => item.status === 'EM_ANDAMENTO').length,
    finalizado: constructionItems.filter(item => item.status === 'FINALIZADO').length,
    improcedente: constructionItems.filter(item => item.status === 'IMPROCEDENTE').length,
    aguardandoVistoria: constructionItems.filter(item => item.status === 'AGUARDANDO_VISTORIA').length,
    concluido: constructionItems.filter(item => item.status === 'CONCLUIDO').length,
  };

  // Calcular estatísticas para o gráfico de especialidades
  const especialidadeStats = {
    civil: constructionItems.filter(item => item.especialidade === 'CIVIL').length,
    eletrica: constructionItems.filter(item => item.especialidade === 'ELETRICA').length,
    hidraulica: constructionItems.filter(item => item.especialidade === 'HIDRAULICA').length,
    sistemas: constructionItems.filter(item => item.especialidade === 'SISTEMAS').length,
  };

  // Formatar dados para a tabela
  const formattedItems = constructionItems.map(item => ({
    id: item.id,
    number: item.number,
    description: item.description,
    status: item.status,
    especialidade: item.especialidade,
    openedAt: item.openedAt,
    deadline: item.deadline,
    rescheduledDate: item.rescheduledDate,
    feedback: item.feedback || "",
    contractName: item.contract.name
  }));

  return (
    <div className="flex-1 p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Itens da Construtora</h2>
          <p className="text-sm text-muted-foreground">Gerencie os itens e pendências da construtora.</p>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-full">
            <StatusChart stats={stats} />
          </div>
          <div className="h-full">
            <EspecialidadeChart stats={especialidadeStats} />
          </div>
          <div className="h-full">
            <ItemsProgressChart stats={stats} />
          </div>
        </div>

        {/* Tabela */}
        <Suspense fallback={<div>Carregando...</div>}>
          <ConstructionItemsClient data={formattedItems} />
        </Suspense>
      </div>
    </div>
  );
}