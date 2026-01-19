"use client";

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Play } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export type CorrectiveCallColumn = {
  id: string
  omcNumber: string
  title: string
  description: string
  priority: string
  status: string
  assetName?: string
  locationName?: string
  assetId?: string
  assetTag?: string
  createdAt: Date
}

interface ColumnsProps {
  onEdit: (correctiveCall: CorrectiveCallColumn) => void;
  onView: (correctiveCall: CorrectiveCallColumn) => void;
  onExecute: (correctiveCall: CorrectiveCallColumn) => void;
}

export const createColumns = ({ onEdit, onView, onExecute }: ColumnsProps): ColumnDef<CorrectiveCallColumn>[] => [
  {
    accessorKey: "omcNumber",
    header: "Nº da OM",
    cell: ({ row }) => {
      const omcNumber = row.getValue("omcNumber") as string;
      return (
        <div className="font-medium text-blue-600">
          {omcNumber || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-xs truncate" title={description}>
          {description}
        </div>
      );
    },
  },
  {
    accessorKey: "assetTag",
    header: "Ativo",
    cell: ({ row }) => {
      const assetTag = row.getValue("assetTag") as string;

      if (assetTag) {
        return (
          <div className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
            {assetTag}
          </div>
        );
      }

      return (
        <div className="text-sm text-gray-500 italic">
          Não especificado
        </div>
      );
    },
  },
  {
    accessorKey: "locationName",
    header: "Localidade",
    cell: ({ row }) => {
      const locationName = row.getValue("locationName") as string;
      return (
        <div className="text-sm text-gray-600">
          {locationName || "Não especificado"}
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Prioridade",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      const getPriorityColor = (priority: string) => {
        switch (priority) {
          case "ALTA":
            return "bg-red-100 text-red-700 border-red-200";
          case "MEDIA":
            return "bg-amber-100 text-amber-700 border-amber-200";
          case "BAIXA":
            return "bg-green-100 text-green-700 border-green-200";
          default:
            return "bg-gray-100 text-gray-700 border-gray-200";
        }
      };
      return (
        <Badge variant="outline" className={cn("border font-semibold shadow-none px-3 py-0.5 rounded-full", getPriorityColor(priority))}>
          {priority === "ALTA" && "Alta"}
          {priority === "MEDIA" && "Média"}
          {priority === "BAIXA" && "Baixa"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const getStatusColor = (status: string) => {
        switch (status) {
          case "ABERTO":
            return "bg-blue-100 text-blue-700 border-blue-200";
          case "EM_ANDAMENTO":
            return "bg-amber-100 text-amber-700 border-amber-200";
          case "CONCLUIDO":
            return "bg-green-100 text-green-700 border-green-200";
          case "CANCELADO":
            return "bg-gray-100 text-gray-700 border-gray-200";
          default:
            return "bg-gray-100 text-gray-700 border-gray-200";
        }
      };
      return (
        <Badge variant="outline" className={cn("border font-semibold shadow-none px-3 py-0.5 rounded-full", getStatusColor(status))}>
          {status === "ABERTO" && "Aberto"}
          {status === "EM_ANDAMENTO" && "Em Andamento"}
          {status === "CONCLUIDO" && "Concluído"}
          {status === "CANCELADO" && "Cancelado"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center w-full">Ações</div>
    ),
    cell: ({ row }) => {
      const correctiveCall = row.original;

      return (
        <TooltipProvider>
          <div className="flex items-center justify-center gap-1 w-full">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(correctiveCall)}
                  className="h-9 w-9 p-0 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 hover:scale-105"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Visualizar detalhes</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(correctiveCall)}
                  className="h-9 w-9 p-0 rounded-full hover:bg-green-100 hover:text-green-700 transition-all duration-200 hover:scale-105"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar corretiva</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onExecute(correctiveCall)}
                  className="h-9 w-9 p-0 rounded-full hover:bg-orange-100 hover:text-orange-700 transition-all duration-200 hover:scale-105"
                >
                  <Play className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Executar corretiva</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      );
    },
  },
]; 