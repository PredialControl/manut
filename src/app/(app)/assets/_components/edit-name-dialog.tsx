"use client";

import { useFormState } from "react-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { updateName } from "../_actions/update-name";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditNameDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  id: string;
  currentName: string;
  type: "building" | "floor" | "location" | "asset";
  contractId: string;
}

export function EditNameDialog({ 
  isOpen, 
  setIsOpen, 
  id, 
  currentName, 
  type,
  contractId
}: EditNameDialogProps) {
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(updateName, initialState);

  useEffect(() => {
    if (state?.message === "SUCCESS") {
      toast.success("Nome atualizado com sucesso!");
      setIsOpen(false);
    } else if (state?.message && !state.message.includes("validação")) {
      toast.error(state.message);
    }
  }, [state, setIsOpen]);

  // Reset form state if dialog is closed
  useEffect(() => {
    if (!isOpen) {
      // A small delay might be needed if you want to clear state after closing animation
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Nome</DialogTitle>
        </DialogHeader>
        <form action={dispatch} className="space-y-4">
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="contractId" value={contractId} />
          <div>
            <Label htmlFor="name">Novo Nome</Label>
            <Input id="name" name="name" defaultValue={currentName} required />
            {state?.errors?.name && <p className="text-sm text-destructive mt-1">{state.errors.name[0]}</p>}
          </div>
          <div className="flex justify-end">
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 