"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteTreeItem } from "../_actions/delete-tree-item";

interface DeleteTreeItemDialogProps {
    id: string;
    name: string;
    type: "building" | "floor" | "location" | "asset";
    contractId: string;
}

export function DeleteTreeItemDialog({ id, name, type, contractId }: DeleteTreeItemDialogProps) {
    const [isPending, setIsPending] = useState(false);

    const typeMap = {
        building: "o prédio",
        floor: "o andar",
        location: "a localidade",
        asset: "o ativo",
    };

    const handleDelete = async () => {
        setIsPending(true);
        const result = await deleteTreeItem(id, type, contractId);
        setIsPending(false);

        if (result.success) {
            toast.success(result.success);
        } else if (result.error) {
            toast.error(result.error);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Excluir {typeMap[type]}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tem certeza que deseja excluir <strong>{name}</strong>?
                        Esta ação excluirá permanentemente todos os itens vinculados a ele.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        {isPending ? "Excluindo..." : "Confirmar Exclusão"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
