"use client"

import { useFormState } from "react-dom"
import { useEffect } from "react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createCorrectiveCall } from "../_actions/create-corrective-call"
import { Asset } from "@prisma/client"

interface AddCorrectiveCallFormProps {
  asset: Asset;
  onSuccess: () => void;
}

export function AddCorrectiveCallForm({ asset, onSuccess }: AddCorrectiveCallFormProps) {
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(createCorrectiveCall, initialState);

  useEffect(() => {
    if (state.message === "SUCCESS") {
      toast.success("Chamado corretivo aberto com sucesso!");
      onSuccess();
    } else if (state.message && !state.errors) {
      toast.error(state.message);
    }
  }, [state, onSuccess]);

  return (
    <form action={dispatch} className="space-y-4">
      <input type="hidden" name="assetId" value={asset.id} />
      <div>
        <label>Ativo Selecionado</label>
        <p className="font-semibold">{asset.name}</p>
      </div>
      <div>
        <label htmlFor="title">Título do Chamado</label>
        <Input id="title" name="title" required />
        {state?.errors?.title && <p className="text-sm text-destructive mt-1">{state.errors.title[0]}</p>}
      </div>
      <div>
        <label htmlFor="description">Descrição</label>
        <Textarea id="description" name="description" />
      </div>
      <div>
        <label htmlFor="priority">Prioridade</label>
        <Select name="priority" defaultValue="MEDIA">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BAIXA">Baixa</SelectItem>
            <SelectItem value="MEDIA">Média</SelectItem>
            <SelectItem value="ALTA">Alta</SelectItem>
            <SelectItem value="URGENTE">Urgente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end">
        <Button type="submit">Abrir Chamado</Button>
      </div>
    </form>
  )
} 