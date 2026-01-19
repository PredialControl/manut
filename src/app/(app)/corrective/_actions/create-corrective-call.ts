"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { generateOMCNumber } from "@/lib/om-generator";

const correctiveCallSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  priority: z.enum(["ALTA", "MEDIA", "BAIXA"]),
  assetId: z.string().optional(),
  contractId: z.string().min(1, "Contrato é obrigatório"),
  especialidade: z.string().optional(),
  location: z.string().optional(),
  locationId: z.string().optional(),
  floor: z.string().optional(),
});

export async function createCorrectiveCall(formData: FormData) {
  try {
    const data = {
      description: formData.get("description") as string,
      priority: formData.get("priority") as string,
      assetId: formData.get("assetId") as string,
      contractId: formData.get("contractId") as string,
      especialidade: formData.get("especialidade") as string,
      location: formData.get("location") as string,
      locationId: formData.get("locationId") as string,
      floor: formData.get("floor") as string,
    };

    // Validar dados
    const validatedData = correctiveCallSchema.parse(data);

    // Verificar se o ativo pertence ao contrato (se fornecido)
    if (validatedData.assetId) {
      const asset = await prisma.asset.findFirst({
        where: {
          id: validatedData.assetId,
          location: {
            floor: {
              building: {
                contractId: validatedData.contractId
              }
            }
          }
        }
      });

      if (!asset) {
        return {
          success: false,
          error: "Ativo não encontrado ou não pertence ao contrato selecionado"
        };
      }
    }

    // Gerar número OMC
    const omcNumber = await generateOMCNumber();

    // Criar corretiva com status "ABERTO" automaticamente
    const createData: any = {
      title: validatedData.description.substring(0, 100), // Usar descrição como título (limitado a 100 chars)
      description: validatedData.description,
      priority: validatedData.priority,
      status: "ABERTO", // Status sempre "ABERTO" para novas corretivas
      omcNumber,
    };

    // Adicionar assetId apenas se fornecido
    if (validatedData.assetId) {
      createData.assetId = validatedData.assetId;
    }

    const correctiveCall = await prisma.correctiveCall.create({
      data: createData,
    });

    // Revalidar páginas
    revalidatePath("/corrective");
    revalidatePath(`/corrective?contractId=${validatedData.contractId}`);

    return {
      success: true,
      data: correctiveCall
    };

  } catch (error) {
    console.error("Erro ao criar corretiva:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Dados inválidos"
      };
    }

    return {
      success: false,
      error: "Erro interno do servidor"
    };
  }
} 