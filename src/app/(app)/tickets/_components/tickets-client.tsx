"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "./data-table";
import { columns, TicketColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";

interface TicketsClientProps {
  data: TicketColumn[];
  buildings: Array<{ id: string; name: string }>;
  contractId: string;
}

const statuses = [
  { value: "all", label: "Todos" },
  { value: "itens_apontados", label: "Itens Apontados" },
  { value: "em_andamento", label: "Em Andamento" },
  { value: "improcedente", label: "Improcedente" },
  { value: "aguardando_vistoria", label: "Ag. Vistoria" },
  { value: "concluido", label: "Concluído" },
  { value: "f_indevido", label: "F. Indevido" },
];

export function TicketsClient({ data, buildings, contractId }: TicketsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "all";

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("status", status);
    router.push(`${pathname}?${params.toString()}`);
    router.refresh();
  };

  const handleNewTicket = () => {
    router.push(`/tickets/new?contractId=${contractId}`);
  };

  return (
    <div className="space-y-4">
      {/* Header com filtros */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {statuses.map((status) => (
            <Button
              key={status.value}
              variant={currentStatus === status.value ? "default" : "outline"}
              onClick={() => handleStatusChange(status.value)}
              size="sm"
            >
              {status.label}
            </Button>
          ))}
        </div>

        <Button onClick={handleNewTicket}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Chamado
        </Button>
      </div>

      {/* Tabela */}
      <DataTable columns={columns} data={data} />
    </div>
  );
}
