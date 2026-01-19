"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface ExecuteTaskData {
  taskId: string;
  description: string;
  checklistResults: string;
  startTime: Date;
  endTime: Date;
}

export async function executeTask(data: ExecuteTaskData) {
  try {
    // Buscar um usuário padrão (primeiro usuário do sistema)
    const user = await prisma.user.findFirst();
    
    if (!user) {
      throw new Error("Nenhum usuário encontrado no sistema");
    }

    // Criar a execução
    const execution = await prisma.execution.create({
      data: {
        description: data.description,
        userId: user.id,
        preventiveTaskId: data.taskId,
        startTime: data.startTime,
        endTime: data.endTime,
        checklistResults: data.checklistResults,
      },
      include: {
        user: true
      }
    });

    // Revalidar as páginas relacionadas
    revalidatePath("/preventive");
    revalidatePath(`/preventive/${data.taskId}`);

    return { 
      success: true, 
      executionId: execution.id,
      userName: user.name || user.email
    };
  } catch (error) {
    console.error("Erro ao executar tarefa:", error);
    throw new Error("Falha ao executar a tarefa");
  }
} 