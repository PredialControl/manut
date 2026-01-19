"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteContract(contractId: string) {
  if (!contractId) {
    return { error: "ID do contrato não fornecido." };
  }

  try {
    await prisma.contract.update({
      where: {
        id: contractId,
      },
      data: {
        deleted: true,
      },
    });

    revalidatePath("/");
    return { success: "Contrato arquivado com sucesso!" };
  } catch (error) {
    console.error(error);
    return { error: "Erro do banco de dados: Falha ao arquivar o contrato." };
  }
} 