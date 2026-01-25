"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AssetColumn } from "./columns";
import { AlertTriangle, Eye, QrCode, Trash2, Download } from "lucide-react";
import { DeleteDialog } from "../../assets/_components/delete-dialog";
import { MaintenanceDialog } from "./maintenance-dialog";
import { QrCodeDownloader } from "./qr-code-downloader";
import { cn } from "@/lib/utils";

interface AssetCardProps {
  asset: AssetColumn;
  onOpenCorrectiveCall?: (asset: AssetColumn) => void;
}

export function AssetCard({ asset, onOpenCorrectiveCall }: AssetCardProps) {
  const getStatusBadge = (status: string) => {
    return status === "FUNCIONANDO" || status === "ATIVO" ? (
      <Badge className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 border-emerald-500/20 px-3 py-0.5 text-[10px] tracking-wide font-medium">
        {status}
      </Badge>
    ) : (
      <Badge variant="secondary" className="text-[10px] tracking-wide font-medium bg-muted text-muted-foreground">{status}</Badge>
    );
  };

  return (
    <div className="group relative bg-card/50 hover:bg-card border border-border/50 hover:border-border transition-all duration-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md">
      <div className="flex flex-col md:flex-row p-5 gap-6">

        {/* Left - Image */}
        <div className="relative h-40 w-40 flex-shrink-0 rounded-lg overflow-hidden bg-secondary/30 border border-border/50 mx-auto md:mx-0">
          {asset.imageUrl ? (
            <Image
              src={asset.imageUrl}
              alt={asset.name}
              fill
              className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary/20">
              <QrCode className="h-12 w-12 text-muted-foreground/20" />
            </div>
          )}
        </div>

        {/* Center - Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                  ID: {asset.tag || asset.id.slice(0, 8)}
                </p>
                <h3 className="text-xl font-bold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">
                  {asset.name}
                </h3>
                {getStatusBadge(asset.status || "ATIVO")}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">TIPO</p>
                <p className="text-sm font-medium text-foreground truncate">{asset.name}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">MODELO</p>
                <p className="text-sm font-medium text-foreground truncate">{asset.periodicity || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">QUANTIDADE</p>
                <p className="text-sm font-medium text-foreground">1</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">LOCAL</p>
                <p className="text-sm font-medium text-foreground truncate">{asset.locationName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Actions - Agora mais elegante e menos agressivo */}
        <div className="flex flex-col gap-2 min-w-[180px] border-l border-border/50 pl-6 ml-2 justify-center">

          <Button
            onClick={() => onOpenCorrectiveCall?.(asset)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 h-9 text-xs font-semibold tracking-wide"
          >
            <AlertTriangle className="h-3.5 w-3.5 mr-2" />
            ABRIR CHAMADO
          </Button>

          <MaintenanceDialog tag={asset.tag}>
            <Button variant="outline" className="w-full border-border/60 hover:bg-secondary/50 hover:text-foreground h-9 text-xs font-medium">
              <Eye className="h-3.5 w-3.5 mr-2" />
              Ver Histórico
            </Button>
          </MaintenanceDialog>

          <QrCodeDownloader tag={asset.tag}>
            <Button variant="outline" className="w-full border-border/60 hover:bg-secondary/50 hover:text-foreground h-9 text-xs font-medium">
              <Download className="h-3.5 w-3.5 mr-2" />
              QR Code
            </Button>
          </QrCodeDownloader>

          <DeleteDialog type="asset" id={asset.id} name={asset.name}>
            <Button variant="ghost" className="w-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10 h-8 text-xs">
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Excluir
            </Button>
          </DeleteDialog>
        </div>

      </div>
    </div>
  );
}
