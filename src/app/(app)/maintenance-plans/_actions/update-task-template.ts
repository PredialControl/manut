"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const UpdateTaskTemplateSchema = z.object({
  id: z.string(),
  periodicity: z.string().min(1, "Periodicidade é obrigatória"),
  checklist: z.array(z.string()).min(1, "Pelo menos um item de checklist é obrigatório"),
});

export async function updateTaskTemplate(prevState: any, formData: FormData) {
  const checklistItems = formData.getAll("checklist") as string[];
  
  const validatedFields = UpdateTaskTemplateSchema.safeParse({
    id: formData.get("id"),
    periodicity: formData.get("periodicity"),
    checklist: checklistItems.filter(item => item.trim() !== ""),
  });

  if (!validatedFields.success) {
    return {
      message: "Erro de validação.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { id, periodicity, checklist } = validatedFields.data;

  try {
    // Atualizar a tarefa e substituir todos os itens de checklist
    await prisma.$transaction(async (tx) => {
      // Atualizar periodicidade
      await tx.maintenanceTaskTemplate.update({
        where: { id },
        data: { periodicidade: periodicity },
      });

      // Remover itens de checklist existentes
      await tx.checklistItem.deleteMany({
        where: { taskId: id },
      });

      // Criar novos itens de checklist
      await tx.checklistItem.createMany({
        data: checklist.map(description => ({
          taskId: id,
          description: description.trim(),
        })),
      });
    });

    revalidatePath("/maintenance-plans");
    return { message: "SUCCESS" };
  } catch (error) {
    console.error("Failed to update task template:", error);
    return { message: "Erro do banco de dados: Falha ao atualizar a tarefa." };
  }
} 