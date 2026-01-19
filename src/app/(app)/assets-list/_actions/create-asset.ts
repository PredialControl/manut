"use server";

import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { getPrefixForAssetName } from "@/lib/tag-generator";
import { maintenanceData } from "@/lib/maintenance-data";
import { generateOmNumber } from "@/lib/om-generator";

const CreateAssetSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  locationId: z.string().min(1, "Por favor, selecione uma localidade."),
  status: z.string(),
  imageUrl: z.string().optional(),
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

export async function createAsset(prevState: any, formData: FormData) {
  const validatedFields = CreateAssetSchema.safeParse({
    name: formData.get("name"),
    locationId: formData.get("locationId"),
    status: formData.get("status"),
    imageUrl: formData.get("imageUrl"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erro de validação.",
    };
  }

  const { name, locationId, status, imageUrl } = validatedFields.data;

  try {
    const locationData = await prisma.location.findUnique({
        where: { id: locationId },
        select: {
          name: true,
          floor: {
            select: {
              name: true,
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
    });

    if (!locationData || !locationData.floor || !locationData.floor.building?.contract?.acronym) {
        return { message: "Erro: Localidade, andar ou contrato não encontrado para gerar a TAG." };
    }

    const prefix = getPrefixForAssetName(name);
    const floorIdentifier = formatFloorIdentifier(locationData.floor.name);
    const locationIdentifier = formatLocationIdentifier(locationData.name);

    const count = await prisma.asset.count({
      where: {
        tag: {
          startsWith: `${prefix}-`,
        },
      },
    });

    const nextNumber = (count + 1).toString().padStart(4, '0');
    const tag = `${prefix}-${floorIdentifier}-${locationIdentifier}-${nextNumber}`;

    const newAsset = await prisma.asset.create({
      data: {
        name,
        locationId,
        status,
        tag,
        imageUrl: imageUrl || null,
      },
    });

    const maintenancePlan = maintenanceData[prefix];
    if (maintenancePlan && maintenancePlan.tasks) {
      for (const task of maintenancePlan.tasks) {
        const checklistItems = task.details.split(';').map(item => ({ item: item.trim() }));
        const checklistString = JSON.stringify(checklistItems);
        const contractAcronym = locationData.floor.building.contract.acronym;
        const ompNumber = await generateOmNumber(contractAcronym);

        await prisma.preventiveTask.create({
          data: {
            ompNumber: ompNumber,
            description: task.details,
            frequency: task.periodicity,
            startDate: new Date(),
            assetId: newAsset.id,
            checklist: checklistString,
          },
        });
      }
    }

    revalidatePath("/assets-list");
    revalidateTag("asset-structure");
    return { message: "SUCCESS" }; 
  } catch (error) {
    console.error("Tag Generation Error:", error);
    return { message: "Erro do banco de dados: Falha ao criar o ativo." };
  }
} 