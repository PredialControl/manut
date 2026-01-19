"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateAsset } from "../_actions/update-asset";
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
import { Edit } from "lucide-react";

interface EditAssetDialogProps {
    asset: {
        id: string;
        name: string;
        tag?: string | null;
        model?: string | null;
        manufacturer?: string | null;
        quantity?: number | null;
        type?: string | null;
        imageUrl?: string | null;
    };
    contractId: string;
    trigger?: React.ReactNode;
}

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Salvando..." : "Salvar Alterações"}
        </Button>
    );
};

export function EditAssetDialog({ asset, contractId, trigger }: EditAssetDialogProps) {
    const [open, setOpen] = useState(false);

    const initialState: { message?: string | null; errors?: { [key: string]: string[] } } = {};
    const [state, dispatch] = useFormState(updateAsset, initialState);

    useEffect(() => {
        if (state?.message === "SUCCESS") {
            toast.success("Ativo atualizado com sucesso!");
            setOpen(false);
        } else if (state?.message) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Editar Informações do Ativo</DialogTitle>
                </DialogHeader>
                <form action={dispatch} className="space-y-4">
                    <input type="hidden" name="id" value={asset.id} />
                    <input type="hidden" name="contractId" value={contractId} />

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Nome do Ativo</Label>
                            <Input id="name" name="name" defaultValue={asset.name} required />
                            {state?.errors?.name && <p className="text-sm text-destructive mt-1">{state.errors.name[0]}</p>}
                        </div>

                        <div>
                            <Label htmlFor="tag">TAG</Label>
                            <Input id="tag" name="tag" defaultValue={asset.tag || ""} />
                            {state?.errors?.tag && <p className="text-sm text-destructive mt-1">{state.errors.tag[0]}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="model">Modelo</Label>
                                <Input id="model" name="model" defaultValue={asset.model || ""} placeholder="Ex: LAMP-PILOT" />
                                {state?.errors?.model && <p className="text-sm text-destructive mt-1">{state.errors.model[0]}</p>}
                            </div>
                            <div>
                                <Label htmlFor="manufacturer">Fabricante</Label>
                                <Input id="manufacturer" name="manufacturer" defaultValue={asset.manufacturer || ""} placeholder="Ex: N/A" />
                                {state?.errors?.manufacturer && <p className="text-sm text-destructive mt-1">{state.errors.manufacturer[0]}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="quantity">Quantidade</Label>
                                <Input id="quantity" name="quantity" type="number" defaultValue={asset.quantity || 1} />
                                {state?.errors?.quantity && <p className="text-sm text-destructive mt-1">{state.errors.quantity[0]}</p>}
                            </div>
                            <div>
                                <Label htmlFor="type">Tipo/Categoria</Label>
                                <Input id="type" name="type" defaultValue={asset.type || ""} placeholder="Ex: Lâmpada Piloto" />
                                {state?.errors?.type && <p className="text-sm text-destructive mt-1">{state.errors.type[0]}</p>}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="imageUrl">URL da Imagem / Foto</Label>
                            <Input id="imageUrl" name="imageUrl" defaultValue={asset.imageUrl || ""} placeholder="https://..." />
                            {state?.errors?.imageUrl && <p className="text-sm text-destructive mt-1">{state.errors.imageUrl[0]}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <SubmitButton />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
