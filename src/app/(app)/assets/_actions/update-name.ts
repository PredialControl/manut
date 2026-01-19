"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const UpdateNameSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "O nome não pode estar vazio."),
  type: z.enum(["building", "floor", "location", "asset"]),
  contractId: z.string(),
});

export async function updateName(prevState: any, formData: FormData) {
  const validatedFields = UpdateNameSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    type: formData.get("type"),
    contractId: formData.get("contractId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erro de validação.",
    };
  }

  const { id, name, type, contractId } = validatedFields.data;

  try {
    switch (type) {
      case "building":
        await prisma.building.update({ where: { id }, data: { name } });
        break;
      case "floor":
        await prisma.floor.update({ where: { id }, data: { name } });
        break;
      case "location":
        await prisma.location.update({ where: { id }, data: { name } });
        break;
      case "asset":
        await prisma.asset.update({ where: { id }, data: { name } });
        break;
      default:
        return { message: "Tipo inválido." };
    }

    revalidatePath(`/assets?contractId=${contractId}`);
    return { message: "SUCCESS" };
  } catch (error) {
    console.error(`Failed to update ${type} name:`, error);
    return { message: `Erro do banco de dados: Falha ao atualizar o nome.` };
  }
} 