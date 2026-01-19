"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { restoreContract } from "../../_actions/restore-contract";

export function RestoreButtonClient({ contractId }: { contractId: string }) {
    const [isPending, startTransition] = useTransition();

    const handleRestore = () => {
        startTransition(async () => {
            const result = await restoreContract(contractId);
            if (result.success) {
                toast.success(result.success);
            } else if (result.error) {
                toast.error(result.error);
            }
        });
    };

    return (
        <Button onClick={handleRestore} disabled={isPending} className="w-full">
            <Undo2 className="mr-2 h-4 w-4" />
            {isPending ? "Restaurando..." : "Restaurar Contrato"}
        </Button>
    );
} 