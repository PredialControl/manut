"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, MapPin, Clock, FileText, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ExecuteTaskDialog } from "./execute-task-dialog";
import { executeTask } from "../_actions/execute-task";

interface PreventiveTaskDetailsProps {
  task: {
    id: string;
    contractId: string;
    ompNumber: string;
    description: string;
    frequency: string;
    startDate: Date;
    assetName: string;
    assetTag: string;
    location: string;
    status: string;
    lastExecution?: {
      id: string;
      description: string;
      user: {
        name: string | null;
      };
      createdAt: Date;
    } | null;
    executions: any[];
    checklist?: string | null;
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Hoje":
      return "bg-blue-500";
    case "Pendente":
      return "bg-red-500";
    case "Próxima":
      return "bg-yellow-500";
    case "Executada":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

export function PreventiveTaskDetails({ task }: PreventiveTaskDetailsProps) {
  const router = useRouter();

  const handleExecute = async (executionData: {
    taskId: string;
    description: string;
    checklistResults: string;
    startTime: Date;
    endTime: Date;
  }) => {
    await executeTask(executionData);
  };

  const handleBack = () => {
    router.push(`/preventive?contractId=${task.contractId}&status=pendente`);
  };

  return (
    <div className="space-y-6">
      {/* Header com botão voltar */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
                 <div>
           <h3 className="text-lg font-semibold">{task.ompNumber}</h3>
           <p className="text-sm text-muted-foreground">{task.description}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações principais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informações da Tarefa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <Badge 
                  variant="secondary" 
                  className={`text-white ${getStatusColor(task.status)}`}
                >
                  {task.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Frequência:</span>
                <Badge variant="outline">{task.frequency}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Data Prevista: {format(task.startDate, "dd/MM/yyyy", { locale: ptBR })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações do ativo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Informações do Ativo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Nome:</span>
                <p className="text-sm">{task.assetName}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Tag:</span>
                <p className="text-sm">{task.assetTag}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Localização:</span>
                <p className="text-sm">{task.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Histórico de execuções */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Histórico de Execuções
          </CardTitle>
        </CardHeader>
        <CardContent>
          {task.executions.length > 0 ? (
            <div className="space-y-4">
              {task.executions.map((execution) => (
                <div key={execution.id} className="border-l-2 border-primary pl-4">
                                     <div className="flex items-center gap-2 mb-2">
                     <User className="h-4 w-4 text-muted-foreground" />
                     <span className="text-sm font-medium">
                       {execution.user.name || execution.user.email || "Usuário não identificado"}
                     </span>
                     <span className="text-xs text-muted-foreground">
                       {format(execution.createdAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                     </span>
                   </div>
                  <p className="text-sm text-muted-foreground">{execution.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma execução registrada para esta tarefa.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Botão de ação */}
      {task.status !== "Executada" && (
        <div className="flex justify-end">
          <ExecuteTaskDialog 
            task={task}
            onExecute={handleExecute}
          />
        </div>
      )}
    </div>
  );
} 