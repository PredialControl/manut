"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreateFloorsSchema = z.object({
  buildingId: z.string(),
  startFloor: z.coerce.number(),
  endFloor: z.coerce.number(),
  includeTerreo: z.boolean(),
  contractId: z.string(),
});

export async function createFloors(prevState: any, formData: FormData) {
  const validatedFields = CreateFloorsSchema.safeParse({
    buildingId: formData.get("buildingId"),
    startFloor: formData.get("startFloor"),
    endFloor: formData.get("endFloor"),
    includeTerreo: formData.get("includeTerreo") === "on",
    contractId: formData.get("contractId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erro de validação.",
    };
  }

  const { buildingId, startFloor, endFloor, includeTerreo, contractId } = validatedFields.data;

  if (startFloor < endFloor) {
    return {
        message: "O andar inicial deve ser maior ou igual ao andar final."
    }
  }

  const floorNumbers = [];
  for (let i = startFloor; i >= endFloor; i--) {
    if (i === 0) continue;
    floorNumbers.push(i);
  }

  const floorCreationData = floorNumbers.map(num => ({
    name: `${num}º Andar`,
    buildingId,
  }));

  if (includeTerreo) {
    floorCreationData.push({ name: "Térreo", buildingId });
  }

  try {
    await prisma.floor.createMany({
      data: floorCreationData,
    });

    revalidatePath(`/assets?contractId=${contractId}`);
    return { message: "SUCCESS" };
  } catch (error) {
    console.error("Failed to create floors:", error);
    return { message: "Erro do banco de dados: Falha ao criar os andares." };
  }
} 