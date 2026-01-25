"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { DataTable } from "./data-table"
import { createColumns, CorrectiveCallColumn } from "./columns"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Plus, Filter, X, Building2, Zap, Droplets, Snowflake, Cog, Flame, Wrench, Sparkles, Leaf } from "lucide-react"
import { AddCorrectiveDialog } from "./add-corrective-dialog"
import { EditCorrectiveDialog } from "./edit-corrective-dialog"
import { ExecuteCorrectiveDialog } from "./execute-corrective-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface CorrectiveListClientProps {
  data: CorrectiveCallColumn[]
  contractId?: string
}

const statuses = [
  { value: "todos", label: "Todos", color: "text-foreground", bg: "bg-transparent" },
  { value: "ABERTO", label: "Pendente", color: "text-blue-500", bg: "bg-blue-500" },
  { value: "EM_ANDAMENTO", label: "Em Andamento", color: "text-amber-500", bg: "bg-amber-500" },
  { value: "CONCLUIDO", label: "Concluído", color: "text-green-500", bg: "bg-green-500" },
  { value: "CANCELADO", label: "Cancelado", color: "text-muted-foreground", bg: "bg-gray-500" },
];

const priorities = [
  { value: "all", label: "Todas" },
  { value: "ALTA", label: "Alta" },
  { value: "MEDIA", label: "Média" },
  { value: "BAIXA", label: "Baixa" },
];

const especialidades = [
  { value: "CIVIL", label: "Civil", icon: Building2, color: "bg-orange-500" },
  { value: "ELETRICA", label: "Elétrica", icon: Zap, color: "bg-yellow-500" },
  { value: "HIDRAULICA", label: "Hidráulica", icon: Droplets, color: "bg-blue-500" },
  { value: "AR_CONDICIONADO", label: "Ar Condicionado", icon: Snowflake, color: "bg-cyan-500" },
  { value: "MECANICA", label: "Mecânica", icon: Wrench, color: "bg-gray-500" },
  { value: "AQUECIMENTO", label: "Aquecimento", icon: Flame, color: "bg-red-500" },
  { value: "LIMPEZA", label: "Limpeza", icon: Sparkles, color: "bg-purple-500" },
  { value: "JARDINAGEM", label: "Jardinagem", icon: Leaf, color: "bg-green-500" },
];

export function CorrectiveListClient({ data, contractId }: CorrectiveListClientProps) {
  const [showFilterDialog, setShowFilterDialog] = useState(false)
  const [showEspecialidadeDialog, setShowEspecialidadeDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showExecuteDialog, setShowExecuteDialog] = useState(false)
  const [selectedEspecialidade, setSelectedEspecialidade] = useState<string>("")
  const [selectedCorrectiveCall, setSelectedCorrectiveCall] = useState<CorrectiveCallColumn | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentStatus = searchParams.get("status") || "todos"
  const currentPriority = searchParams.get("priority") || "all"
  const currentSearch = searchParams.get("search") || ""
  const currentDateFrom = searchParams.get("dateFrom") || ""
  const currentDateTo = searchParams.get("dateTo") || ""

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("status", status)
    router.push(`${pathname}?${params.toString()}`)
    router.refresh() // Forçar revalidação da página
  }

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== "all" && value !== "todos") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
    router.refresh() // Forçar revalidação da página
  }

  const clearAllFilters = () => {
    router.push(pathname)
    router.refresh() // Forçar revalidação da página
  }

  const handleNovaCorretiva = () => {
    setShowEspecialidadeDialog(true)
  }

  const handleEspecialidadeSelect = (especialidade: string) => {
    setSelectedEspecialidade(especialidade)
    setShowEspecialidadeDialog(false)
    setShowAddDialog(true)
  }

  const handleEdit = (correctiveCall: CorrectiveCallColumn) => {
    setSelectedCorrectiveCall(correctiveCall)
    setShowEditDialog(true)
  }

  const handleCloseEdit = () => {
    setShowEditDialog(false)
    setSelectedCorrectiveCall(null)
  }

  const handleView = (correctiveCall: CorrectiveCallColumn) => {
    // TODO: Implementar visualização detalhada
    console.log("Visualizar corretiva:", correctiveCall)
    toast.info("Funcionalidade de visualização em desenvolvimento")
  }

  const handleExecute = (correctiveCall: CorrectiveCallColumn) => {
    setSelectedCorrectiveCall(correctiveCall);
    setShowExecuteDialog(true);
  };

  const hasActiveFilters = currentStatus !== "todos" ||
    currentPriority !== "all" ||
    currentDateFrom ||
    currentDateTo ||
    currentSearch;

  const columns = createColumns({
    onEdit: handleEdit,
    onView: handleView,
    onExecute: handleExecute,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-border/30">
        <div className="flex items-center p-1.5 bg-[#0f172a]/60 rounded-full border border-white/5 backdrop-blur-md overflow-x-auto no-scrollbar max-w-full">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => handleStatusChange(status.value)}
              className={cn(
                "flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
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

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Button
            variant="outline"
            onClick={() => setShowFilterDialog(true)}
            className="flex-1 lg:flex-none h-11 rounded-xl bg-background border-border/50 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <Filter className="h-4 w-4 mr-2 text-primary" />
            Filtros
            {hasActiveFilters && (
              <span className="ml-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full px-2 py-0.5">
                {Object.values({ currentStatus, currentPriority, currentDateFrom, currentDateTo, currentSearch }).filter(v => v && v !== "all" && v !== "todos").length}
              </span>
            )}
          </Button>
          <Button
            onClick={handleNovaCorretiva}
            className="flex-1 lg:flex-none h-11 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Corretiva
          </Button>
        </div>
      </div>

      {/* Indicador de filtros ativos */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-blue-700">Filtros ativos:</span>
          <div className="flex flex-wrap gap-2">
            {currentStatus !== "todos" && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Status: {statuses.find(s => s.value === currentStatus)?.label}
              </span>
            )}
            {currentPriority !== "all" && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Prioridade: {priorities.find(p => p.value === currentPriority)?.label}
              </span>
            )}
            {currentDateFrom && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                De: {currentDateFrom}
              </span>
            )}
            {currentDateTo && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Até: {currentDateTo}
              </span>
            )}
            {currentSearch && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Busca: {currentSearch}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-6 px-2 text-blue-700 hover:bg-blue-100"
            >
              <X className="h-3 w-3 mr-1" />
              Limpar
            </Button>
          </div>
        </div>
      )}

      {/* Tabela */}
      <DataTable columns={columns} data={data} />

      {/* Dialog para Seleção de Especialidade */}
      <Dialog open={showEspecialidadeDialog} onOpenChange={setShowEspecialidadeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">Qual chamado deseja abrir?</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {especialidades.map((esp) => {
              const IconComponent = esp.icon
              return (
                <Button
                  key={esp.value}
                  variant="outline"
                  className="h-32 flex flex-col items-center justify-center gap-4 p-6 hover:bg-slate-50 hover:scale-105 transition-all duration-200 border-2 hover:border-primary"
                  onClick={() => handleEspecialidadeSelect(esp.value)}
                >
                  <div className={`p-4 rounded-full ${esp.color} text-white`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <span className="text-base font-semibold text-center">{esp.label}</span>
                </Button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para Adicionar Corretiva */}
      {contractId && (
        <AddCorrectiveDialog
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          contractId={contractId}
          especialidade={selectedEspecialidade}
        />
      )}

      {/* Dialog para Editar Corretiva */}
      {contractId && selectedCorrectiveCall && (
        <EditCorrectiveDialog
          open={showEditDialog}
          onClose={handleCloseEdit}
          contractId={contractId}
          correctiveCall={{
            id: selectedCorrectiveCall.id,
            description: selectedCorrectiveCall.description,
            priority: selectedCorrectiveCall.priority,
            assetId: selectedCorrectiveCall.assetId,
            assetName: selectedCorrectiveCall.assetName,
            locationName: selectedCorrectiveCall.locationName,
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
              <Label htmlFor="search">Buscar por título ou descrição</Label>
              <Input
                id="search"
                placeholder="Digite para buscar..."
                value={currentSearch}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select
                value={currentPriority}
                onValueChange={(value) => handleFilterChange("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
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

      {selectedCorrectiveCall && (
        <ExecuteCorrectiveDialog
          open={showExecuteDialog}
          onClose={() => setShowExecuteDialog(false)}
          correctiveCall={selectedCorrectiveCall}
        />
      )}
    </div>
  )
} 