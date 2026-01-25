"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, Wrench, ShieldCheck, Clock, MoreVertical, Play, Edit, Trash2, Eye, AlertCircle, CheckCircle2, CircleDashed, XCircle } from "lucide-react";
import Link from "next/link";
import { format, isToday, isTomorrow, isThisWeek, isThisMonth, parseISO, addDays, startOfDay, endOfDay, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { EditAssetDialog } from "../../assets/_components/edit-asset-dialog";
import { cn } from "@/lib/utils";

interface ScheduleClientProps {
  preventiveTasks: any[];
  correctiveCalls: any[];
  contractId: string;
}

type FilterStatus = "today" | "overdue" | "upcoming" | "completed";

export function ScheduleClient({ preventiveTasks, correctiveCalls, contractId }: ScheduleClientProps) {
  const [activeTab, setActiveTab] = useState<FilterStatus>("today");

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
    const activities: any[] = [];

    // Adicionar preventivas
    preventiveTasks.forEach((task) => {
      const nextDate = getNextMaintenanceDate(task);
      const isExec = task.executions?.length > 0;
      // Lógica simplificada: Se não tem execução recente válida para o ciclo, é pendente
      // Aqui assumimos que se tem execução é 'Concluído' para efeitos de demonstração, 
      // mas num sistema real validaria se a execução está dentro da janela atual.

      activities.push({
        id: task.id,
        type: "preventive" as const,
        title: task.description,
        date: nextDate,
        status: isExec ? "CONCLUIDO" : "ABERTO",
        // Adaptei para usar os mesmos status das corretivas interna
        originalStatus: task.executions?.length > 0 ? "Executada" : "Pendente",
        location: task.asset?.location?.name,
        floor: task.asset?.location?.floor?.name,
        building: task.asset?.location?.floor?.building?.name,
        asset: task.asset,
        assetName: task.asset?.name,
        frequency: task.frequency,
        lastExecution: task.executions?.[0],
        ompNumber: task.ompNumber,
      });
    });

    // Adicionar corretivas
    correctiveCalls.forEach((call) => {
      activities.push({
        id: call.id,
        type: "corrective" as const,
        title: call.title,
        date: call.createdAt,
        status: call.status,
        originalStatus: call.status,
        priority: call.priority,
        location: call.asset?.location?.name,
        floor: call.asset?.location?.floor?.name,
        building: call.asset?.location?.floor?.building?.name,
        asset: call.asset,
        assetName: call.asset?.name,
        lastExecution: call.executions?.[0],
        omcNumber: call.omcNumber,
      });
    });

    return activities.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [preventiveTasks, correctiveCalls]);

  // Filtrar atividades baseado na Tab selecionada
  const filteredActivities = useMemo(() => {
    const today = new Date();

    return allActivities.filter((activity) => {
      const activityDate = new Date(activity.date);
      const isCompleted = activity.status === "CONCLUIDO" || activity.status === "FINALIZADO";
      const isCancelled = activity.status === "CANCELADO";
      const isOpen = !isCompleted && !isCancelled;

      const isOverdue = isOpen && isBefore(activityDate, startOfDay(today));
      const isTodayTask = isOpen && isToday(activityDate);
      const isUpcoming = isOpen && !isOverdue && !isTodayTask;

      switch (activeTab) {
        case "today":
          return isTodayTask;
        case "overdue":
          return isOverdue;
        case "upcoming":
          return isUpcoming;
        case "completed":
          return isCompleted;
        default:
          return true; // Fallback, though we removed "all" from UI
      }
    });
  }, [allActivities, activeTab]);

  const getActivityIcon = (type: string) => {
    return type === "preventive" ? (
      <ShieldCheck className="h-5 w-5 text-blue-500" />
    ) : (
      <Wrench className="h-5 w-5 text-orange-500" />
    );
  };

  const getStatusBadge = (activity: any) => {
    const today = new Date();
    const activityDate = new Date(activity.date);
    const isCompleted = activity.status === "CONCLUIDO" || activity.status === "FINALIZADO";
    const isOverdue = !isCompleted && activity.status !== "CANCELADO" && isBefore(activityDate, startOfDay(today));

    if (isCompleted) {
      return <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20">Concluído</Badge>;
    }
    if (activity.status === "CANCELADO") {
      return <Badge variant="secondary">Cancelado</Badge>;
    }
    if (isOverdue) {
      return <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20">Vencido</Badge>;
    }

    // Status normais
    if (activity.type === "preventive") {
      return <Badge variant="outline" className="text-blue-500 border-blue-500/20 bg-blue-500/5">Pendente</Badge>;
    }

    const statusMap: Record<string, { className: string; label: string }> = {
      "ABERTO": { className: "text-blue-500 border-blue-500/20 bg-blue-500/5", label: "Aberto" },
      "EM_ANDAMENTO": { className: "text-amber-500 border-amber-500/20 bg-amber-500/5", label: "Em Andamento" },
      "AGUARDANDO_VISTORIA": { className: "text-purple-500 border-purple-500/20 bg-purple-500/5", label: "Aguardando Vistoria" },
    };

    const config = statusMap[activity.status] || { className: "text-gray-500 border-gray-500/20 bg-gray-500/5", label: activity.status };
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Cards de Estatísticas estilo Dashboard */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm card-glow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Calendar className="h-24 w-24" />
          </div>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Total de Atividades</span>
              <span className="text-4xl font-bold tracking-tight text-foreground">{allActivities.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm card-glow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldCheck className="h-24 w-24 text-blue-500" />
          </div>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Preventivas</span>
              <span className="text-4xl font-bold tracking-tight text-blue-500">
                {allActivities.filter(a => a.type === "preventive").length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm card-glow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wrench className="h-24 w-24 text-orange-500" />
          </div>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Corretivas</span>
              <span className="text-4xl font-bold tracking-tight text-orange-500">
                {allActivities.filter(a => a.type === "corrective").length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navegação por Abas (Pill Shape) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center p-1.5 bg-[#0f172a]/60 rounded-full border border-white/5 backdrop-blur-md overflow-x-auto no-scrollbar max-w-full">
          {[
            { id: "today", label: "Hoje", icon: AlertCircle, color: "text-blue-500", bg: "bg-blue-500" },
            { id: "overdue", label: "Vencidas", icon: XCircle, color: "text-red-500", bg: "bg-red-500" },
            { id: "upcoming", label: "Próximas", icon: CircleDashed, color: "text-amber-500", bg: "bg-amber-500" },
            { id: "completed", label: "Executadas", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FilterStatus)}
              className={cn(
                "flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-background/80 shadow-md text-foreground ring-1 ring-white/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <div className={cn("h-2.5 w-2.5 rounded-full shadow-sm", tab.bg)} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Atividades - Cards Redesenhados */}
      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
            <div className="bg-secondary/50 p-4 rounded-full mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Nenhuma atividade encontrada</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1">
              Não há itens correspondentes ao filtro selecionado neste momento.
            </p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <Card key={`${activity.type}-${activity.id}`} className="overflow-hidden border-white/5 bg-card/40 hover:bg-card/60 transition-all duration-300 group hover:shadow-2xl hover:shadow-primary/5">
              <div className="flex flex-col md:flex-row items-stretch">

                {/* Lado Esquerdo - Ícone/Imagem Grande */}
                <div className="w-full md:w-64 bg-secondary/30 flex items-center justify-center p-8 border-r border-white/5 relative overflow-hidden group-hover:bg-secondary/40 transition-colors">
                  {activity.asset?.qrCode ? (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform duration-500">
                      <img src={activity.asset.qrCode} alt="Asset" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="relative z-10 p-6 rounded-full bg-background/50 border border-white/10 shadow-xl group-hover:scale-110 transition-transform duration-500">
                      {activity.type === "preventive" ? (
                        <ShieldCheck className="h-16 w-16 text-blue-500" />
                      ) : (
                        <Wrench className="h-16 w-16 text-orange-500" />
                      )}
                    </div>
                  )}
                  {/* Decorative background glow */}
                  <div className={cn(
                    "absolute inset-0 opacity-20 blur-3xl",
                    activity.type === "preventive" ? "bg-blue-500/20" : "bg-orange-500/20"
                  )} />
                </div>

                {/* Lado Direito - Conteúdo */}
                <div className="flex-1 p-6 flex flex-col justify-between">

                  {/* Topo do Conteúdo */}
                  <div>
                    <div className="flex items-start justify-between mb-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
                            ID: {activity.type === "preventive" ? activity.ompNumber || "N/A" : activity.omcNumber || "N/A"}
                          </span>
                          {getStatusBadge(activity)}
                        </div>
                        <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                          {activity.title}
                        </h3>
                      </div>

                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase block mb-1">
                          ÚLTIMA ATIVIDADE
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {activity.lastExecution
                            ? format(new Date(activity.lastExecution.createdAt), "dd/MM/yyyy", { locale: ptBR })
                            : "A marcar"
                          }
                        </span>
                      </div>
                    </div>

                    {/* Grid de Detalhes Técnicos - Layout inspirado na imagem */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">

                      {/* Coluna 1 */}
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">TIPO</p>
                        <p className="font-medium text-foreground">
                          {activity.type === "preventive" ? "Manutenção Preventiva" : "Manutenção Corretiva"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.type === "preventive" ? `Frequência: ${activity.frequency}` : `Prioridade: ${activity.priority}`}
                        </p>
                      </div>

                      {/* Coluna 2 */}
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">ATIVO</p>
                        <p className="font-medium text-foreground truncate">{activity.assetName || "Geral"}</p>
                      </div>

                      {/* Coluna 3 */}
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">DATA/HORA</p>
                        <p className="font-medium text-foreground">
                          {format(new Date(activity.date), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          às {format(new Date(activity.date), "HH:mm")}
                        </p>
                      </div>

                      {/* Coluna 4 (Local) */}
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">LOCAL</p>
                        <p className="font-medium text-foreground">{activity.location || "-"}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.floor ? `${activity.floor}` : ""}
                          {activity.building ? ` - ${activity.building}` : ""}
                        </p>
                      </div>

                      {/* Linha Extra para Equipamento (Se houver) */}
                      {activity.asset && (
                        <>
                          <div className="space-y-1 sm:col-span-2">
                            <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">MODELO / TIPO</p>
                            <p className="font-medium text-foreground">
                              {activity.asset.model || "-"}
                              <span className="text-muted-foreground font-normal ml-1">
                                {activity.asset.type ? `(${activity.asset.type})` : ""}
                              </span>
                            </p>
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">FABRICANTE / QTD</p>
                            <p className="font-medium text-foreground">
                              {activity.asset.manufacturer || "-"}
                              <span className="text-muted-foreground font-normal ml-1">
                                {activity.asset.quantity ? `| Qtd: ${activity.asset.quantity}` : ""}
                              </span>
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Footer com Botões */}
                  <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">

                    {/* Ações Rápidas */}
                    <div className="flex items-center gap-3">
                      <Link
                        href={activity.type === "preventive" ? `/preventive/${activity.id}` : `/corrective/${activity.id}`}
                      >
                        <Button variant="outline" className="border-white/10 hover:bg-white/5 hover:text-primary gap-2 transition-all">
                          <Eye className="h-4 w-4" />
                          VER MAIS
                        </Button>
                      </Link>

                      {activity.status !== "CONCLUIDO" && activity.status !== "FINALIZADO" && activity.status !== "CANCELADO" && (
                        <Link
                          href={
                            activity.type === "preventive"
                              ? `/preventive/${activity.id}?action=execute`
                              : `/corrective/${activity.id}?action=execute`
                          }
                        >
                          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
                            <Play className="h-4 w-4 fill-current" />
                            EXECUTAR
                          </Button>
                        </Link>
                      )}
                    </div>

                    {/* Menu de Contexto */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {activity.asset && (
                          <EditAssetDialog
                            asset={activity.asset}
                            contractId={contractId}
                            trigger={
                              <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground w-full">
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Editar Ativo</span>
                              </div>
                            }
                          />
                        )}
                        <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Excluir Tarefa</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
