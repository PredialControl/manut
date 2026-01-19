"use server";

import prisma from "@/lib/prisma";
import { sortFloors } from "@/lib/floor-sorter";

export async function getAssetStructure(contractId: string) {
  try {
    const buildings = await prisma.building.findMany({
      where: {
        contractId: contractId,
      },
      include: {
        floors: {
          // A ordenação será feita no código
          include: {
            locations: {
              orderBy: { name: 'asc' },
              include: {
                assets: {
                  orderBy: { name: 'asc' },
                },
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Ordena os andares de cada prédio usando a função personalizada
    const sortedBuildings = buildings.map(building => ({
      ...building,
      floors: sortFloors(building.floors),
    }));

    return sortedBuildings;
  } catch (error) {
    console.error("Failed to fetch asset structure:", error);
    return [];
  }
} 