"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

const executeCorrectiveCallSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  observations: z.string().optional(),
  executedAt: z.string().optional(),
});

export async function executeCorrectiveCall(formData: FormData) {
  try {
    const data = {
      id: formData.get("id") as string,
      observations: formData.get("observations") as string,
      executedAt: formData.get("executedAt") as string,
    };
    
    const validatedData = executeCorrectiveCallSchema.parse(data);
    
    const updateData: any = {
      status: "CONCLUIDO",
    };

    if (validatedData.observations) {
      updateData.observations = validatedData.observations;
    }

    if (validatedData.executedAt) {
      updateData.executedAt = new Date(validatedData.executedAt);
    }

    const correctiveCall = await prisma.correctiveCall.update({
      where: { id: validatedData.id },
      data: updateData,
    });

    revalidatePath("/corrective");
    return { success: true, data: correctiveCall };
  } catch (error) {
    console.error("Erro ao executar corretiva:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Dados inválidos" };
    }
    return { success: false, error: "Erro interno do servidor" };
  }
} 