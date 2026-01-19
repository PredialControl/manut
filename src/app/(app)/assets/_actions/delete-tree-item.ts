"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteTreeItem(id: string, type: "building" | "floor" | "location" | "asset", contractId: string) {
    try {
        switch (type) {
            case "building":
                await prisma.building.delete({ where: { id } });
                break;
            case "floor":
                await prisma.floor.delete({ where: { id } });
                break;
            case "location":
                await prisma.location.delete({ where: { id } });
                break;
            case "asset":
                await prisma.asset.delete({ where: { id } });
                break;
        }

        revalidatePath(`/assets?contractId=${contractId}`);
        revalidatePath("/assets-list");
        return { success: "Item excluído com sucesso!" };
    } catch (error) {
        console.error(`Failed to delete ${type}:`, error);
        return { error: `Erro ao excluir o item: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}
