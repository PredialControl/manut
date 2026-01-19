"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const UpdatePlanSchema = z.object({
  id: z.string(),
  acronym: z.string().min(1, "Sigla é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória"),
  category: z.string().min(1, "Categoria é obrigatória"),
});

export async function updatePlan(prevState: any, formData: FormData) {
  const validatedFields = UpdatePlanSchema.safeParse({
    id: formData.get("id"),
    acronym: formData.get("acronym"),
    description: formData.get("description"),
    category: formData.get("category"),
  });

  if (!validatedFields.success) {
    return {
      message: "Erro de validação.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { id, acronym, description, category } = validatedFields.data;

  try {
    // Verificar se a sigla já existe em outro plano
    const existingPlan = await prisma.maintenancePlan.findFirst({
      where: {
        acronym,
        id: { not: id }
      }
    });

    if (existingPlan) {
      return {
        message: "Esta sigla já está sendo utilizada por outro plano.",
        errors: { acronym: ["Sigla já existe"] }
      };
    }

    await prisma.maintenancePlan.update({
      where: { id },
      data: {
        acronym,
        description,
        category,
      },
    });

    revalidatePath("/maintenance-plans");
    return { message: "SUCCESS" };
  } catch (error) {
    console.error("Failed to update plan:", error);
    return { message: "Erro do banco de dados: Falha ao atualizar o plano." };
  }
} 