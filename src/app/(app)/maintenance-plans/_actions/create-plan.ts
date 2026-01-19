"use server"

import { z } from "zod"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const planSchema = z.object({
  acronym: z.string().min(1, "A sigla é obrigatória."),
  category: z.string().min(1, "A categoria é obrigatória."),
  description: z.string().min(1, "A descrição é obrigatória."),
  sistema: z.string().min(1, "O sistema é obrigatório."),
  atividade: z.string().min(1, "A atividade é obrigatória."),
  periodicidade: z.string().min(1, "A periodicidade é obrigatória."),
})

export async function createMaintenancePlan(prevState: any, formData: FormData) {
  const validatedFields = planSchema.safeParse({
    acronym: formData.get("acronym"),
    category: formData.get("category"),
    description: formData.get("description"),
    sistema: formData.get("sistema"),
    atividade: formData.get("atividade"),
    periodicidade: formData.get("periodicidade"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erro de validação.",
    }
  }

  try {
    // Criar o plano de manutenção
    const plan = await prisma.maintenancePlan.create({
      data: {
        acronym: validatedFields.data.acronym,
        category: validatedFields.data.category,
        description: validatedFields.data.description,
      },
    })

          // Criar uma tarefa padrão para o plano
      await prisma.maintenanceTaskTemplate.create({
        data: {
          sistema: validatedFields.data.sistema,
          atividade: validatedFields.data.atividade,
          periodicidade: validatedFields.data.periodicidade,
          responsavel: "Técnico", // Padrão
          planId: plan.id,
        },
      })

    revalidatePath("/maintenance-plans")
    return { message: "SUCCESS" }
  } catch (error: any) {
    console.error("Error creating plan:", error);
    return {
      errors: {},
      message: "Erro do banco de dados: Falha ao criar o plano.",
    }
  }
} 