"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreateTaskSchema = z.object({
  planId: z.string(),
  sistema: z.string().min(1, "Sistema é obrigatório"),
  atividade: z.string().min(1, "Atividade é obrigatória"),
  periodicidade: z.string().min(1, "Periodicidade é obrigatória"),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  checklist: z.array(z.string()).min(1, "Pelo menos um item de checklist é obrigatório"),
});

export async function createTask(prevState: any, formData: FormData) {
  const checklistItems = formData.getAll("checklist") as string[];

  const validatedFields = CreateTaskSchema.safeParse({
    planId: formData.get("planId"),
    sistema: formData.get("sistema"),
    atividade: formData.get("atividade"),
    periodicidade: formData.get("periodicidade"),
    responsavel: formData.get("responsavel"),
    checklist: checklistItems.filter(item => item.trim() !== ""),
  });

  if (!validatedFields.success) {
    return {
      message: "Erro de validação.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { planId, sistema, atividade, periodicidade, responsavel, checklist } = validatedFields.data;

  try {
    await prisma.maintenanceTaskTemplate.create({
      data: {
        planId,
        sistema,
        atividade,
        periodicidade,
        responsavel,
        checklist: {
          create: checklist.map(description => ({
            description: description.trim(),
          })),
        },
      },
    });

    revalidatePath("/maintenance-plans");
    return { message: "SUCCESS" };
  } catch (error) {
    console.error("Failed to create task:", error);
    return { message: "Erro do banco de dados: Falha ao criar a tarefa." };
  }
} 