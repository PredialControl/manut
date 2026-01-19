"use server"

import { z } from "zod"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const contractSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  acronym: z.string().min(1, "A sigla é obrigatória."),
  cnpj: z.string().optional(),
  address: z.string().optional(),
  sindico: z.string().optional(),
  phone: z.string().optional(),
  status: z.string().optional(),
  imageUrl: z.string().optional(),
})

export async function createContract(prevState: any, formData: FormData) {
  const validatedFields = contractSchema.safeParse({
    name: formData.get("name"),
    acronym: formData.get("acronym"),
    cnpj: formData.get("cnpj"),
    address: formData.get("address"),
    sindico: formData.get("sindico"),
    phone: formData.get("phone"),
    status: formData.get("status"),
    imageUrl: formData.get("imageUrl"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erro de validação.",
    }
  }

  try {
    await prisma.contract.create({
      data: validatedFields.data,
    })

    revalidatePath("/")
    return { message: "SUCCESS" }
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('acronym')) {
        return {
          errors: { acronym: ["Esta sigla já está em uso."] },
          message: "Erro: Sigla duplicada."
        };
    }
    return {
      errors: {},
      message: "Erro do banco de dados: Falha ao criar o contrato.",
    }
  }
} 