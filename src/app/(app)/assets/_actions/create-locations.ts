"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreateLocationsSchema = z.object({
  floorId: z.string().min(1, "Por favor, selecione um andar."),
  locationNames: z.string().min(1, "O nome da localidade é obrigatório."),
  contractId: z.string(),
});

export async function createLocations(prevState: any, formData: FormData) {
  const validatedFields = CreateLocationsSchema.safeParse({
    floorId: formData.get("floorId"),
    locationNames: formData.get("locationNames"),
    contractId: formData.get("contractId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erro de validação.",
    };
  }

  const { floorId, locationNames, contractId } = validatedFields.data;

  const names = locationNames.split('/').map(name => name.trim()).filter(name => name.length > 0);

  if (names.length === 0) {
    return {
        message: "Por favor, forneça pelo menos um nome de localidade válido."
    }
  }

  const locationCreationData = names.map(name => ({
    name,
    floorId,
  }));

  try {
    await prisma.location.createMany({
      data: locationCreationData,
    });

    revalidatePath(`/assets?contractId=${contractId}`);
    return { message: "SUCCESS" };
  } catch (error) {
    console.error("Failed to create locations:", error);
    return { message: "Erro do banco de dados: Falha ao criar as localidades." };
  }
} 