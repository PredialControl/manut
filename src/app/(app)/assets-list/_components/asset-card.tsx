"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AssetColumn } from "./columns";
import { AlertTriangle, Eye, QrCode, Trash2 } from "lucide-react";
import { DeleteDialog } from "../../assets/_components/delete-dialog";
import { MaintenanceDialog } from "./maintenance-dialog";
import { QrCodeDownloader } from "./qr-code-downloader";

interface AssetCardProps {
  asset: AssetColumn;
  onOpenCorrectiveCall?: (asset: AssetColumn) => void;
}

export function AssetCard({ asset, onOpenCorrectiveCall }: AssetCardProps) {
  const getStatusBadge = (status: string) => {
    return status === "FUNCIONANDO" ? (
      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
        {status}
      </Badge>
    ) : (
      <Badge variant="secondary">{status}</Badge>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-all">
      <div className="flex p-4 gap-4">
        {/* Left - Image */}
        <div className="relative h-48 w-48 flex-shrink-0 rounded-lg overflow-hidden bg-secondary border border-border">
          {asset.imageUrl ? (
            <Image
              src={asset.imageUrl}
              alt={asset.name}
              fill
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary">
              <Image
                src="/placeholder-building.svg"
                alt="Placeholder"
                fill
                className="opacity-20 object-contain p-8"
              />
            </div>
          )}
        </div>

        {/* Center - Info */}
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <p className="text-xs text-muted-foreground mb-1">
              ID: {asset.tag || asset.id.slice(0, 15)}
            </p>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {asset.name}
            </h3>
            {getStatusBadge(asset.status)}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4">
            <div>
              <p className="text-xs text-muted-foreground">TIPO</p>
              <p className="text-sm font-medium text-foreground">{asset.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Modelo/Descrição</p>
              <p className="text-sm font-medium text-foreground">{asset.periodicity || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">QUANTIDADE</p>
              <p className="text-sm font-medium text-foreground">1</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">LOCAL</p>
              <p className="text-sm font-medium text-foreground">{asset.locationName}</p>
            </div>
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex flex-col gap-2 items-end justify-start min-w-[200px]">
          <Button
            onClick={() => onOpenCorrectiveCall?.(asset)}
            className="w-full h-10"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Chamado Corretivo
          </Button>

          <MaintenanceDialog tag={asset.tag}>
            <Button className="w-full h-10">
              <Eye className="h-4 w-4 mr-2" />
              Ver Manutenção
            </Button>
          </MaintenanceDialog>

          <QrCodeDownloader tag={asset.tag}>
            <Button className="w-full h-10">
              <QrCode className="h-4 w-4 mr-2" />
              Baixar QR Code
            </Button>
          </QrCodeDownloader>

          <DeleteDialog type="asset" id={asset.id} name={asset.name}>
            <Button variant="destructive" className="w-full h-10">
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </DeleteDialog>
        </div>
      </div>
    </div>
  );
}
