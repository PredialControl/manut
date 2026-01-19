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
  { value: "all", label: "Todos", color: "bg-slate-500" },
  { value: "CONCLUIDO", label: "Concluido", color: "bg-green-500" },
  { value: "IMPROCEDENTE", label: "Improcedente", color: "bg-gray-500" },
  { value: "EM_ANDAMENTO", label: "Em Andamento", color: "bg-blue-500" },
  { value: "AGUARDANDO_VISTORIA", label: "Ag Vistoria", color: "bg-orange-500" },
  { value: "FINALIZADO", label: "F. Indevido", color: "bg-red-500" },
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
        <div className="flex flex-wrap items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/50">
          {statuses.map((status) => (
            <Button
              key={status.value}
              variant="ghost"
              className={cn(
                "rounded-md px-2 lg:px-4 py-2 text-xs lg:text-sm font-medium transition-all",
                currentStatus === status.value
                  ? "bg-background text-primary shadow-sm border border-border/50"
                  : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
              )}
              onClick={() => handleStatusChange(status.value)}
            >
              <span className={cn("mr-1 lg:mr-2 h-2 w-2 rounded-full", status.color)} />
              <span className="hidden sm:inline">{status.label}</span>
              <span className="sm:hidden">{status.label.split(' ')[0]}</span>
            </Button>
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