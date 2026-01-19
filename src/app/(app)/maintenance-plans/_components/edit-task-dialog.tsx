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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateTask } from "../_actions/update-task";
import { FormattedPlan } from "../page";

interface EditTaskDialogProps {
  task: any;
  plan: FormattedPlan;
  open: boolean;
  onClose: () => void;
}

function SubmitButton() {
  const pending = false;
  return <Button type="submit" disabled={pending}>{pending ? 'Salvando...' : 'Salvar Tarefa'}</Button>;
}

export function EditTaskDialog({ task, plan, open, onClose }: EditTaskDialogProps) {
  const [formData, setFormData] = useState({
    sistema: task?.sistema || "",
    atividade: task?.atividade || "",
    periodicidade: task?.periodicidade || "",
    responsavel: task?.responsavel || "",
  });

  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(updateTask, initialState);

  // Atualizar formData quando a tarefa mudar
  useEffect(() => {
    if (task) {
      console.log("Editando tarefa:", task);
      setFormData({
        sistema: task.sistema || "",
        atividade: task.atividade || "",
        periodicidade: task.periodicidade || "",
        responsavel: task.responsavel || "",
      });
    }
  }, [task]);

  // Lidar com o resultado da action
  useEffect(() => {
    console.log("Estado da action:", state);
    if (state?.message === "SUCCESS") {
      toast.success("Tarefa atualizada com sucesso!");
      onClose();
    } else if (state?.message && !state.message.includes("validação")) {
      toast.error(state.message);
    }
  }, [state, onClose]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Atividade da Tarefa - {plan.acronym}</DialogTitle>
        </DialogHeader>
        
        <form action={dispatch} className="space-y-4">
          <input type="hidden" name="taskId" value={task.id} />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sistema">Sistema</Label>
              <Input 
                id="sistema" 
                name="sistema" 
                value={formData.sistema}
                onChange={(e) => handleInputChange("sistema", e.target.value)}
                placeholder="Ex: Sistema Hidráulico"
                required 
              />
              {state?.errors?.sistema && <p className="text-xs text-destructive mt-1">{state.errors.sistema[0]}</p>}
            </div>
            
            <div>
              <Label htmlFor="periodicidade">Periodicidade</Label>
              <Select 
                name="periodicidade" 
                value={formData.periodicidade}
                onValueChange={(value) => handleInputChange("periodicidade", value)}
                required
              >
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
          </div>
          
          {/* Atividade em destaque */}
          <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
            <Label htmlFor="atividade" className="text-lg font-semibold text-blue-800">
              ✏️ Atividade (Campo Principal)
            </Label>
            <Textarea 
              id="atividade" 
              name="atividade" 
              value={formData.atividade}
              onChange={(e) => {
                console.log("Atividade alterada para:", e.target.value);
                handleInputChange("atividade", e.target.value);
              }}
              placeholder="Ex: Verificar pressão e funcionamento da bomba..."
              className="mt-2 min-h-[100px] text-lg"
              required 
            />
            {state?.errors?.atividade && <p className="text-xs text-destructive mt-1">{state.errors.atividade[0]}</p>}
          </div>
          
          <div>
            <Label htmlFor="responsavel">Responsável</Label>
            <Input 
              id="responsavel" 
              name="responsavel" 
              value={formData.responsavel}
              onChange={(e) => handleInputChange("responsavel", e.target.value)}
              placeholder="Ex: Técnico"
              required 
            />
            {state?.errors?.responsavel && <p className="text-xs text-destructive mt-1">{state.errors.responsavel[0]}</p>}
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
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