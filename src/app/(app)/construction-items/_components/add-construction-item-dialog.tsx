"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createConstructionItem } from "../_actions/create-construction-item";

interface AddConstructionItemDialogProps {
  open: boolean;
  onClose: () => void;
}

const statuses = [
  { value: "EM_ANDAMENTO", label: "Em andamento" },
  { value: "AGUARDANDO_VISTORIA", label: "Aguardando vistoria" },
  { value: "CONCLUIDO", label: "Concluído" },
  { value: "FINALIZADO", label: "Finalizado" },
  { value: "IMPROCEDENTE", label: "Improcedente" },
];

const especialidades = [
  { value: "CIVIL", label: "Civil" },
  { value: "ELETRICA", label: "Elétrica" },
  { value: "HIDRAULICA", label: "Hidráulica" },
  { value: "SISTEMAS", label: "Sistemas" },
];

export function AddConstructionItemDialog({ open, onClose }: AddConstructionItemDialogProps) {
  const searchParams = useSearchParams();
  const contractId = searchParams.get('contractId');
  const [formData, setFormData] = useState({
    number: "",
    description: "",
    status: "EM_ANDAMENTO",
    especialidade: "",
    openedAt: new Date().toISOString().split('T')[0],
    deadline: "",
    feedback: "",
  });
  
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(createConstructionItem, initialState);

  useEffect(() => {
    if (state?.message === "SUCCESS") {
      toast.success("Item criado com sucesso!");
      setFormData({
        number: "",
        description: "",
        status: "EM_ANDAMENTO",
        especialidade: "",
        openedAt: new Date().toISOString().split('T')[0],
        deadline: "",
        feedback: "",
      });
      onClose();
    } else if (state?.message && !state.message.includes("validação")) {
      toast.error(state.message);
    }
  }, [state, onClose]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Se a data de abertura foi alterada, calcular automaticamente o prazo
    if (field === "openedAt" && value) {
      const calculateDeadline = (openedAt: string) => {
        if (!openedAt) return '';
        
        const [year, month, day] = openedAt.split('-');
        
        // Criar data usando string ISO para evitar problemas de timezone
        const openedDate = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00.000Z`);
        
        // Adicionar 35 dias
        const deadlineDate = new Date(openedDate);
        deadlineDate.setDate(deadlineDate.getDate() + 35);
        
        // Formatar para input type="date"
        const deadlineYear = deadlineDate.getFullYear();
        const deadlineMonth = String(deadlineDate.getMonth() + 1).padStart(2, '0');
        const deadlineDay = String(deadlineDate.getDate()).padStart(2, '0');
        
        return `${deadlineYear}-${deadlineMonth}-${deadlineDay}`;
      };
      
      const calculatedDeadline = calculateDeadline(value);
      setFormData(prev => ({ ...prev, deadline: calculatedDeadline }));
    }
  };

  const handleClose = () => {
    setFormData({
      number: "",
      description: "",
      status: "EM_ANDAMENTO",
      especialidade: "",
      openedAt: new Date().toISOString().split('T')[0],
      deadline: "",
      feedback: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] w-[95vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Item da Construtora</DialogTitle>
        </DialogHeader>

        <form action={dispatch} className="space-y-4">
          <input type="hidden" name="contractId" value={contractId || ""} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="number">Número do Chamado</Label>
              <Input
                id="number"
                name="number"
                value={formData.number}
                onChange={(e) => handleInputChange("number", e.target.value)}
                placeholder="Ex: 72246"
              />
              {state?.errors?.number && (
                <p className="text-sm text-red-600 mt-1">
                  {state.errors.number[0]}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="status">Situação</Label>
              <Select 
                name="status" 
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a situação" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.errors?.status && (
                <p className="text-sm text-red-600 mt-1">
                  {state.errors.status[0]}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="especialidade">Especialidade</Label>
              <Select 
                name="especialidade" 
                value={formData.especialidade}
                onValueChange={(value) => handleInputChange("especialidade", value)}
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
              {state?.errors?.especialidade && (
                <p className="text-sm text-red-600 mt-1">
                  {state.errors.especialidade[0]}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Pendência/Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descreva a pendência ou problema..."
              rows={3}
            />
            {state?.errors?.description && (
              <p className="text-sm text-red-600 mt-1">
                {state.errors.description[0]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="openedAt">Data de Abertura</Label>
              <Input
                id="openedAt"
                name="openedAt"
                type="date"
                value={formData.openedAt}
                onChange={(e) => handleInputChange("openedAt", e.target.value)}
              />
              {state?.errors?.openedAt && (
                <p className="text-sm text-red-600 mt-1">
                  {state.errors.openedAt[0]}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="deadline">Prazo (35 dias após abertura)</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange("deadline", e.target.value)}
                className="border-blue-200 bg-blue-50"
                title="Prazo calculado automaticamente como 35 dias após a data de abertura"
              />
              <p className="text-xs text-blue-600 mt-1">
                ⚡ Calculado automaticamente (você pode editar se necessário)
              </p>
              {state?.errors?.deadline && (
                <p className="text-sm text-red-600 mt-1">
                  {state.errors.deadline[0]}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="feedback">Retorno/Observações (Opcional)</Label>
            <Textarea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={(e) => handleInputChange("feedback", e.target.value)}
              placeholder="Observações, retorno ou atualizações..."
              rows={3}
            />
            {state?.errors?.feedback && (
              <p className="text-sm text-red-600 mt-1">
                {state.errors.feedback[0]}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Criar Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 