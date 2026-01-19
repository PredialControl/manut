"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreateConstructionItemSchema = z.object({
  number: z.string().min(1, "Número do chamado é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  status: z.string().min(1, "Status é obrigatório"),
  especialidade: z.string().optional(),
  openedAt: z.string().min(1, "Data de abertura é obrigatória"),
  deadline: z.string().optional(),
  feedback: z.string().optional(),
  contractId: z.string().min(1, "Contract ID é obrigatório"),
});

export async function createConstructionItem(prevState: any, formData: FormData) {
  const validatedFields = CreateConstructionItemSchema.safeParse({
    number: formData.get("number"),
    description: formData.get("description"),
    status: formData.get("status"),
    especialidade: formData.get("especialidade") || undefined,
    openedAt: formData.get("openedAt"),
    deadline: formData.get("deadline") || undefined,
    feedback: formData.get("feedback") || undefined,
    contractId: formData.get("contractId"),
  });

  if (!validatedFields.success) {
    return {
      message: "Erro de validação.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { number, description, status, especialidade, openedAt, deadline, feedback, contractId } = validatedFields.data;

  try {
    // Verificar se o número do chamado já existe
    const existingItem = await prisma.constructionItem.findFirst({
      where: { number }
    });

    if (existingItem) {
      return {
        message: "Este número de chamado já existe.",
        errors: { number: ["Número já existe"] }
      };
    }

    // Processar datas corretamente para evitar problemas de timezone
    const processDateForDatabase = (dateString: string | null | undefined) => {
      if (!dateString) return null;
      
      // Se é uma string de data YYYY-MM-DD, criar Date object corretamente
      if (typeof dateString === 'string' && dateString.includes('-')) {
        const [year, month, day] = dateString.split('-');
        // Criar data no meio do dia para evitar problemas de timezone
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0);
      }
      
      return new Date(dateString);
    };

    const processedOpenedAt = processDateForDatabase(openedAt);
    if (!processedOpenedAt) {
      return { message: "A data de abertura é obrigatória.", errors: { openedAt: ["Data obrigatória"] } };
    }

    await prisma.constructionItem.create({
      data: {
        number,
        description,
        status,
        especialidade: especialidade || null,
        openedAt: processedOpenedAt,
        deadline: processDateForDatabase(deadline),
        feedback: feedback || null,
        contractId,
      },
    });

    revalidatePath("/construction-items");
    return { message: "SUCCESS" };
  } catch (error) {
    console.error("Failed to create construction item:", error);
    return { message: "Erro do banco de dados: Falha ao criar o item." };
  }
} 