import prisma from "@/lib/prisma";
import { AssetListClient } from "./_components/asset-list-client";
import { AssetColumn } from "./_components/columns";
import { getMostFrequentPeriodicity } from "@/lib/periodicity-sorter";
import { Suspense } from 'react';

export default async function AssetListPage({
  searchParams,
}: {
  searchParams: { contractId?: string };
}) {
  const { contractId } = searchParams;

  const [assets, locations] = await Promise.all([
    prisma.asset.findMany({
      where: {
        location: {
          floor: {
            building: {
              contractId: contractId ? contractId : undefined,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        status: true,
        tag: true,
        imageUrl: true,
        location: {
          select: {
            name: true,
            floor: {
              select: {
                name: true,
              },
            },
          },
        },
        preventiveTasks: {
          select: {
            frequency: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.location.findMany({
      where: {
        floor: {
          building: {
            contractId: contractId ? contractId : undefined,
          },
        },
      },
      include: {
        floor: true,
      },
    }),
  ]);

  const formattedAssets: AssetColumn[] = assets.map((asset) => ({
    id: asset.id,
    name: asset.name,
    locationName: asset.location.name,
    floorName: asset.location.floor.name,
    status: asset.status,
    tag: asset.tag,
    imageUrl: asset.imageUrl,
    periodicity: getMostFrequentPeriodicity(asset.preventiveTasks.map(t => t.frequency)),
  }));

  return (
    <div className="flex-1 p-6 h-full">
      <div className="w-full">
        <Suspense fallback={<div>Carregando ativos...</div>}>
          <AssetListClient data={formattedAssets} locations={locations} />
        </Suspense>
      </div>
    </div>
  );
}
