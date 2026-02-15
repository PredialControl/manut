"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function restoreContract(contractId: string) {
  if (!contractId) {
    return { error: "ID do contrato não fornecido." };
  }

  try {
    await prisma.contract.update({
      where: {
        id: contractId,
      },
      data: {
        deleted: false,
      },
    });

    revalidatePath("/trash"); // Atualiza a lixeira
    revalidatePath("/gestao-contratos"); // Atualiza a página de contratos
    return { success: "Contrato restaurado com sucesso!" };
  } catch (error) {
    console.error(error);
    return { error: "Erro do banco de dados: Falha ao restaurar o contrato." };
  }
} 