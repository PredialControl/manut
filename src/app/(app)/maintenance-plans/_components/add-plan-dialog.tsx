"use client";

import { useState } from "react";
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
import { PlusCircle } from "lucide-react";
import { createMaintenancePlan } from "../_actions/create-plan";
import { useEffect } from "react";

function SubmitButton() {
    const pending = false; // Placeholder
    return <Button type="submit" disabled={pending}>{pending ? 'Salvando...' : 'Criar Plano'}</Button>;
}

export function AddPlanDialog() {
  const [open, setOpen] = useState(false);
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(createMaintenancePlan, initialState);

  useEffect(() => {
    if (state.message === "SUCCESS") {
      toast.success("Plano criado com sucesso!");
      setOpen(false);
    } else if (state.message && !state.message.includes("validação")) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Novo Plano
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Plano de Manutenção</DialogTitle>
        </DialogHeader>
        <form action={dispatch} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="acronym">Sigla</Label>
              <Input id="acronym" name="acronym" required />
              {state?.errors?.acronym && <p className="text-sm text-destructive mt-1">{state.errors.acronym[0]}</p>}
            </div>
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Input id="category" name="category" required />
              {state?.errors?.category && <p className="text-sm text-destructive mt-1">{state.errors.category[0]}</p>}
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" name="description" required />
            {state?.errors?.description && <p className="text-sm text-destructive mt-1">{state.errors.description[0]}</p>}
          </div>
          
          <div>
            <Label htmlFor="sistema">Sistema</Label>
            <Input id="sistema" name="sistema" required />
            {state?.errors?.sistema && <p className="text-sm text-destructive mt-1">{state.errors.sistema[0]}</p>}
          </div>
          
          <div>
            <Label htmlFor="atividade">Atividade</Label>
            <Input id="atividade" name="atividade" required />
            {state?.errors?.atividade && <p className="text-sm text-destructive mt-1">{state.errors.atividade[0]}</p>}
          </div>
          
          <div>
            <Label htmlFor="periodicidade">Periodicidade</Label>
            <Input id="periodicidade" name="periodicidade" required />
            {state?.errors?.periodicidade && <p className="text-sm text-destructive mt-1">{state.errors.periodicidade[0]}</p>}
          </div>
          
          <div className="flex justify-end pt-2 border-t">
            <SubmitButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 