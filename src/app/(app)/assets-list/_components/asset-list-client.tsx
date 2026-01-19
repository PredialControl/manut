"use client"

import { useState } from "react"
import { DataTable } from "./data-table"
import { columns, AssetColumn } from "./columns"
import { AssetCard } from "./asset-card"
import { AddAssetDialog } from "./add-asset-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Grid, List } from "lucide-react"
import * as htmlToImage from 'html-to-image';
import JSZip from 'jszip';
import { QrCodeDisplay } from "./qr-code-display"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AddCorrectiveCallForm } from "./add-corrective-call-form"
import { Location, Floor } from "@prisma/client"

interface AssetListClientProps {
  data: AssetColumn[],
  locations: (Location & { floor: Floor })[]
}

export function AssetListClient({ data, locations }: AssetListClientProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [correctiveCallAsset, setCorrectiveCallAsset] = useState<AssetColumn | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");

  const handleBulkDownload = async () => {
    const zip = new JSZip();
    const selectedRows = Object.keys(rowSelection).map(index => data[parseInt(index, 10)]);

    for (const row of selectedRows) {
      if (row.tag) {
        const node = document.getElementById(`qr-code-${row.tag}`);
        if (node) {
          const dataUrl = await htmlToImage.toPng(node);
          const base64Data = dataUrl.split(',')[1];
          zip.file(`${row.tag}.png`, base64Data, { base64: true });
        }
      }
    }

    zip.generateAsync({ type: "blob" }).then(function (content) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = "qrcodes.zip";
      link.click();
    });
  };

  const handleOpenCorrectiveCall = (asset: AssetColumn) => {
    setCorrectiveCallAsset(asset);
  };

  const handleCloseDialog = () => {
    setCorrectiveCallAsset(null);
  };

  const filteredData = data.filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.tag?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.locationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header with Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("cards")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("table")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {Object.keys(rowSelection).length > 0 && viewMode === "table" && (
            <Button onClick={handleBulkDownload}>Baixar QR Codes Selecionados</Button>
          )}
          <AddAssetDialog locations={locations} />
        </div>
      </div>

      {/* Search */}
      {viewMode === "cards" && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome, tag ou localização..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Content */}
      {viewMode === "cards" ? (
        <div className="space-y-4">
          {filteredData.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onOpenCorrectiveCall={handleOpenCorrectiveCall}
            />
          ))}
          {filteredData.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum ativo encontrado
            </div>
          )}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          meta={{
            onOpenCorrectiveCall: handleOpenCorrectiveCall,
          }}
        />
      )}

      <div style={{ position: 'absolute', left: '-9999px' }}>
        {data.map(asset => asset.tag && <QrCodeDisplay key={asset.id} tag={asset.tag} />)}
      </div>

      <Dialog open={!!correctiveCallAsset} onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Abrir Chamado Corretivo</DialogTitle>
          </DialogHeader>
          {correctiveCallAsset && (
            <AddCorrectiveCallForm
              asset={correctiveCallAsset as any}
              onSuccess={handleCloseDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 