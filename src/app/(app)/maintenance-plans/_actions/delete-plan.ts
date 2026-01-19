"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deletePlan(planId: string) {
    try {
        await prisma.maintenancePlan.delete({
            where: { id: planId },
        });
        revalidatePath("/maintenance-plans");
        return { success: "Plano excluído com sucesso!" };
    } catch (error) {
        console.error("Failed to delete plan:", error);
        return { error: "Erro do banco de dados: Falha ao excluir o plano." };
    }
}
