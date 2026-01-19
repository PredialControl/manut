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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { createContract } from "../_actions/create-contract";
import { useEffect } from "react";
import { ImageUpload } from "./image-upload";

function SubmitButton() {
    // const { pending } = useFormStatus(); // Descomentar quando o useFormStatus estiver disponível
    const pending = false; // Placeholder
    return <Button type="submit" disabled={pending}>{pending ? 'Salvando...' : 'Salvar Contrato'}</Button>;
}

export function AddContractDialog() {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(createContract, initialState);

  useEffect(() => {
    if (state.message === "SUCCESS") {
      toast.success("Contrato criado com sucesso!");
      setOpen(false);
      setSelectedImage(""); // Reset image selection
    } else if (state.message && !state.message.includes("validação")) {
      toast.error(state.message);
    }
  }, [state]);

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Novo Contrato
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Contrato</DialogTitle>
        </DialogHeader>
        <form action={dispatch} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name">Nome do Contrato</Label>
              <Input id="name" name="name" required />
              {state?.errors?.name && <p className="text-sm text-destructive mt-1">{state.errors.name[0]}</p>}
            </div>
            <div>
              <Label htmlFor="acronym">Sigla (ex: LONE)</Label>
              <Input id="acronym" name="acronym" required />
              {state?.errors?.acronym && <p className="text-sm text-destructive mt-1">{state.errors.acronym[0]}</p>}
            </div>
          </div>
          
          <div>
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input id="cnpj" name="cnpj" />
            {state?.errors?.cnpj && <p className="text-sm text-destructive mt-1">{state.errors.cnpj[0]}</p>}
          </div>
          
          <div>
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" name="address" />
            {state?.errors?.address && <p className="text-sm text-destructive mt-1">{state.errors.address[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="sindico">Gestor</Label>
              <Input id="sindico" name="sindico" placeholder="Nome do gestor" />
              {state?.errors?.sindico && <p className="text-sm text-destructive mt-1">{state.errors.sindico[0]}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" name="phone" placeholder="(00) 00000-0000" />
              {state?.errors?.phone && <p className="text-sm text-destructive mt-1">{state.errors.phone[0]}</p>}
            </div>
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue="">
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Implantado">Implantado</SelectItem>
                <SelectItem value="Em implantação">Em implantação</SelectItem>
              </SelectContent>
            </Select>
            {state?.errors?.status && <p className="text-sm text-destructive mt-1">{state.errors.status[0]}</p>}
          </div>
          
          {/* Componente de upload de imagem */}
          <ImageUpload onImageSelect={handleImageSelect} />
          
          <div className="flex justify-end pt-2 border-t">
            <SubmitButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 