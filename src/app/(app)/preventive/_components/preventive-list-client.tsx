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
  { value: "hoje", label: "Hoje", color: "text-blue-500", bg: "bg-blue-500" },
  { value: "pendente", label: "Vencidas", color: "text-red-500", bg: "bg-red-500" },
  { value: "proximas", label: "Próximas", color: "text-amber-500", bg: "bg-amber-500" },
  { value: "executadas", label: "Executadas", color: "text-green-500", bg: "bg-green-500" },
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
      <div className="flex items-center justify-between">
        <div className="flex items-center p-1.5 bg-[#0f172a]/60 rounded-full border border-white/5 backdrop-blur-md overflow-x-auto no-scrollbar max-w-full">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => handleStatusChange(status.value)}
              className={cn(
                "flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
                currentStatus === status.value
                  ? "bg-background/80 shadow-md text-foreground ring-1 ring-white/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <div className={cn("h-2.5 w-2.5 rounded-full shadow-sm", status.bg)} />
              {status.label}
            </button>
          ))}
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
} 