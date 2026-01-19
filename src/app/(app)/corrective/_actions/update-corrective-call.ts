"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

const updateCorrectiveCallSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  priority: z.enum(["ALTA", "MEDIA", "BAIXA"]),
  assetId: z.string().optional(),
  location: z.string().optional(),
  floor: z.string().optional(),
});

export async function updateCorrectiveCall(formData: FormData) {
  try {
    const data = {
      id: formData.get("id") as string,
      description: formData.get("description") as string,
      priority: formData.get("priority") as string,
      assetId: formData.get("assetId") as string,
      location: formData.get("location") as string,
      floor: formData.get("floor") as string,
    };

    // Validar dados
    const validatedData = updateCorrectiveCallSchema.parse(data);

    // Atualizar corretiva
    const updateData: any = {
      title: validatedData.description.substring(0, 100), // Usar descrição como título
      description: validatedData.description,
      priority: validatedData.priority,
    };

    // Adicionar assetId apenas se fornecido
    if (validatedData.assetId) {
      updateData.assetId = validatedData.assetId;
    }

    const correctiveCall = await prisma.correctiveCall.update({
      where: { id: validatedData.id },
      data: updateData,
    });

    // Revalidar páginas
    revalidatePath("/corrective");

    return {
      success: true,
      data: correctiveCall
    };

  } catch (error) {
    console.error("Erro ao atualizar corretiva:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Dados inválidos"
      };
    }

    return {
      success: false,
      error: "Erro interno do servidor"
    };
  }
} 