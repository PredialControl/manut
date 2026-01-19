"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export type PreventiveTaskColumn = {
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
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Hoje":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Pendente":
      return "bg-red-100 text-red-700 border-red-200";
    case "Próxima":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Executada":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export const columns: ColumnDef<PreventiveTaskColumn>[] = [
  {
    accessorKey: "ompNumber",
    header: "OM",
    cell: ({ row }) => {
      const ompNumber = row.getValue("ompNumber") as string;
      return (
        <div className="font-mono text-sm">
          {ompNumber}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      const assetName = row.original.assetName;
      const assetTag = row.original.assetTag;

      return (
        <div className="space-y-1 max-w-[300px]">
          <div className="font-medium truncate cursor-help" title={description}>{description}</div>
          <div className="text-sm text-muted-foreground truncate cursor-help" title={`${assetName} (${assetTag})`}>
            {assetName} ({assetTag})
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Localização",
    cell: ({ row }) => {
      const location = row.getValue("location") as string;
      return (
        <div className="flex items-center gap-2 max-w-[200px]">
          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm truncate cursor-help" title={location}>{location}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "frequency",
    header: "Frequência",
    cell: ({ row }) => {
      const frequency = row.getValue("frequency") as string;
      return (
        <Badge variant="outline">
          {frequency}
        </Badge>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "Data Prevista",
    cell: ({ row }) => {
      const startDate = row.getValue("startDate") as Date;
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {format(startDate, "dd/MM/yyyy", { locale: ptBR })}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant="outline"
          className={cn("border font-semibold shadow-none px-3 py-0.5 rounded-full", getStatusColor(status))}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "lastExecution",
    header: "Última Execução",
    cell: ({ row }) => {
      const lastExecution = row.original.lastExecution;

      if (!lastExecution) {
        return (
          <span className="text-sm text-muted-foreground">
            Nunca executada
          </span>
        );
      }

      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm truncate cursor-help" title={lastExecution.user.name || ''}>{lastExecution.user.name}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {format(lastExecution.createdAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const task = row.original;

      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // TODO: Implementar ação de executar/ver detalhes da tarefa
            console.log("Executar tarefa:", task.id);
          }}
        >
          {task.status === "Executada" ? "Ver Detalhes" : "Executar"}
        </Button>
      );
    },
  },
]; 