"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, Wrench, ShieldCheck, Clock, MoreVertical, Play, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { format, isToday, isTomorrow, isThisWeek, isThisMonth, parseISO, addDays, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { EditAssetDialog } from "../../assets/_components/edit-asset-dialog";

interface ScheduleClientProps {
  preventiveTasks: any[];
  correctiveCalls: any[];
  contractId: string;
}

type FilterPeriod = "all" | "today" | "tomorrow" | "week" | "month";

export function ScheduleClient({ preventiveTasks, correctiveCalls, contractId }: ScheduleClientProps) {
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("all");
  const [filterType, setFilterType] = useState<"all" | "preventive" | "corrective">("all");

  // Função para calcular próxima data de manutenção preventiva
  const getNextMaintenanceDate = (task: any) => {
    if (!task.executions || task.executions.length === 0) {
      return task.startDate;
    }

    const lastExecution = task.executions[0];
    const lastDate = lastExecution.endTime || lastExecution.startTime || lastExecution.createdAt;

    // Calcular próxima data baseada na frequência
    const frequencyMap: Record<string, number> = {
      "DIARIA": 1,
      "SEMANAL": 7,
      "QUINZENAL": 15,
      "MENSAL": 30,
      "BIMESTRAL": 60,
      "TRIMESTRAL": 90,
      "SEMESTRAL": 180,
      "ANUAL": 365,
    };

    const days = frequencyMap[task.frequency] || 30;
    return addDays(new Date(lastDate), days);
  };

  // Combinar e formatar todas as atividades
  const allActivities = useMemo(() => {
    const activities = [];

    // Adicionar preventivas
    if (filterType === "all" || filterType === "preventive") {
      preventiveTasks.forEach((task) => {
        const nextDate = getNextMaintenanceDate(task);
        activities.push({
          id: task.id,
          type: "preventive" as const,
          title: task.description,
          date: nextDate,
          status: task.executions?.length > 0 ? "Executada" : "Pendente",
          location: task.asset?.location?.name,
          floor: task.asset?.location?.floor?.name,
          building: task.asset?.location?.floor?.building?.name,
          asset: task.asset, // Pass the whole asset object
          assetName: task.asset?.name,
          frequency: task.frequency,
          lastExecution: task.executions?.[0],
          ompNumber: task.ompNumber,
        });
      });
    }

    // Adicionar corretivas
    if (filterType === "all" || filterType === "corrective") {
      correctiveCalls.forEach((call) => {
        activities.push({
          id: call.id,
          type: "corrective" as const,
          title: call.title,
          date: call.createdAt,
          status: call.status,
          priority: call.priority,
          location: call.asset?.location?.name,
          floor: call.asset?.location?.floor?.name,
          building: call.asset?.location?.floor?.building?.name,
          asset: call.asset, // Pass the whole asset object
          assetName: call.asset?.name,
          lastExecution: call.executions?.[0],
          omcNumber: call.omcNumber,
        });
      });
    }

    return activities.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [preventiveTasks, correctiveCalls, filterType]);

  // Filtrar por período
  const filteredActivities = useMemo(() => {
    if (filterPeriod === "all") return allActivities;

    return allActivities.filter((activity) => {
      const activityDate = new Date(activity.date);

      switch (filterPeriod) {
        case "today":
          return isToday(activityDate);
        case "tomorrow":
          return isTomorrow(activityDate);
        case "week":
          return isThisWeek(activityDate, { locale: ptBR });
        case "month":
          return isThisMonth(activityDate);
        default:
          return true;
      }
    });
  }, [allActivities, filterPeriod]);

  const getActivityIcon = (type: string) => {
    return type === "preventive" ? (
      <ShieldCheck className="h-5 w-5 text-blue-600" />
    ) : (
      <Wrench className="h-5 w-5 text-orange-600" />
    );
  };

  const getStatusBadge = (activity: any) => {
    if (activity.type === "preventive") {
      return activity.status === "Executada" ? (
        <Badge variant="default" className="bg-green-500">Executada</Badge>
      ) : (
        <Badge variant="secondary">Pendente</Badge>
      );
    } else {
      const statusMap: Record<string, { variant: any; label: string }> = {
        "ABERTO": { variant: "destructive", label: "Aberto" },
        "EM_ANDAMENTO": { variant: "default", label: "Em Andamento" },
        "CONCLUIDO": { variant: "default", label: "Concluído" },
        "CANCELADO": { variant: "secondary", label: "Cancelado" },
      };
      const config = statusMap[activity.status] || { variant: "secondary", label: activity.status };
      return <Badge variant={config.variant}>{config.label}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap: Record<string, { className: string; label: string }> = {
      "BAIXA": { className: "bg-gray-500", label: "Baixa" },
      "MEDIA": { className: "bg-yellow-500", label: "Média" },
      "ALTA": { className: "bg-orange-500", label: "Alta" },
      "URGENTE": { className: "bg-red-500", label: "Urgente" },
    };
    const config = priorityMap[priority] || { className: "bg-gray-500", label: priority };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Select value={filterPeriod} onValueChange={(value: FilterPeriod) => setFilterPeriod(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as atividades</SelectItem>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="tomorrow">Amanhã</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mês</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="preventive">Preventivas</SelectItem>
              <SelectItem value="corrective">Corretivas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Atividades</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredActivities.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preventivas</CardTitle>
            <ShieldCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredActivities.filter((a) => a.type === "preventive").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Corretivas</CardTitle>
            <Wrench className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredActivities.filter((a) => a.type === "corrective").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Atividades - Cards */}
      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Nenhuma atividade encontrada para o período selecionado</p>
            </CardContent>
          </Card>
        ) : (
          filteredActivities.map((activity) => {
            const responsible = activity.lastExecution?.user;
            const initials = responsible?.name
              ? responsible.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()
              : "NA";

            return (
              <Card key={`${activity.type}-${activity.id}`} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex items-stretch">
                  {/* Foto/Imagem do Ativo - Grande à esquerda */}
                  <div className="w-48 h-48 flex-shrink-0 bg-muted relative overflow-hidden">
                    {activity.asset?.qrCode ? (
                      <img
                        src={activity.asset.qrCode}
                        alt={activity.assetName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        {activity.type === "preventive" ? (
                          <ShieldCheck className="h-20 w-20 text-blue-600 opacity-30" />
                        ) : (
                          <Wrench className="h-20 w-20 text-orange-600 opacity-30" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            ID: {activity.type === "preventive" ? activity.ompNumber : activity.omcNumber}
                          </p>
                          <div className="flex items-center gap-2">
                            {getActivityIcon(activity.type)}
                            {getStatusBadge(activity)}
                            {activity.priority && getPriorityBadge(activity.priority)}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-1">{activity.title}</h3>
                      </div>

                      <div className="text-right ml-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          ÚLTIMA ATIVIDADE
                        </p>
                        <p className="text-sm font-semibold">
                          {activity.lastExecution
                            ? format(new Date(activity.lastExecution.createdAt), "dd/MM/yyyy", { locale: ptBR })
                            : "A marcar"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">TIPO</p>
                        <p className="font-medium">
                          {activity.type === "preventive" ? "Manutenção Preventiva" : "Manutenção Corretiva"}
                        </p>
                        {activity.type === "preventive" && activity.frequency && (
                          <p className="text-xs text-muted-foreground mt-1">Frequência: {activity.frequency}</p>
                        )}
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">ATIVO</p>
                        <p className="font-medium">{activity.assetName || "-"}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">DATA/HORA</p>
                        <p className="font-medium">
                          {format(new Date(activity.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">LOCAL</p>
                        <p className="font-medium">{activity.building || "-"}</p>
                        {activity.location && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.floor} - {activity.location}
                          </p>
                        )}
                      </div>

                      {/* Novos campos solicitados */}
                      {activity.asset && (
                        <>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">MODELO / TIPO</p>
                            <p className="font-medium text-sm">
                              {activity.asset.model || "-"} {activity.asset.type ? `(${activity.asset.type})` : ""}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">FABRICANTE / QTD</p>
                            <p className="font-medium text-sm">
                              {activity.asset.manufacturer || "-"} {activity.asset.quantity ? `| Qtd: ${activity.asset.quantity}` : ""}
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Responsável */}
                    {activity.lastExecution && (
                      <div className="mb-4 pb-4 border-b">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">RESPONSÁVEL</p>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={responsible?.image} alt={responsible?.name} />
                            <AvatarFallback className="text-sm bg-primary text-primary-foreground font-semibold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{responsible?.name || "Não atribuído"}</p>
                            <p className="text-xs text-muted-foreground">{responsible?.email || ""}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Botões de Ação */}
                    <div className="flex items-center gap-3">
                      <Link
                        href={
                          activity.type === "preventive"
                            ? `/preventive/${activity.id}`
                            : `/corrective/${activity.id}`
                        }
                      >
                        <Button variant="outline" size="default" className="gap-2">
                          <Eye className="h-4 w-4" />
                          VER MAIS
                        </Button>
                      </Link>

                      {activity.status !== "CONCLUIDO" && (
                        <Link
                          href={
                            activity.type === "preventive"
                              ? `/preventive/${activity.id}?action=execute`
                              : `/corrective/${activity.id}?action=execute`
                          }
                        >
                          <Button variant="default" size="default" className="gap-2">
                            <Play className="h-4 w-4" />
                            EXECUTAR
                          </Button>
                        </Link>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Mais Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {activity.asset && (
                            <EditAssetDialog
                              asset={activity.asset}
                              contractId={contractId}
                              trigger={
                                <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground w-full">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar Dados Técnicos
                                </button>
                              }
                            />
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive cursor-pointer">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
