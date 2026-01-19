"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const DeleteTaskSchema = z.object({
  taskId: z.string(),
});

export async function deleteTask(prevState: any, formData: FormData) {
  const validatedFields = DeleteTaskSchema.safeParse({
    taskId: formData.get("taskId"),
  });

  if (!validatedFields.success) {
    return {
      message: "Erro de validação.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { taskId } = validatedFields.data;

  try {
    // A exclusão em cascata cuidará dos itens de checklist
    await prisma.maintenanceTaskTemplate.delete({
      where: { id: taskId },
    });

    revalidatePath("/maintenance-plans");
    return { message: "SUCCESS" };
  } catch (error) {
    console.error("Failed to delete task:", error);
    return { message: "Erro do banco de dados: Falha ao remover a tarefa." };
  }
} 