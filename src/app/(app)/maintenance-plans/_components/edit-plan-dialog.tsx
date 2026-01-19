"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { FormattedPlan } from "../page";
import { updatePlan } from "../_actions/update-plan";
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
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash2 } from "lucide-react";
import { EditTaskDialog } from "./edit-task-dialog";
import { AddTaskButton } from "./add-task-button";

interface EditPlanDialogProps {
  plan: FormattedPlan | null;
  onClose: () => void;
}

const categories = [
  "BOMBA",
  "MOTOR",
  "ELEVADOR",
  "SISTEMA_HIDRAULICO",
  "SISTEMA_ELETRICO",
  "SISTEMA_PNEUMATICO",
  "EQUIPAMENTO_SEGURANCA",
  "OUTROS"
];

export function EditPlanDialog({ plan, onClose }: EditPlanDialogProps) {
  const [formData, setFormData] = useState({
    acronym: plan?.acronym || "",
    description: plan?.description || "",
    category: plan?.category || "",
  });

  const [editingTask, setEditingTask] = useState<any>(null);

  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(updatePlan, initialState);

  // Atualizar formData quando o plano mudar
  useEffect(() => {
    if (plan) {
      setFormData({
        acronym: plan.acronym,
        description: plan.description,
        category: plan.category,
      });
    }
  }, [plan]);

  // Lidar com o resultado da action
  useEffect(() => {
    if (state?.message === "SUCCESS") {
      toast.success("Plano atualizado com sucesso!");
      onClose();
    } else if (state?.message && !state.message.includes("validação")) {
      toast.error(state.message);
    }
  }, [state, onClose]);

  // Se não há plano selecionado, não renderizar nada
  if (!plan) {
    console.log("Nenhum plano selecionado para edição");
    return null;
  }

  console.log("Renderizando diálogo de edição para plano:", plan);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Dialog open={!!plan} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Plano de Manutenção: {plan?.acronym}</DialogTitle>
          </DialogHeader>

          <form action={dispatch} className="space-y-4">
            <input type="hidden" name="id" value={plan.id} />

            <div>
              <Label htmlFor="acronym">Sigla</Label>
              <Input
                id="acronym"
                name="acronym"
                value={formData.acronym}
                onChange={(e) => handleInputChange("acronym", e.target.value)}
                placeholder="Ex: BEP"
              />
              {state?.errors?.acronym && (
                <p className="text-sm text-red-600 mt-1">
                  {state.errors.acronym[0]}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Ex: Bomba de Esgoto Predial"
                rows={3}
              />
              {state?.errors?.description && (
                <p className="text-sm text-red-600 mt-1">
                  {state.errors.description[0]}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                placeholder="Ex: BOMBA"
              />
              {state?.errors?.category && (
                <p className="text-sm text-red-600 mt-1">
                  {state.errors.category[0]}
                </p>
              )}
            </div>

            {/* Seção de Tarefas */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Editar Atividades das Tarefas</h3>
                <AddTaskButton plan={plan} />
              </div>

              <div className="space-y-3">
                {plan.tasks.map((task, index) => (
                  <div key={task.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Tarefa {index + 1}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          {task.periodicidade}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingTask(task)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar Atividade
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Sistema:</span>
                        <p className="mt-1">{task.sistema}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Atividade:</span>
                        <p className="mt-1 text-blue-600 font-medium">{task.atividade}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Responsável:</span>
                        <p className="mt-1">{task.responsavel}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Periodicidade:</span>
                        <p className="mt-1">{task.periodicidade}</p>
                      </div>
                    </div>

                    {task.checklist && task.checklist.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-600">Checklist:</span>
                        <ul className="mt-2 space-y-1">
                          {task.checklist.map((item, itemIndex) => (
                            <li key={item.id} className="flex items-start space-x-2">
                              <span className="text-blue-600 font-medium">
                                {itemIndex + 1}.
                              </span>
                              <span>{item.description}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}

                {plan.tasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma tarefa cadastrada para este plano.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para Editar Tarefa */}
      <EditTaskDialog
        task={editingTask}
        plan={plan}
        open={!!editingTask}
        onClose={() => setEditingTask(null)}
      />
    </>
  );
} 