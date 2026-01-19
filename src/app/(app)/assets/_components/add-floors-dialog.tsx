"use client";

import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createFloors } from "../_actions/create-floors";
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
import { Layers, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface AddFloorsDialogProps {
  buildingId: string;
  contractId: string;
}

export function AddFloorsDialog({ buildingId, contractId }: AddFloorsDialogProps) {
  const [open, setOpen] = useState(false);
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(createFloors, initialState);

  useEffect(() => {
    if (state?.message === "SUCCESS") {
      toast.success("Andares criados com sucesso!");
      setOpen(false);
    } else if (state?.message && !state.message.includes("validação")) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Andares
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Andares em Lote</DialogTitle>
        </DialogHeader>
        <form action={dispatch} className="space-y-4">
          <input type="hidden" name="buildingId" value={buildingId} />
          <input type="hidden" name="contractId" value={contractId} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startFloor">Do Andar</Label>
              <Input id="startFloor" name="startFloor" type="number" placeholder="Ex: 23" required />
            </div>
            <div>
              <Label htmlFor="endFloor">Até o Andar</Label>
              <Input id="endFloor" name="endFloor" type="number" placeholder="Ex: -5" required />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="includeTerreo" name="includeTerreo" />
            <Label htmlFor="includeTerreo">Incluir Térreo?</Label>
          </div>
          <p className="text-xs text-muted-foreground">
            O sistema criará todos os andares no intervalo (ex: 23, 22, ..., -4, -5). O 0º andar será ignorado.
          </p>
          <div className="flex justify-end">
            <Button type="submit">Criar Andares</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 