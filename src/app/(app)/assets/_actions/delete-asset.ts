"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteAsset(assetId: string) {
  try {
    // Buscar tarefas preventivas ligadas a este ativo
    const tasks = await prisma.preventiveTask.findMany({
      where: { assetId },
      select: { id: true }
    });

    const taskIds = tasks.map(t => t.id);

    // Deletar execuções relacionadas a essas tarefas
    if (taskIds.length > 0) {
      await prisma.execution.deleteMany({
        where: { preventiveTaskId: { in: taskIds } }
      });
    }

    // Deletar chamados corretivos relacionados ao ativo
    await prisma.correctiveCall.deleteMany({
      where: { assetId }
    });

    // Deletar tarefas preventivas
    await prisma.preventiveTask.deleteMany({
      where: { assetId }
    });

    // Finalmente deletar o ativo
    await prisma.asset.delete({
      where: { id: assetId },
    });

    revalidatePath("/assets-list");
    revalidatePath("/assets");
    return { success: "Ativo excluído com sucesso!" };
  } catch (error) {
    return { error: "Erro do banco de dados: Falha ao excluir o ativo." };
  }
} 