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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit } from "lucide-react";
import { updateContract } from "../_actions/update-contract";
import { Contract } from "@prisma/client";

interface EditContractDialogProps {
  contract: Contract;
}

function SubmitButton() {
    const pending = false; // Placeholder
    return <Button type="submit" disabled={pending}>{pending ? 'Salvando...' : 'Salvar'}</Button>;
}

export function EditContractDialog({ contract }: EditContractDialogProps) {
  const [open, setOpen] = useState(false);
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(updateContract, initialState);

  useEffect(() => {
    if (state.message === "SUCCESS") {
      toast.success("Contrato atualizado com sucesso!");
      setOpen(false);
    } else if (state.message && !state.message.includes("validação")) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="mr-1 h-3 w-3" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Contrato</DialogTitle>
        </DialogHeader>
        <form action={dispatch} className="space-y-3">
          <input type="hidden" name="id" value={contract.id} />
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input 
                id="name" 
                name="name" 
                defaultValue={contract.name}
                required 
              />
              {state?.errors?.name && <p className="text-xs text-destructive mt-1">{state.errors.name[0]}</p>}
            </div>
            
            <div>
              <Label htmlFor="acronym">Sigla</Label>
              <Input 
                id="acronym" 
                name="acronym" 
                defaultValue={contract.acronym || ""}
                required 
              />
              {state?.errors?.acronym && <p className="text-xs text-destructive mt-1">{state.errors.acronym[0]}</p>}
            </div>
          </div>
          
          <div>
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input 
              id="cnpj" 
              name="cnpj" 
              defaultValue={contract.cnpj || ""}
            />
            {state?.errors?.cnpj && <p className="text-xs text-destructive mt-1">{state.errors.cnpj[0]}</p>}
          </div>
          
          <div>
            <Label htmlFor="address">Endereço</Label>
            <Input 
              id="address" 
              name="address" 
              defaultValue={contract.address || ""}
            />
            {state?.errors?.address && <p className="text-xs text-destructive mt-1">{state.errors.address[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="sindico">Gestor</Label>
              <Input 
                id="sindico" 
                name="sindico" 
                defaultValue={contract.sindico || ""}
                placeholder="Nome do gestor"
              />
              {state?.errors?.sindico && <p className="text-xs text-destructive mt-1">{state.errors.sindico[0]}</p>}
            </div>
            
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone" 
                name="phone" 
                defaultValue={contract.phone || ""}
                placeholder="(00) 00000-0000"
              />
              {state?.errors?.phone && <p className="text-xs text-destructive mt-1">{state.errors.phone[0]}</p>}
            </div>
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={contract.status || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Implantado">Implantado</SelectItem>
                <SelectItem value="Em implantação">Em implantação</SelectItem>
              </SelectContent>
            </Select>
            {state?.errors?.status && <p className="text-xs text-destructive mt-1">{state.errors.status[0]}</p>}
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
  );
} 