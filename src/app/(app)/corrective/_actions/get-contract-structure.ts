"use server";

import prisma from "@/lib/prisma";

export async function getContractStructure(contractId: string) {
  try {
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        buildings: {
          include: {
            floors: {
              include: {
                locations: {
                  include: {
                    assets: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!contract) {
      return { success: false, error: "Contrato não encontrado" };
    }

    const floors = contract.buildings.flatMap(building => 
      building.floors.map(floor => ({
        id: floor.id,
        name: floor.name,
        buildingName: building.name
      }))
    );

    const locations = contract.buildings.flatMap(building => 
      building.floors.flatMap(floor => 
        floor.locations.map(location => ({
          id: location.id,
          name: location.name,
          floorName: floor.name,
          buildingName: building.name
        }))
      )
    );

    const assets = contract.buildings.flatMap(building => 
      building.floors.flatMap(floor => 
        floor.locations.flatMap(location => 
          location.assets.map(asset => ({
            id: asset.id,
            name: asset.name,
            tag: asset.tag,
            locationName: location.name,
            floorName: floor.name,
            buildingName: building.name
          }))
        )
      )
    );

    return {
      success: true,
      data: {
        floors,
        locations,
        assets
      }
    };
  } catch (error) {
    console.error("Erro ao buscar estrutura do contrato:", error);
    return { success: false, error: "Erro ao buscar estrutura do contrato" };
  }
} 