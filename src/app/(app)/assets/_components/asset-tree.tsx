"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  File,
  Building as BuildingIcon,
  Layers as FloorIcon,
  MapPin,
} from "lucide-react";
import { Prisma } from "@prisma/client";
import { AddFloorsDialog } from "./add-floors-dialog";
import { AddRoomDialog } from "./add-room-dialog";
import { DeleteTreeItemDialog } from "./delete-tree-item-dialog";
import { EditNameDialog } from "./edit-name-dialog";
import { Badge } from "@/components/ui/badge";
import { AddAssetDialog } from "./add-asset-dialog";

type AssetStructure = Prisma.BuildingGetPayload<{
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

interface AssetTreeProps {
  initialData: AssetStructure;
  contractId: string;
}

type EditableItem = {
  id: string;
  name: string;
  type: "building" | "floor" | "location" | "asset";
}

export function AssetTree({ initialData, contractId }: AssetTreeProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>(() => {
    const initialOpenState: Record<string, boolean> = {};
    initialData.forEach(building => {
      initialOpenState[building.id] = true;
      building.floors.forEach(floor => {
        initialOpenState[floor.id] = true;
        floor.locations.forEach(location => {
          initialOpenState[location.id] = true;
        })
      })
    })
    return initialOpenState;
  });

  const [editingItem, setEditingItem] = useState<EditableItem | null>(null);

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isItemOpen = (id: string) => openItems[id] ?? false;

  const handleDoubleClick = (item: EditableItem) => {
    setEditingItem(item);
  }

  return (
    <div className="space-y-3">
      {initialData.map((building) => (
        <div key={building.id} className="animate-in fade-in slide-in-from-left-2 duration-300">
          {/* Building Node */}
          <div className="flex items-center space-x-2 group">
            <button onClick={() => toggleItem(building.id)} className="p-1.5 hover:bg-secondary rounded-md transition-colors">
              {isItemOpen(building.id) ? <ChevronDown className="h-4 w-4 text-primary" /> : <ChevronRight className="h-4 w-4 text-primary" />}
            </button>
            <div
              onDoubleClick={() => handleDoubleClick({ id: building.id, name: building.name, type: 'building' })}
              className="flex-1 flex items-center justify-between p-3 px-4 rounded-lg bg-card border border-border cursor-pointer hover:border-primary/30 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-md bg-primary/10">
                  <BuildingIcon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-semibold text-foreground">{building.name}</span>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <AddFloorsDialog buildingId={building.id} contractId={contractId} />
                <DeleteTreeItemDialog id={building.id} name={building.name} type="building" contractId={contractId} />
              </div>
            </div>
          </div>

          {/* Floors */}
          {isItemOpen(building.id) && (
            <div className="pl-6 border-l-2 border-border ml-4 mt-2 space-y-2">
              {building.floors.map((floor) => (
                <div key={floor.id} className="animate-in fade-in slide-in-from-left-1 duration-200">
                  <div className="flex items-center space-x-2 group">
                    <button onClick={() => toggleItem(floor.id)} className="p-1.5 hover:bg-secondary rounded-md transition-colors">
                      {isItemOpen(floor.id) ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </button>
                    <div
                      onDoubleClick={() => handleDoubleClick({ id: floor.id, name: floor.name, type: 'floor' })}
                      className="flex-1 flex items-center justify-between p-2.5 px-4 rounded-lg bg-card border border-border cursor-pointer hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <FloorIcon className="h-4 w-4 text-primary/70" />
                        <span className="font-medium text-foreground/90 text-sm">{floor.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <AddRoomDialog floorId={floor.id} floorName={floor.name} contractId={contractId} />
                        <DeleteTreeItemDialog id={floor.id} name={floor.name} type="floor" contractId={contractId} />
                      </div>
                    </div>
                  </div>

                  {/* Locations */}
                  {isItemOpen(floor.id) && (
                    <div className="pl-6 border-l border-border ml-4 mt-2 space-y-2">
                      {floor.locations.map((location) => (
                        <div key={location.id} className="animate-in fade-in duration-200">
                          <div className="flex items-center space-x-2 group">
                            <button onClick={() => toggleItem(location.id)} className="p-1 hover:bg-secondary rounded-md transition-colors">
                              {isItemOpen(location.id) ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                            </button>
                            <div
                              onDoubleClick={() => handleDoubleClick({ id: location.id, name: location.name, type: 'location' })}
                              className="flex-1 flex items-center justify-between p-2 px-3 rounded-lg bg-card/50 border border-border/50 cursor-pointer hover:border-primary/30 transition-all"
                            >
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-3.5 w-3.5 text-primary/50" />
                                <span className="text-sm font-medium text-foreground/80">{location.name}</span>
                              </div>
                              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <AddAssetDialog locationId={location.id} contractId={contractId} />
                                <DeleteTreeItemDialog id={location.id} name={location.name} type="location" contractId={contractId} />
                              </div>
                            </div>
                          </div>

                          {/* Assets */}
                          {isItemOpen(location.id) && (
                            <div className="pl-8 mt-2 space-y-1.5">
                              {location.assets.map((asset) => (
                                <div
                                  onDoubleClick={() => handleDoubleClick({ id: asset.id, name: asset.name, type: 'asset' })}
                                  key={asset.id}
                                  className="group flex items-center justify-between p-2 px-3 rounded-md bg-secondary/30 border border-transparent hover:border-primary/30 hover:bg-secondary/50 transition-all cursor-pointer"
                                >
                                  <div className="flex items-center space-x-2">
                                    <File className="h-3.5 w-3.5 text-primary/40" />
                                    <span className="text-xs text-foreground/70 font-medium">{asset.name}</span>
                                    {asset.tag && <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] h-4 py-0">{asset.tag}</Badge>}
                                  </div>
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <DeleteTreeItemDialog id={asset.id} name={asset.name} type="asset" contractId={contractId} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {editingItem && (
        <EditNameDialog
          isOpen={!!editingItem}
          setIsOpen={() => setEditingItem(null)}
          id={editingItem.id}
          currentName={editingItem.name}
          type={editingItem.type}
          contractId={contractId}
        />
      )}
    </div>
  );
}
