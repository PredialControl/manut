"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { generateOmNumber } from "@/lib/om-generator"

const CreateCorrectiveCallSchema = z.object({
  assetId: z.string(),
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres."),
  description: z.string().optional(),
  priority: z.enum(["BAIXA", "MEDIA", "ALTA", "URGENTE"]),
})

export async function createCorrectiveCall(prevState: any, formData: FormData) {
  const validatedFields = CreateCorrectiveCallSchema.safeParse({
    assetId: formData.get("assetId"),
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erro de validação.",
    }
  }

  const { assetId, title, description, priority } = validatedFields.data

  try {
    // Buscar o contrato do ativo para gerar o número OM
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
      select: {
        location: {
          select: {
            floor: {
              select: {
                building: {
                  select: {
                    contract: {
                      select: {
                        acronym: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!asset?.location?.floor?.building?.contract?.acronym) {
      return { message: "Erro: Não foi possível encontrar o contrato do ativo." };
    }

    const omcNumber = await generateOmNumber(asset.location.floor.building.contract.acronym)

    await prisma.correctiveCall.create({
      data: {
        omcNumber,
        assetId,
        title,
        description,
        priority,
        status: "ABERTO",
      },
    })

    revalidatePath("/assets-list")
    return { message: "SUCCESS" }
  } catch (error) {
    console.error(error)
    return { message: "Erro do banco de dados: Falha ao criar o chamado corretivo." }
  }
} 