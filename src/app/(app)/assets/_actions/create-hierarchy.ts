"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreateHierarchySchema = z.object({
    contractId: z.string(),
    buildingNames: z.string().min(1, "Nomes dos prédios são obrigatórios."),
    floorStart: z.coerce.number(),
    floorEnd: z.coerce.number(),
});

export async function createHierarchy(prevState: any, formData: FormData) {
    const validatedFields = CreateHierarchySchema.safeParse({
        contractId: formData.get("contractId"),
        buildingNames: formData.get("buildingNames"),
        floorStart: formData.get("floorStart"),
        floorEnd: formData.get("floorEnd"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Erro de validação.",
        };
    }

    const { contractId, buildingNames, floorStart, floorEnd } = validatedFields.data;

    const bNames = buildingNames.split('/').map(n => n.trim()).filter(n => n.length > 0);

    try {
        // Para cada prédio
        for (const bName of bNames) {
            const building = await prisma.building.create({
                data: {
                    name: bName,
                    contractId,
                },
            });

            // Gerar andares
            const floorsData = [];
            const start = Math.min(floorStart, floorEnd);
            const end = Math.max(floorStart, floorEnd);

            for (let i = start; i <= end; i++) {
                let name = i === 0 ? "Térreo" : i > 0 ? `${i}º Andar` : `${Math.abs(i)}º Subsolo`;
                floorsData.push({
                    name,
                    buildingId: building.id,
                });
            }

            await prisma.floor.createMany({
                data: floorsData,
            });
        }

        revalidatePath(`/assets?contractId=${contractId}`);
        return { message: "SUCCESS" };
    } catch (error) {
        console.error("Failed to create hierarchy:", error);
        return { message: "Erro do banco de dados: Falha ao criar a árvore de ativos." };
    }
}
