"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { updateTaskTemplate } from "../_actions/update-task-template";
import { MaintenanceTaskTemplate } from "../page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";

interface EditTaskTemplateFormProps {
  task: MaintenanceTaskTemplate;
  onSuccess: () => void;
}

const frequencies = [
  "SEMANAL", "QUINZENAL", "MENSAL", "BIMESTRAL", "TRIMESTRAL", "SEMESTRAL", "ANUAL"
];

export function EditTaskTemplateForm({ task, onSuccess }: EditTaskTemplateFormProps) {
  const [periodicity, setPeriodicity] = useState(task.periodicidade);
  const [checklistItems, setChecklistItems] = useState(
    task.checklist.map(item => item.description)
  );
  
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(updateTaskTemplate, initialState);

  useEffect(() => {
    if (state?.message === "SUCCESS") {
      toast.success("Tarefa atualizada com sucesso!");
      onSuccess();
    } else if (state?.message && !state.message.includes("validação")) {
      toast.error(state.message);
    }
  }, [state, onSuccess]);

  const addChecklistItem = () => {
    setChecklistItems([...checklistItems, ""]);
  };

  const removeChecklistItem = (index: number) => {
    if (checklistItems.length > 1) {
      setChecklistItems(checklistItems.filter((_, i) => i !== index));
    }
  };

  const updateChecklistItem = (index: number, value: string) => {
    const newItems = [...checklistItems];
    newItems[index] = value;
    setChecklistItems(newItems);
  };

  return (
    <form action={dispatch} className="space-y-4">
      <input type="hidden" name="id" value={task.id} />
      
      <div>
        <Label htmlFor="periodicity">Periodicidade</Label>
        <Select 
          name="periodicity" 
          value={periodicity}
          onValueChange={setPeriodicity}
        >
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
        {state?.errors?.periodicity && (
          <p className="text-sm text-red-600 mt-1">
            {state.errors.periodicity[0]}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Itens do Checklist</Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addChecklistItem}
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Item
          </Button>
        </div>
        
        <div className="space-y-2">
          {checklistItems.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                name="checklist"
                value={item}
                onChange={(e) => updateChecklistItem(index, e.target.value)}
                placeholder={`Item ${index + 1} do checklist`}
                className="flex-1"
              />
              {checklistItems.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => removeChecklistItem(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        {state?.errors?.checklist && (
          <p className="text-sm text-red-600 mt-1">
            {state.errors.checklist[0]}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit">Salvar Alterações</Button>
      </div>
    </form>
  );
} 