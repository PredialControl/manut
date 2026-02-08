"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Eye, Wrench } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"

export type TicketColumn = {
  id: string
  number: string
  buildingName: string
  location: string
  description: string
  status: string
  priority: string
  responsible: string
  photoCount: number
  deadline: Date | null
  isRegistered: boolean
  correctiveCallId: string | null
  createdAt: Date
  userName: string
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  itens_apontados: { label: "Itens Apontados", variant: "outline" },
  em_andamento: { label: "Em Andamento", variant: "default" },
  improcedente: { label: "Improcedente", variant: "secondary" },
  aguardando_vistoria: { label: "Ag. Vistoria", variant: "outline" },
  concluido: { label: "Concluído", variant: "secondary" },
  f_indevido: { label: "F. Indevido", variant: "destructive" },
}

const priorityMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  BAIXA: { label: "Baixa", variant: "secondary" },
  MEDIA: { label: "Média", variant: "outline" },
  ALTA: { label: "Alta", variant: "default" },
  URGENTE: { label: "Urgente", variant: "destructive" },
}

export const columns: ColumnDef<TicketColumn>[] = [
  {
    accessorKey: "number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Número
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "buildingName",
    header: "Prédio",
  },
  {
    accessorKey: "location",
    header: "Local",
    cell: ({ row }) => {
      const location = row.getValue("location") as string
      return <div className="max-w-[200px] truncate" title={location}>{location}</div>
    },
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      return <div className="max-w-[300px] truncate" title={description}>{description}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const statusInfo = statusMap[status] || { label: status, variant: "outline" as const }
      return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
    },
  },
  {
    accessorKey: "priority",
    header: "Prioridade",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string
      const priorityInfo = priorityMap[priority] || { label: priority, variant: "outline" as const }
      return <Badge variant={priorityInfo.variant}>{priorityInfo.label}</Badge>
    },
  },
  {
    accessorKey: "responsible",
    header: "Responsável",
  },
  {
    accessorKey: "photoCount",
    header: "Fotos",
    cell: ({ row }) => {
      const count = row.getValue("photoCount") as number
      return count > 0 ? `${count} foto${count > 1 ? 's' : ''}` : "-"
    },
  },
  {
    accessorKey: "isRegistered",
    header: "OMC",
    cell: ({ row }) => {
      const isRegistered = row.getValue("isRegistered") as boolean
      const correctiveCallId = row.original.correctiveCallId

      if (isRegistered && correctiveCallId) {
        return (
          <Link href={`/corrective?id=${correctiveCallId}`}>
            <Badge variant="default" className="cursor-pointer">
              <Wrench className="mr-1 h-3 w-3" />
              Criada
            </Badge>
          </Link>
        )
      }
      return "-"
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Criado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR })
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Link href={`/tickets/${row.original.id}`}>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      )
    },
  },
]
