"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MaintenanceInfo, maintenanceData } from "@/lib/maintenance-data"
import { ReactNode, useMemo } from "react"

interface MaintenanceDialogProps {
  tag: string | null
  children: ReactNode
}

export function MaintenanceDialog({ tag, children }: MaintenanceDialogProps) {
  const maintenanceInfo: MaintenanceInfo | null = useMemo(() => {
    if (!tag) return null
    const prefix = tag.split('-')[0];
    return maintenanceData[prefix] || null
  }, [tag])

  if (!maintenanceInfo) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Informações de Manutenção</DialogTitle>
          </DialogHeader>
          <p>Não há informações de manutenção para este ativo.</p>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{maintenanceInfo.description}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p><strong>Categoria:</strong> {maintenanceInfo.category}</p>
          <div>
            <h4 className="font-semibold">Manutenção Recomendada:</h4>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              {maintenanceInfo.tasks.map((task, index) => (
                <li key={index}>
                  <strong>{task.periodicity}:</strong> {task.details}
                  {task.isSpecialized && (
                    <span className="ml-2 text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Requer Empresa Especializada
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 