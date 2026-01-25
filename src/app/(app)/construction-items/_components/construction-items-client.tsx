"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "./data-table";
import { columns, ConstructionItemColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Filter, X } from "lucide-react";
import { AddConstructionItemDialog } from "./add-construction-item-dialog";
import { EditItemDialog } from "./edit-item-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ConstructionItemsClientProps {
  data: ConstructionItemColumn[];
}

const statuses = [
  { value: "all", label: "Todos", color: "text-foreground", bg: "bg-transparent" },
  { value: "CONCLUIDO", label: "Concluido", color: "text-green-500", bg: "bg-green-500" },
  { value: "IMPROCEDENTE", label: "Improcedente", color: "text-muted-foreground", bg: "bg-gray-500" },
  { value: "EM_ANDAMENTO", label: "Em Andamento", color: "text-blue-500", bg: "bg-blue-500" },
  { value: "AGUARDANDO_VISTORIA", label: "Ag Vistoria", color: "text-amber-500", bg: "bg-amber-500" },
  { value: "FINALIZADO", label: "F. Indevido", color: "text-red-500", bg: "bg-red-500" },
];

const especialidades = [
  { value: "all", label: "Todas" },
  { value: "CIVIL", label: "Civil" },
  { value: "ELETRICA", label: "Elétrica" },
  { value: "HIDRAULICA", label: "Hidráulica" },
  { value: "SISTEMAS", label: "Sistemas" },
];

export function ConstructionItemsClient({ data }: ConstructionItemsClientProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<ConstructionItemColumn | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "all";
  const currentEspecialidade = searchParams.get("especialidade") || "all";
  const currentDateFrom = searchParams.get("dateFrom") || "";
  const currentDateTo = searchParams.get("dateTo") || "";
  const currentSearch = searchParams.get("search") || "";

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("status", status);
    router.push(`${pathname}?${params.toString()}`);
    router.refresh(); // Forçar revalidação da página
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
    router.refresh(); // Forçar revalidação da página
  };

  const clearAllFilters = () => {
    router.push(pathname);
    router.refresh(); // Forçar revalidação da página
  };

  const hasActiveFilters = currentStatus !== "all" ||
    currentEspecialidade !== "all" ||
    currentDateFrom ||
    currentDateTo ||
    currentSearch;

  return (
    <div className="space-y-6">
      {/* Filtros de Status */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center p-1.5 bg-[#0f172a]/60 rounded-full border border-white/5 backdrop-blur-md overflow-x-auto no-scrollbar max-w-full">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => handleStatusChange(status.value)}
              className={cn(
                "flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap",
                currentStatus === status.value
                  ? "bg-background/80 shadow-md text-foreground ring-1 ring-white/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <div className={cn("h-2.5 w-2.5 rounded-full shadow-sm", status.bg)} />
              {status.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Button
            variant="outline"
            onClick={() => setShowFilterDialog(true)}
            className="w-full sm:w-auto"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {hasActiveFilters && (
              <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                {Object.values({ currentStatus, currentEspecialidade, currentDateFrom, currentDateTo, currentSearch }).filter(v => v && v !== "all").length}
              </span>
            )}
          </Button>
          <Button onClick={() => setShowAddDialog(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Novo Item
          </Button>
        </div>
      </div>

      {/* Indicador de filtros ativos */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
          <span className="text-sm font-medium text-primary">Filtros ativos:</span>
          <div className="flex flex-wrap gap-2">
            {currentStatus !== "all" && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20">
                Status: {statuses.find(s => s.value === currentStatus)?.label}
              </span>
            )}
            {currentEspecialidade !== "all" && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20">
                Especialidade: {especialidades.find(e => e.value === currentEspecialidade)?.label}
              </span>
            )}
            {currentDateFrom && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20">
                De: {currentDateFrom}
              </span>
            )}
            {currentDateTo && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20">
                Até: {currentDateTo}
              </span>
            )}
            {currentSearch && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20">
                Busca: {currentSearch}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-6 px-2 text-primary hover:bg-primary/10"
            >
              <X className="h-3 w-3 mr-1" />
              Limpar
            </Button>
          </div>
        </div>
      )}

      {/* Tabela */}
      <DataTable
        columns={columns}
        data={data}
        onDataUpdate={(id, updates) => {
          // Atualizar dados locais se necessário
          console.log('Dados atualizados:', id, updates);
        }}
        meta={{
          openEditDialog: (item: ConstructionItemColumn) => {
            setEditingItem(item);
          },
          updateTableData: (updatedItem: ConstructionItemColumn) => {
            // Atualizar o item na tabela imediatamente
            const updatedData = data.map(item =>
              item.id === updatedItem.id ? updatedItem : item
            );
            // Forçar re-render da tabela
            router.refresh();
          },
        }}
      />

      {/* Dialog para Adicionar Item */}
      <AddConstructionItemDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />

      {/* Dialog para Editar Item */}
      {editingItem && (
        <EditItemDialog
          item={editingItem}
          open={!!editingItem}
          onOpenChange={(open) => {
            if (!open) setEditingItem(null);
          }}
          onSuccess={(updatedItem) => {
            setEditingItem(null);
            if (updatedItem) {
              // Atualizar a tabela imediatamente
              router.refresh();
            }
          }}
        />
      )}

      {/* Dialog de Filtros Avançados */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filtros Avançados</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="search">Buscar por número ou descrição</Label>
              <Input
                id="search"
                placeholder="Digite para buscar..."
                value={currentSearch}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="especialidade">Especialidade</Label>
              <Select
                value={currentEspecialidade}
                onValueChange={(value) => handleFilterChange("especialidade", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a especialidade" />
                </SelectTrigger>
                <SelectContent>
                  {especialidades.map((esp) => (
                    <SelectItem key={esp.value} value={esp.value}>
                      {esp.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateFrom">Data de abertura (de)</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={currentDateFrom}
                  onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dateTo">Data de abertura (até)</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={currentDateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={clearAllFilters}
              >
                Limpar Filtros
              </Button>
              <Button onClick={() => setShowFilterDialog(false)}>
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 