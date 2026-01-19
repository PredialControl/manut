"use client";

import { useState } from "react";
import { ColumnDef, Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export type ConstructionItemColumn = {
  id: string;
  number: string;
  description: string;
  status: string;
  especialidade?: string | null;
  openedAt: Date;
  deadline?: Date | null;
  rescheduledDate?: Date | null;
  feedback: string;
  contractName: string;
};



const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "em_andamento":
      return "bg-blue-500";
    case "finalizado":
      return "bg-red-500";
    case "improcedente":
      return "bg-gray-500";
    case "aguardando_vistoria":
      return "bg-orange-500";
    case "concluido":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const formatStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case "em_andamento":
      return "Em Andamento";
    case "finalizado":
      return "F. Indevido";
    case "improcedente":
      return "Improcedente";
    case "aguardando_vistoria":
      return "Ag Vistoria";
    case "concluido":
      return "Concluido";
    default:
      return status;
  }
};

export const columns: ColumnDef<ConstructionItemColumn>[] = [
  {
    accessorKey: "number",
    header: "Nº do Chamado",
    cell: ({ row }) => {
      const number = row.getValue("number") as string;
      return (
        <div className="font-mono text-sm font-medium">
          {number}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Pendência:",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-md">
          <p 
            className="text-sm truncate cursor-help" 
            title={description}
          >
            {description}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "especialidade",
    header: "Especialidade",
    cell: ({ row }) => {
      const especialidade = row.getValue("especialidade") as string | null;
      
      if (!especialidade) {
        return (
          <span className="text-sm text-muted-foreground">
            Não definida
          </span>
        );
      }
      
      const getEspecialidadeColor = (esp: string) => {
        switch (esp.toUpperCase()) {
          case "CIVIL":
            return "bg-blue-100 text-blue-800";
          case "ELETRICA":
            return "bg-yellow-100 text-yellow-800";
          case "HIDRAULICA":
            return "bg-cyan-100 text-cyan-800";
          case "SISTEMAS":
            return "bg-purple-100 text-purple-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
      };
      
      const formatEspecialidade = (esp: string) => {
        switch (esp.toUpperCase()) {
          case "CIVIL":
            return "Civil";
          case "ELETRICA":
            return "Elétrica";
          case "HIDRAULICA":
            return "Hidráulica";
          case "SISTEMAS":
            return "Sistemas";
          default:
            return esp;
        }
      };
      
      return (
        <Badge 
          variant="secondary" 
          className={getEspecialidadeColor(especialidade)}
        >
          {formatEspecialidade(especialidade)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Situação",
    cell: ({ row, table }) => {
      const status = row.getValue("status") as string;
      const [isEditing, setIsEditing] = useState(false);
      const [editStatus, setEditStatus] = useState(status);

      const handleStatusChange = async (newStatus: string) => {
        try {
          const response = await fetch(`/api/construction-items/${row.original.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
          });

          if (response.ok) {
            // Atualizar a tabela
            (table.options.meta as any)?.updateData(row.original.id, { status: newStatus });
            setIsEditing(false);
          } else {
            console.error('Erro ao atualizar status');
          }
        } catch (error) {
          console.error('Erro ao atualizar status:', error);
        }
      };

      if (isEditing) {
        return (
          <div className="flex items-center gap-2">
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="text-sm border rounded px-2 py-1"
              autoFocus
            >
              <option value="EM_ANDAMENTO">Em Andamento</option>
              <option value="CONCLUIDO">Concluido</option>
              <option value="IMPROCEDENTE">Improcedente</option>
              <option value="AGUARDANDO_VISTORIA">Ag Vistoria</option>
              <option value="FINALIZADO">F. Indevido</option>
            </select>
            <Button
              size="sm"
              onClick={() => handleStatusChange(editStatus)}
              className="h-6 px-2"
            >
              ✓
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditStatus(status);
                setIsEditing(false);
              }}
              className="h-6 px-2"
            >
              ✕
            </Button>
          </div>
        );
      }

      return (
        <div 
          className="cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          <Badge 
            variant="secondary" 
            className={`text-white ${getStatusColor(status)}`}
          >
            {formatStatus(status)}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "openedAt",
    header: "Data Abertura",
    cell: ({ row }) => {
      const openedAt = row.getValue("openedAt") as Date;
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {format(openedAt, "dd/MM/yyyy", { locale: ptBR })}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "deadline",
    header: "Prazo",
    cell: ({ row }) => {
      const deadline = row.getValue("deadline") as Date | null;
      
      if (!deadline) {
        return (
          <span className="text-sm text-muted-foreground">
            Sem prazo definido
          </span>
        );
      }
      
      const isOverdue = deadline < new Date();
      
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
            {format(deadline, "dd/MM/yyyy", { locale: ptBR })}
          </span>
          {isOverdue && (
            <Badge variant="destructive" className="text-xs">
              Vencido
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "rescheduledDate",
    header: "Data reprogramação",
    cell: ({ row }) => {
      const rescheduledDate = row.getValue("rescheduledDate") as Date | null;
      
      if (!rescheduledDate) {
        return (
          <span className="text-sm text-muted-foreground">
            Não reprogramado
          </span>
        );
      }
      
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {format(rescheduledDate, "dd/MM/yyyy", { locale: ptBR })}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "feedback",
    header: "Retorno da construtora",
    cell: ({ row }) => {
      const feedback = row.getValue("feedback") as string;
      
      if (!feedback) {
        return (
          <span className="text-sm text-muted-foreground">
            Sem retorno
          </span>
        );
      }
      
      return (
        <div className="max-w-md">
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p 
              className="text-sm truncate cursor-help" 
              title={feedback}
            >
              {feedback}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const item = row.original;
      
      return (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            // Abrir modal de edição
            (table.options.meta as any)?.openEditDialog(item);
          }}
        >
          <Edit className="h-4 w-4 mr-1" />
          Editar
        </Button>
      );
    },
  },
]; 