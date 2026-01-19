"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { DataTable } from "./data-table"
import { columns, PreventiveTaskColumn } from "./columns"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PreventiveListClientProps {
  data: PreventiveTaskColumn[]
}

const statuses = [
  { value: "hoje", label: "Hoje", color: "bg-blue-500" },
  { value: "pendente", label: "Pendente", color: "bg-red-500" },
  { value: "proximas", label: "Próximas", color: "bg-yellow-500" },
  { value: "executadas", label: "Executadas", color: "bg-green-500" },
];

export function PreventiveListClient({ data }: PreventiveListClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentStatus = searchParams.get("status") || "hoje"

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("status", status)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-secondary/30 p-1.5 rounded-xl w-fit border border-border/30">
        {statuses.map((status) => (
          <Button
            key={status.value}
            variant="ghost"
            className={cn(
              "rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-300",
              currentStatus === status.value
                ? "bg-background text-primary shadow-sm ring-1 ring-border/50"
                : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
            )}
            onClick={() => handleStatusChange(status.value)}
          >
            <span className={cn("mr-2 h-2 w-2 rounded-full", status.color, currentStatus === status.value ? "animate-pulse" : "opacity-60")} />
            {status.label}
          </Button>
        ))}
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
} 