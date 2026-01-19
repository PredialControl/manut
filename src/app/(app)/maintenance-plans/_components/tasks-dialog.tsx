"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit } from "lucide-react";
import { FormattedPlan } from "../page";
import { EditTaskDialog } from "./edit-task-dialog";

interface TasksDialogProps {
  plan: FormattedPlan;
}

export function TasksDialog({ plan }: TasksDialogProps) {
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="mr-1 h-3 w-3" />
          Ver Tarefas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Tarefas do Plano: {plan.name} ({plan.acronym})
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {plan.tasks.map((task, index) => (
              <div key={task.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">
                    Tarefa {index + 1}
                  </h3>
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
                      Editar
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
                    <p className="mt-1">{task.atividade}</p>
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
          </div>
          
          {plan.tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma tarefa cadastrada para este plano.
            </div>
          )}
        </div>
      </DialogContent>
      
      {/* Dialog para Editar Tarefa */}
      <EditTaskDialog
        task={editingTask}
        plan={plan}
        open={!!editingTask}
        onClose={() => setEditingTask(null)}
      />
    </Dialog>
  );
} 