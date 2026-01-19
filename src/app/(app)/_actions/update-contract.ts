"use server"

import { z } from "zod"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const contractSchema = z.object({
  id: z.string().min(1, "ID é obrigatório."),
  name: z.string().min(1, "O nome é obrigatório."),
  acronym: z.string().min(1, "A sigla é obrigatória."),
  cnpj: z.string().optional(),
  address: z.string().optional(),
  sindico: z.string().optional(),
  phone: z.string().optional(),
  status: z.string().optional(),
})

export async function updateContract(prevState: any, formData: FormData) {
  console.log("Update contract called with formData:", Object.fromEntries(formData.entries()));
  
  const validatedFields = contractSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    acronym: formData.get("acronym"),
    cnpj: formData.get("cnpj"),
    address: formData.get("address"),
    sindico: formData.get("sindico"),
    phone: formData.get("phone"),
    status: formData.get("status"),
  })

  if (!validatedFields.success) {
    console.log("Validation failed:", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erro de validação.",
    }
  }

  try {
    console.log("Updating contract with data:", validatedFields.data);
    
    const updatedContract = await prisma.contract.update({
      where: { id: validatedFields.data.id },
      data: {
        name: validatedFields.data.name,
        acronym: validatedFields.data.acronym,
        cnpj: validatedFields.data.cnpj || null,
        address: validatedFields.data.address || null,
        sindico: validatedFields.data.sindico || null,
        phone: validatedFields.data.phone || null,
        status: validatedFields.data.status || null,
      },
    })

    console.log("Contract updated successfully:", updatedContract);
    revalidatePath("/")
    return { message: "SUCCESS" }
  } catch (error: any) {
    console.error("Error updating contract:", error);
    if (error.code === 'P2002' && error.meta?.target?.includes('acronym')) {
        return {
          errors: { acronym: ["Esta sigla já está em uso."] },
          message: "Erro: Sigla duplicada."
        };
    }
    return {
      errors: {},
      message: "Erro do banco de dados: Falha ao atualizar o contrato.",
    }
  }
} 