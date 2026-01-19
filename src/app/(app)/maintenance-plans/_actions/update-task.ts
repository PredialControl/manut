"use server"

import { z } from "zod"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const updateTaskSchema = z.object({
  taskId: z.string().min(1, "ID da tarefa é obrigatório."),
  sistema: z.string().min(1, "Sistema é obrigatório."),
  atividade: z.string().min(1, "Atividade é obrigatória."),
  periodicidade: z.string().min(1, "Periodicidade é obrigatória."),
  responsavel: z.string().min(1, "Responsável é obrigatório."),
})

export async function updateTask(prevState: any, formData: FormData) {
  console.log("UpdateTask chamado com formData:", Object.fromEntries(formData.entries()));
  
  const validatedFields = updateTaskSchema.safeParse({
    taskId: formData.get("taskId"),
    sistema: formData.get("sistema"),
    atividade: formData.get("atividade"),
    periodicidade: formData.get("periodicidade"),
    responsavel: formData.get("responsavel"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erro de validação.",
    }
  }

  try {
    console.log("Atualizando tarefa com dados:", validatedFields.data);
    
    await prisma.maintenanceTaskTemplate.update({
      where: { id: validatedFields.data.taskId },
      data: {
        sistema: validatedFields.data.sistema,
        atividade: validatedFields.data.atividade,
        periodicidade: validatedFields.data.periodicidade,
        responsavel: validatedFields.data.responsavel,
      },
    })

    revalidatePath("/maintenance-plans")
    return { message: "SUCCESS" }
  } catch (error: any) {
    return {
      errors: {},
      message: "Erro do banco de dados: Falha ao atualizar a tarefa.",
    }
  }
} 