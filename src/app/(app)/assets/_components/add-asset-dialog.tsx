"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createAsset } from "../_actions/create-asset";
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
import { Plus } from "lucide-react";

interface AddAssetDialogProps {
  locationId: string;
  contractId: string;
}

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Salvando..." : "Salvar Ativo"}
    </Button>
  );
};

export function AddAssetDialog({ locationId, contractId }: AddAssetDialogProps) {
  const [open, setOpen] = useState(false);

  const initialState: { message?: string | null; errors?: { [key: string]: string[] } } = {};
  const [state, dispatch] = useFormState(createAsset, initialState);

  useEffect(() => {
    if (state?.message === "SUCCESS") {
      toast.success("Ativo criado com sucesso!");
      setOpen(false);
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Ativo</DialogTitle>
        </DialogHeader>
        <form action={dispatch} className="space-y-4">
          <input type="hidden" name="locationId" value={locationId} />
          <input type="hidden" name="contractId" value={contractId} />
          <div>
            <Label htmlFor="name">Nome do Ativo</Label>
            <Input id="name" name="name" required />
            {state?.errors?.name && <p className="text-sm text-destructive mt-1">{state.errors.name[0]}</p>}
          </div>
          <div>
            <Label htmlFor="tag">TAG (Opcional)</Label>
            <Input id="tag" name="tag" placeholder="Deixe em branco para gerar automaticamente" />
            {state?.errors?.tag && <p className="text-sm text-destructive mt-1">{state.errors.tag[0]}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="model">Modelo</Label>
              <Input id="model" name="model" placeholder="Ex: LAMP-PILOT" />
              {state?.errors?.model && <p className="text-sm text-destructive mt-1">{state.errors.model[0]}</p>}
            </div>
            <div>
              <Label htmlFor="manufacturer">Fabricante</Label>
              <Input id="manufacturer" name="manufacturer" placeholder="Ex: N/A" />
              {state?.errors?.manufacturer && <p className="text-sm text-destructive mt-1">{state.errors.manufacturer[0]}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantidade</Label>
              <Input id="quantity" name="quantity" type="number" defaultValue="1" />
              {state?.errors?.quantity && <p className="text-sm text-destructive mt-1">{state.errors.quantity[0]}</p>}
            </div>
            <div>
              <Label htmlFor="type">Tipo/Categoria</Label>
              <Input id="type" name="type" placeholder="Ex: Lâmpada Piloto" />
              {state?.errors?.type && <p className="text-sm text-destructive mt-1">{state.errors.type[0]}</p>}
            </div>
          </div>
          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 