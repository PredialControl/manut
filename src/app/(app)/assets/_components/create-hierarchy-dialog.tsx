"use client";

import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createHierarchy } from "../_actions/create-hierarchy";
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
import { Layers } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateHierarchyDialogProps {
    contractId: string;
}

export function CreateHierarchyDialog({ contractId }: CreateHierarchyDialogProps) {
    const [open, setOpen] = useState(false);
    const [isSingleTower, setIsSingleTower] = useState(false);
    const [buildingNames, setBuildingNames] = useState("");

    const initialState = { message: "", errors: {} };
    const [state, dispatch] = useFormState(createHierarchy, initialState);

    useEffect(() => {
        if (state?.message === "SUCCESS") {
            toast.success("Árvore criada com sucesso!");
            setOpen(false);
        } else if (state?.message && !state.message.includes("validação")) {
            toast.error(state.message);
        }
    }, [state]);

    const handleSingleTowerChange = (checked: boolean) => {
        setIsSingleTower(checked);
        if (checked) {
            setBuildingNames("Torre Única");
        } else {
            setBuildingNames("");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Layers className="mr-2 h-4 w-4" /> Criar Árvore
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Configurar Árvore de Ativos</DialogTitle>
                </DialogHeader>
                <form action={dispatch} className="space-y-6">
                    <input type="hidden" name="contractId" value={contractId} />

                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="single-tower"
                                checked={isSingleTower}
                                onCheckedChange={handleSingleTowerChange}
                            />
                            <Label htmlFor="single-tower" className="cursor-pointer">Torre Única</Label>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="buildingNames">Nomes das Torres / Prédios</Label>
                            <Input
                                id="buildingNames"
                                name="buildingNames"
                                value={buildingNames}
                                onChange={(e) => setBuildingNames(e.target.value)}
                                placeholder="Ex: Torre 1 / Torre 2"
                                disabled={isSingleTower}
                                required
                            />
                            {!isSingleTower && (
                                <p className="text-[10px] text-muted-foreground">
                                    Separe os nomes por barra (/) para criar múltiplos prédios.
                                </p>
                            )}
                            {state?.errors?.buildingNames && <p className="text-sm text-destructive mt-1">{state.errors.buildingNames[0]}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="floorStart">Andar Inicial</Label>
                                <Input
                                    id="floorStart"
                                    name="floorStart"
                                    type="number"
                                    defaultValue="-1"
                                    required
                                />
                                {state?.errors?.floorStart && <p className="text-sm text-destructive mt-1">{state.errors.floorStart[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="floorEnd">Andar Final</Label>
                                <Input
                                    id="floorEnd"
                                    name="floorEnd"
                                    type="number"
                                    defaultValue="16"
                                    required
                                />
                                {state?.errors?.floorEnd && <p className="text-sm text-destructive mt-1">{state.errors.floorEnd[0]}</p>}
                            </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground italic">
                            * O sistema gerará automaticamente os andares entre o inicial e o final (ex: Subsolos, Térreo e Andares).
                        </p>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <Button type="submit" className="w-full sm:w-auto">Gerar Estrutura</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
