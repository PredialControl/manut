"use client";

import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createLocations } from "../_actions/create-locations";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface AddRoomDialogProps {
    floorId: string;
    floorName: string;
    contractId: string;
}

export function AddRoomDialog({ floorId, floorName, contractId }: AddRoomDialogProps) {
    const [open, setOpen] = useState(false);
    const initialState = { message: "", errors: {} };
    const [state, dispatch] = useFormState(createLocations, initialState);

    useEffect(() => {
        if (state?.message === "SUCCESS") {
            toast.success("Localidades criadas com sucesso!");
            setOpen(false);
        } else if (state?.message && !state.message.includes("validação")) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-primary/70 hover:text-primary hover:bg-primary/10">
                    <Plus className="h-4 w-4 mr-1" />
                    <span className="text-xs">Localidade</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Novas Localidades em <span className="text-primary">{floorName}</span></DialogTitle>
                </DialogHeader>
                <form action={dispatch} className="space-y-4">
                    <input type="hidden" name="contractId" value={contractId} />
                    <input type="hidden" name="floorId" value={floorId} />

                    <div>
                        <Label htmlFor="locationNames">Nomes das Localidades (Salas, Áreas, etc)</Label>
                        <Textarea
                            id="locationNames"
                            name="locationNames"
                            placeholder="Ex: Barrilete / Casa de Bombas / Cobertura"
                            required
                            className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            Separe os nomes com uma barra (/) para criar várias de uma vez.
                        </p>
                        {state?.errors?.locationNames && <p className="text-sm text-destructive mt-1">{state.errors.locationNames[0]}</p>}
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit">Salvar</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
