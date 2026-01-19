"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getPrefixForAssetName } from "@/lib/tag-generator";
import { maintenanceData } from "@/lib/maintenance-data";
import { generateOmNumber } from "@/lib/om-generator";

const CreateAssetSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  locationId: z.string(),
  tag: z.string().optional(),
  model: z.string().optional(),
  manufacturer: z.string().optional(),
  quantity: z.coerce.number().optional(),
  type: z.string().optional(),
  contractId: z.string(),
});

function formatFloorIdentifier(floorName: string): string {
  const upperName = floorName.toUpperCase();
  if (upperName === 'TÉRREO') return 'T';
  const match = upperName.match(/-?\d+/);
  return match ? match[0] : upperName.slice(0, 3).replace(/ /g, '');
}

function formatLocationIdentifier(locationName: string): string {
  return locationName
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 15);
}

async function generateTag(name: string, locationId: string): Promise<string> {
  const locationData = await prisma.location.findUnique({
    where: { id: locationId },
    select: { name: true, floor: { select: { name: true } } }
  });

  if (!locationData || !locationData.floor) {
    throw new Error("Localidade ou andar não encontrado para gerar a TAG.");
  }

  const prefix = getPrefixForAssetName(name);
  const floorIdentifier = formatFloorIdentifier(locationData.floor.name);
  const locationIdentifier = formatLocationIdentifier(locationData.name);

  const count = await prisma.asset.count({
    where: {
      tag: { startsWith: `${prefix}-` },
    },
  });

  const nextNumber = (count + 1).toString().padStart(4, '0');
  return `${prefix}-${floorIdentifier}-${locationIdentifier}-${nextNumber}`;
}

export async function createAsset(prevState: any, formData: FormData) {
  const validatedFields = CreateAssetSchema.safeParse({
    name: formData.get("name"),
    locationId: formData.get("locationId"),
    tag: formData.get("tag"),
    contractId: formData.get("contractId"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, message: "Erro de validação." };
  }

  const { name, locationId, tag: manualTag, contractId, model, manufacturer, quantity, type } = validatedFields.data;

  try {
    const finalTag = manualTag && manualTag.length > 0 ? manualTag : await generateTag(name, locationId);

    // Buscar o acronym do contrato
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      select: { acronym: true }
    });

    if (!contract?.acronym) {
      return { message: "Erro: Contrato não encontrado.", errors: {} };
    }

    const newAsset = await prisma.asset.create({
      data: {
        name,
        locationId,
        status: "ATIVO",
        tag: finalTag,
        model,
        manufacturer,
        quantity: quantity || 1,
        type,
      },
    });

    const prefix = getPrefixForAssetName(name);
    const maintenancePlan = maintenanceData[prefix];
    if (maintenancePlan && maintenancePlan.tasks) {
      for (const task of maintenancePlan.tasks) {
        const checklistItems = task.details.split(';').map(item => ({ item: item.trim() }));
        const checklistString = JSON.stringify(checklistItems);
        const ompNumber = await generateOmNumber(contract.acronym);

        await prisma.preventiveTask.create({
          data: {
            ompNumber,
            description: task.details,
            frequency: task.periodicity,
            startDate: new Date(),
            assetId: newAsset.id,
            checklist: checklistString,
          },
        });
      }
    }

    revalidatePath(`/assets?contractId=${contractId}`);
    return { message: "SUCCESS", errors: {} };
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('tag')) {
      return { errors: { tag: ["Esta TAG já está em uso."] }, message: "Erro: TAG duplicada." };
    }
    console.error("Failed to create asset:", error);
    return { message: "Erro do banco de dados: Falha ao criar o ativo.", errors: {} };
  }
} 