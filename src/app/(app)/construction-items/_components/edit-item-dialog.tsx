"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import { ConstructionItemColumn } from "./columns";

interface EditItemDialogProps {
  item: ConstructionItemColumn;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedItem?: ConstructionItemColumn) => void;
}

export function EditItemDialog({ item, open, onOpenChange, onSuccess }: EditItemDialogProps) {
  const [loading, setLoading] = useState(false);
  
  // Função para formatar data para input type="date"
  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    
    // Usar métodos locais para evitar problemas de timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    number: item.number,
    description: item.description,
    status: item.status,
    especialidade: item.especialidade || '',
    openedAt: formatDateForInput(item.openedAt),
    deadline: formatDateForInput(item.deadline || null),
    rescheduledDate: formatDateForInput(item.rescheduledDate || null),
    feedback: item.feedback,
  });

  // Função para calcular prazo de 35 dias
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

  // Função para atualizar prazo quando data de abertura mudar
  const handleOpenedAtChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      openedAt: value,
      deadline: calculateDeadline(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Enviar datas como strings simples SEM conversão alguma
      const processDate = (dateString: string) => {
        if (!dateString) return null;
        
        // Se está no formato YYYY-MM-DD, enviar como string simples
        if (dateString.includes('-')) {
          return dateString; // Enviar exatamente como está
        }
        
        // Se está no formato dd/MM, converter para YYYY-MM-DD
        if (dateString.includes('/')) {
          const [day, month] = dateString.split('/');
          const currentYear = new Date().getFullYear();
          return `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        
        return dateString;
      };

      const response = await fetch(`/api/construction-items/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: formData.number,
          description: formData.description,
          status: formData.status,
          especialidade: formData.especialidade || null,
          openedAt: processDate(formData.openedAt),
          deadline: processDate(formData.deadline),
          rescheduledDate: processDate(formData.rescheduledDate),
          feedback: formData.feedback,
        }),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        toast.success("Item atualizado com sucesso!");
        // Forçar refresh da página para garantir que todos os dados sejam atualizados
        window.location.reload();
        onSuccess(updatedItem);
        onOpenChange(false);
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao atualizar item");
      }
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      toast.error("Erro ao atualizar item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Item da Construtora</DialogTitle>
          <DialogDescription>
            Edite os dados do item. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
                           <div className="grid grid-cols-3 gap-4">
                   <div>
                     <Label htmlFor="number">Nº do Chamado</Label>
                     <Input
                       id="number"
                       value={formData.number}
                       onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                       required
                     />
                   </div>

                   <div>
                     <Label htmlFor="status">Situação</Label>
                     <Select
                       value={formData.status}
                       onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                     >
                       <SelectTrigger>
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
                         <SelectItem value="CONCLUIDO">Concluido</SelectItem>
                         <SelectItem value="IMPROCEDENTE">Improcedente</SelectItem>
                         <SelectItem value="AGUARDANDO_VISTORIA">Ag Vistoria</SelectItem>
                         <SelectItem value="FINALIZADO">F. Indevido</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>

                   <div>
                     <Label htmlFor="especialidade">Especialidade</Label>
                     <Select
                       value={formData.especialidade}
                       onValueChange={(value) => setFormData(prev => ({ ...prev, especialidade: value }))}
                     >
                       <SelectTrigger>
                         <SelectValue placeholder="Selecione a especialidade" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="CIVIL">Civil</SelectItem>
                         <SelectItem value="ELETRICA">Elétrica</SelectItem>
                         <SelectItem value="HIDRAULICA">Hidráulica</SelectItem>
                         <SelectItem value="SISTEMAS">Sistemas</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                 </div>

          <div>
            <Label htmlFor="description">Pendência</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="openedAt">Data de Abertura</Label>
              <Input
                id="openedAt"
                type="date"
                value={formData.openedAt}
                onChange={(e) => handleOpenedAtChange(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="deadline">Prazo (35 dias após abertura)</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="border-blue-200 bg-blue-50"
                title="Prazo calculado automaticamente como 35 dias após a data de abertura"
              />
              <p className="text-xs text-blue-600 mt-1">
                ⚡ Calculado automaticamente (você pode editar se necessário)
              </p>
            </div>
            
            <div>
              <Label htmlFor="rescheduledDate">Data de Reprogramação</Label>
              <Input
                id="rescheduledDate"
                type="date"
                value={formData.rescheduledDate}
                onChange={(e) => setFormData(prev => ({ ...prev, rescheduledDate: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="feedback">Retorno da Construtora</Label>
            <Textarea
              id="feedback"
              value={formData.feedback}
              onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
              rows={3}
              placeholder="Digite o retorno da construtora..."
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 