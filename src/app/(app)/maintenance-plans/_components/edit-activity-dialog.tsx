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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateTask } from "../_actions/update-task";
import { FormattedPlan } from "../page";

interface EditActivityDialogProps {
  plan: FormattedPlan;
}

function SubmitButton() {
  const pending = false;
  return <Button type="submit" disabled={pending}>{pending ? 'Salvando...' : 'Salvar Atividade'}</Button>;
}

export function EditActivityDialog({ plan }: EditActivityDialogProps) {
  const [open, setOpen] = useState(false);
  const [atividade, setAtividade] = useState("");
  
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(updateTask, initialState);

  // Pegar a primeira tarefa do plano
  const firstTask = plan.tasks[0];

  // Atualizar atividade quando abrir o diálogo
  useEffect(() => {
    if (open && firstTask) {
      setAtividade(firstTask.atividade || "");
    }
  }, [open, firstTask]);

  // Lidar com o resultado da action
  useEffect(() => {
    if (state?.message === "SUCCESS") {
      toast.success("Atividade atualizada com sucesso!");
      setOpen(false);
    } else if (state?.message && !state.message.includes("validação")) {
      toast.error(state.message);
    }
  }, [state]);

  if (!firstTask) {
    return (
      <Button 
        variant="outline" 
        size="sm"
        disabled
        title="Nenhuma tarefa para editar"
      >
        Editar
      </Button>
    );
  }

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setOpen(true)}
      >
        Editar
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Atividade - {plan.acronym}</DialogTitle>
          </DialogHeader>
          
          <form action={dispatch} className="space-y-4">
            <input type="hidden" name="taskId" value={firstTask.id} />
            <input type="hidden" name="sistema" value={firstTask.sistema || ""} />
            <input type="hidden" name="periodicidade" value={firstTask.periodicidade || ""} />
            <input type="hidden" name="responsavel" value={firstTask.responsavel || ""} />
            
            <div>
              <Label htmlFor="atividade" className="text-lg font-semibold">
                ✏️ Atividade
              </Label>
              <Textarea 
                id="atividade" 
                name="atividade" 
                value={atividade}
                onChange={(e) => setAtividade(e.target.value)}
                placeholder="Ex: Verificar pressão e funcionamento da bomba..."
                className="mt-2 min-h-[120px] text-lg"
                required 
              />
              {state?.errors?.atividade && <p className="text-xs text-destructive mt-1">{state.errors.atividade[0]}</p>}
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <SubmitButton />
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
} 