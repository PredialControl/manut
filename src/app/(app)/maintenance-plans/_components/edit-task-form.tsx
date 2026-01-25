"use client";

import { useFormState } from "react-dom";
import { useEffect, Suspense } from "react";
import { toast } from "sonner";
import { updateTask } from "../_actions/update-task";
import { FormattedTask } from "../page";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";

interface EditTaskFormProps {
  task: FormattedTask;
  onSuccess: () => void;
}

const frequencies = [
  "SEMANAL", "QUINZENAL", "MENSAL", "BIMESTRAL", "TRIMESTRAL", "SEMESTRAL", "ANUAL"
];

function EditTaskFormContent({ task, onSuccess }: EditTaskFormProps) {
  const searchParams = useSearchParams();
  const contractId = searchParams.get('contractId');
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(updateTask, initialState);

  useEffect(() => {
    if (state?.message === "SUCCESS") {
      toast.success("Tarefa atualizada com sucesso!");
      onSuccess();
    } else if (state?.message && !state.message.includes("validação")) {
      toast.error(state.message);
    }
  }, [state, onSuccess]);

  return (
    <form action={dispatch} className="space-y-4">
      <input type="hidden" name="id" value={task.id} />
      <input type="hidden" name="contractId" value={contractId || ""} />

      <div>
        <p className="text-sm font-medium">{task.assetName} <span className="text-muted-foreground">({task.assetTag})</span></p>
        <p className="text-sm text-muted-foreground">{task.location}</p>
      </div>

      <div>
        <Label htmlFor="description">Descrição da Tarefa</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={task.description}
        />
      </div>

      <div>
        <Label htmlFor="frequency">Periodicidade</Label>
        <Select name="frequency" defaultValue={task.frequency}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {frequencies.map((freq) => (
              <SelectItem key={freq} value={freq}>
                {freq.charAt(0).toUpperCase() + freq.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Salvar Alterações</Button>
      </div>
    </form>
  );
}

export function EditTaskForm(props: EditTaskFormProps) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <EditTaskFormContent {...props} />
    </Suspense>
  );
} 