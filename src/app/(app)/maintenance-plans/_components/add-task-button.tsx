"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddTaskDialog } from "./add-task-dialog";
import { FormattedPlan } from "../page";

interface AddTaskButtonProps {
  plan: FormattedPlan;
}

export function AddTaskButton({ plan }: AddTaskButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Plus className="mr-1 h-3 w-3" />
        Adicionar Tarefa
      </Button>
      
      <AddTaskDialog
        open={open}
        onClose={() => setOpen(false)}
        planId={plan.id}
      />
    </>
  );
} 