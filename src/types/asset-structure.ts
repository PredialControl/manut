import { Prisma } from "@prisma/client";

export type AssetStructure = Prisma.BuildingGetPayload<{
  include: {
    floors: {
      include: {
        locations: {
          include: {
            assets: true;
          };
        };
      };
    };
  };
}>[]; 