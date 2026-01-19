"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FormattedPlan } from "../page";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TasksDialog } from "./tasks-dialog";
import { AddTaskButton } from "./add-task-button";
import { DeletePlanDialog } from "./delete-plan-dialog";

export const columns: ColumnDef<FormattedPlan>[] = [
  {
    accessorKey: "acronym",
    header: "Sigla",
  },
  {
    accessorKey: "name",
    header: "Plano / Descrição",
  },
  {
    accessorKey: "sistema",
    header: "Sistema",
  },
  {
    accessorKey: "periodicidade",
    header: "Periodicidade",
  },
  {
    accessorKey: "atividade",
    header: "Atividade",
    cell: ({ row }) => {
      const atividade = row.original.atividade;
      if (!atividade) return "N/A";

      // Mostrar apenas os primeiros 50 caracteres + "..."
      const shortAtividade = atividade.length > 50
        ? atividade.substring(0, 50) + "..."
        : atividade;

      return (
        <div className="max-w-xs truncate" title={atividade}>
          {shortAtividade}
        </div>
      );
    }
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row, table }) => {
      const plan = row.original;
      const { onEdit } = table.options.meta as any;

      return (
        <div className="flex space-x-2">
          <TasksDialog plan={plan} />
          <AddTaskButton plan={plan} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(plan)}
          >
            Editar
          </Button>
          <DeletePlanDialog id={plan.id} name={plan.acronym} />
        </div>
      );
    },
  },
]; 