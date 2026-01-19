"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const UpdateAssetSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "O nome é obrigatório."),
    tag: z.string().optional(),
    model: z.string().optional(),
    manufacturer: z.string().optional(),
    quantity: z.coerce.number().optional(),
    type: z.string().optional(),
    imageUrl: z.string().optional(),
    contractId: z.string(),
});

export async function updateAsset(prevState: any, formData: FormData) {
    const validatedFields = UpdateAssetSchema.safeParse({
        id: formData.get("id"),
        name: formData.get("name"),
        tag: formData.get("tag"),
        model: formData.get("model"),
        manufacturer: formData.get("manufacturer"),
        quantity: formData.get("quantity"),
        type: formData.get("type"),
        imageUrl: formData.get("imageUrl"),
        contractId: formData.get("contractId"),
    });

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors, message: "Erro de validação." };
    }

    const { id, name, tag, model, manufacturer, quantity, type, imageUrl, contractId } = validatedFields.data;

    try {
        await prisma.asset.update({
            where: { id },
            data: {
                name,
                tag,
                model,
                manufacturer,
                quantity: quantity || 1,
                type,
                imageUrl,
            },
        });

        revalidatePath(`/assets?contractId=${contractId}`);
        revalidatePath("/schedule");
        return { message: "SUCCESS", errors: {} };
    } catch (error: any) {
        console.error("Failed to update asset:", error);
        return { message: "Erro do banco de dados: Falha ao atualizar o ativo.", errors: {} };
    }
}
