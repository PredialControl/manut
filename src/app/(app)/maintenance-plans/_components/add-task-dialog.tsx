"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { addTask } from "../_actions/add-task";
import { FormattedPlan } from "../page";

interface AddTaskDialogProps {
  plan?: FormattedPlan;
  open?: boolean;
  onClose?: () => void;
  planId?: string;
}

function SubmitButton() {
    const pending = false; // Placeholder
    return <Button type="submit" disabled={pending}>{pending ? 'Salvando...' : 'Adicionar Tarefa'}</Button>;
}

export function AddTaskDialog({ plan, open: externalOpen, onClose, planId }: AddTaskDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [checklistItems, setChecklistItems] = useState<string[]>([""]);
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(addTask, initialState);

  // Usar open externo se fornecido, senão usar interno
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = externalOpen !== undefined ? onClose || (() => {}) : setInternalOpen;
  const currentPlanId = planId || plan?.id;

  // Reset checklist quando abrir
  useEffect(() => {
    if (isOpen) {
      setChecklistItems([""]);
    }
  }, [isOpen]);

  // Lidar com o resultado da action
  useEffect(() => {
    if (state?.message === "SUCCESS") {
      toast.success("Tarefa adicionada com sucesso!");
      setIsOpen(false);
      setChecklistItems([""]); // Reset checklist
    } else if (state?.message && !state.message.includes("validação")) {
      toast.error(state.message);
    }
  }, [state, setIsOpen]);

  const handleAddChecklistItem = () => {
    setChecklistItems([...checklistItems, ""]);
  };

  const handleRemoveChecklistItem = (index: number) => {
    if (checklistItems.length > 1) {
      setChecklistItems(checklistItems.filter((_, i) => i !== index));
    }
  };

  const handleChecklistChange = (index: number, value: string) => {
    const newItems = [...checklistItems];
    newItems[index] = value;
    setChecklistItems(newItems);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar Tarefa ao Plano: {plan?.name || "Plano"}</DialogTitle>
        </DialogHeader>
        <form action={dispatch} className="space-y-4">
          <input type="hidden" name="planId" value={currentPlanId} />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sistema">Sistema</Label>
              <Input 
                id="sistema" 
                name="sistema" 
                placeholder="Ex: Sistema Hidráulico"
                required 
              />
              {state?.errors?.sistema && <p className="text-xs text-destructive mt-1">{state.errors.sistema[0]}</p>}
            </div>
            
            <div>
              <Label htmlFor="atividade">Atividade</Label>
              <Input 
                id="atividade" 
                name="atividade" 
                placeholder="Ex: Verificar pressão"
                required 
              />
              {state?.errors?.atividade && <p className="text-xs text-destructive mt-1">{state.errors.atividade[0]}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="periodicidade">Periodicidade</Label>
              <Select name="periodicidade" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a periodicidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Diária">Diária</SelectItem>
                  <SelectItem value="Semanal">Semanal</SelectItem>
                  <SelectItem value="Mensal">Mensal</SelectItem>
                  <SelectItem value="Trimestral">Trimestral</SelectItem>
                  <SelectItem value="Semestral">Semestral</SelectItem>
                  <SelectItem value="Anual">Anual</SelectItem>
                </SelectContent>
              </Select>
              {state?.errors?.periodicidade && <p className="text-xs text-destructive mt-1">{state.errors.periodicidade[0]}</p>}
            </div>
            
            <div>
              <Label htmlFor="responsavel">Responsável</Label>
              <Input 
                id="responsavel" 
                name="responsavel" 
                placeholder="Ex: Técnico"
                required 
              />
              {state?.errors?.responsavel && <p className="text-xs text-destructive mt-1">{state.errors.responsavel[0]}</p>}
            </div>
          </div>
          
          <div>
            <Label>Checklist (opcional)</Label>
            <div className="space-y-2 mt-2">
              {checklistItems.map((item, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    name="checklist"
                    value={item}
                    onChange={(e) => handleChecklistChange(index, e.target.value)}
                    placeholder={`Item ${index + 1} do checklist`}
                  />
                  {checklistItems.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveChecklistItem(index)}
                    >
                      Remover
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddChecklistItem}
              >
                Adicionar Item
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <SubmitButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 