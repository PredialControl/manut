import prisma from "@/lib/prisma";
import { TicketsClient } from "./_components/tickets-client";
import { StatusChart } from "./_components/status-chart";
import { BuildingChart } from "./_components/building-chart";
import { ResponsibleChart } from "./_components/responsible-chart";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

interface TicketsPageProps {
  searchParams: {
    contractId?: string;
    buildingId?: string;
    status?: string;
    responsible?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  };
}

export default async function TicketsPage({ searchParams }: TicketsPageProps) {
  const {
    contractId,
    buildingId = "all",
    status = "all",
    responsible = "all",
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
              Chamados
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Por favor, selecione um contrato no portal para visualizar os chamados.
          </p>
        </div>
      </div>
    );
  }

  // Construir filtros dinamicamente
  let whereClause: any = {
    contractId: contractId
  };

  // Filtro por prédio
  if (buildingId && buildingId !== "all") {
    whereClause.buildingId = buildingId;
  }

  // Filtro por status
  if (status && status !== "all") {
    whereClause.status = status;
  }

  // Filtro por responsável
  if (responsible && responsible !== "all") {
    whereClause.responsible = responsible;
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

  // Filtro por busca (número, local ou descrição)
  if (search) {
    whereClause.OR = [
      { number: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  const tickets = await prisma.ticket.findMany({
    where: whereClause,
    include: {
      building: true,
      user: true,
      contract: true,
      correctiveCall: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Buscar prédios do contrato para filtro
  const buildings = await prisma.building.findMany({
    where: { contractId },
    select: { id: true, name: true }
  });

  // Revalidar a página para garantir dados atualizados
  revalidatePath(`/tickets?contractId=${contractId}`);

  // Calcular estatísticas para o gráfico de status
  const stats = {
    itensApontados: tickets.filter(t => t.status === 'itens_apontados').length,
    emAndamento: tickets.filter(t => t.status === 'em_andamento').length,
    improcedente: tickets.filter(t => t.status === 'improcedente').length,
    aguardandoVistoria: tickets.filter(t => t.status === 'aguardando_vistoria').length,
    concluido: tickets.filter(t => t.status === 'concluido').length,
    fIndevido: tickets.filter(t => t.status === 'f_indevido').length,
  };

  // Calcular estatísticas por prédio (top 5)
  const buildingStats = buildings.map(building => ({
    name: building.name,
    count: tickets.filter(t => t.buildingId === building.id).length
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  // Calcular estatísticas por responsável
  const responsibleStats = {
    condominio: tickets.filter(t => t.responsible === 'Condomínio').length,
    construtora: tickets.filter(t => t.responsible === 'Construtora').length,
    outros: tickets.filter(t => !t.responsible || (t.responsible !== 'Condomínio' && t.responsible !== 'Construtora')).length,
  };

  // Formatar dados para a tabela
  const formattedTickets = tickets.map(ticket => ({
    id: ticket.id,
    number: ticket.number || '-',
    buildingName: ticket.building.name,
    location: ticket.location,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority || 'MEDIA',
    responsible: ticket.responsible || '-',
    photoCount: ticket.photoUrls.length,
    deadline: ticket.deadline,
    reprogrammingDate: ticket.reprogrammingDate,
    isRegistered: ticket.isRegistered,
    correctiveCallId: ticket.correctiveCallId,
    createdAt: ticket.createdAt,
    userName: ticket.user.name || ticket.user.email
  }));

  return (
    <div className="flex-1 p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Chamados</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie tickets e ocorrências dos prédios.
          </p>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-full">
            <StatusChart stats={stats} />
          </div>
          <div className="h-full">
            <BuildingChart stats={buildingStats} />
          </div>
          <div className="h-full">
            <ResponsibleChart stats={responsibleStats} />
          </div>
        </div>

        {/* Tabela */}
        <Suspense fallback={<div>Carregando...</div>}>
          <TicketsClient
            data={formattedTickets}
            buildings={buildings}
            contractId={contractId}
          />
        </Suspense>
      </div>
    </div>
  );
}
