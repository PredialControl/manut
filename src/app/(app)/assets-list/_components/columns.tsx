"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DeleteDialog } from "../../assets/_components/delete-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MaintenanceDialog } from "./maintenance-dialog"
import { QrCodeDownloader } from "./qr-code-downloader"

export type AssetColumn = {
  id: string
  name: string
  locationName: string
  floorName: string
  status: string
  tag: string | null
  imageUrl: string | null
  periodicity: string
}



export const columns: ColumnDef<AssetColumn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Nome do Ativo",
  },
  {
    accessorKey: "tag",
    header: "Tag",
  },
  {
    accessorKey: "periodicity",
    header: "Periodicidade",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant = status === "ATIVO" ? "success" : "destructive";
      return <Badge variant={variant}>{status}</Badge>
    }
  },
  {
    accessorKey: "locationName",
    header: "Localidade",
  },
  {
    accessorKey: "floorName",
    header: "Andar",
  },
  {
    id: "actions",
    header: () => <div className="text-center">Ações</div>,
    cell: ({ row, table }) => {
      const asset = row.original

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(asset.id)}
              >
                Copiar ID do Ativo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => (table.options.meta as any)?.onOpenCorrectiveCall(asset)}>
                Abrir Chamado Corretivo
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <MaintenanceDialog tag={asset.tag}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Ver manutenção
                </DropdownMenuItem>
              </MaintenanceDialog>
              <QrCodeDownloader tag={asset.tag}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Baixar QR Code
                </DropdownMenuItem>
              </QrCodeDownloader>
              <DropdownMenuItem
                asChild
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <DeleteDialog type="asset" id={asset.id} name={asset.name}>
                  <div className="w-full text-left">Excluir</div>
                </DeleteDialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
] 