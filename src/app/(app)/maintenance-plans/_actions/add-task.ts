"use server"

import { z } from "zod"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const taskSchema = z.object({
  planId: z.string().min(1, "ID do plano é obrigatório."),
  sistema: z.string().min(1, "Sistema é obrigatório."),
  atividade: z.string().min(1, "Atividade é obrigatória."),
  periodicidade: z.string().min(1, "Periodicidade é obrigatória."),
  responsavel: z.string().min(1, "Responsável é obrigatório."),
  checklist: z.array(z.string()).optional(),
})

export async function addTask(prevState: any, formData: FormData) {
  const validatedFields = taskSchema.safeParse({
    planId: formData.get("planId"),
    sistema: formData.get("sistema"),
    atividade: formData.get("atividade"),
    periodicidade: formData.get("periodicidade"),
    responsavel: formData.get("responsavel"),
    checklist: formData.getAll("checklist").map(item => item.toString()),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erro de validação.",
    }
  }

  try {
    const task = await prisma.maintenanceTaskTemplate.create({
      data: {
        planId: validatedFields.data.planId,
        sistema: validatedFields.data.sistema,
        atividade: validatedFields.data.atividade,
        periodicidade: validatedFields.data.periodicidade,
        responsavel: validatedFields.data.responsavel,
      },
    })

    // Criar checklist items se fornecidos
    if (validatedFields.data.checklist && validatedFields.data.checklist.length > 0) {
      await prisma.checklistItem.createMany({
        data: validatedFields.data.checklist.map((description) => ({
          description: description.trim(),
          taskId: task.id,
        })),
      })
    }

    revalidatePath("/maintenance-plans")
    return { message: "SUCCESS" }
  } catch (error: any) {
    return {
      errors: {},
      message: "Erro do banco de dados: Falha ao criar a tarefa.",
    }
  }
} 