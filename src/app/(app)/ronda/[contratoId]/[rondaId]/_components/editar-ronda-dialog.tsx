"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Calendar, Clock, User } from "lucide-react";
import type { Ronda } from "@/types/ronda";

interface EditarRondaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ronda: Ronda;
  onSave: (updates: Partial<Ronda>) => void;
}

export function EditarRondaDialog({ open, onOpenChange, ronda, onSave }: EditarRondaDialogProps) {
  const [formData, setFormData] = useState({
    nome: "",
    tipoVisita: "RONDA" as "RONDA" | "REUNIAO" | "OUTROS",
    data: "",
    hora: "",
    responsavel: "",
    observacoesGerais: "",
  });

  useEffect(() => {
    if (ronda && open) {
      setFormData({
        nome: ronda.nome,
        tipoVisita: ronda.tipoVisita || "RONDA",
        data: ronda.data,
        hora: ronda.hora,
        responsavel: ronda.responsavel || "",
        observacoesGerais: ronda.observacoesGerais || "",
      });
    }
  }, [ronda, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Editar Ronda
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de Visita */}
          <div>
            <Label className="mb-2 block">Tipo de Visita</Label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: "RONDA", label: "Ronda" },
                { value: "REUNIAO", label: "Reunião" },
                { value: "OUTROS", label: "Outros" },
              ] as const).map((tipo) => (
                <button
                  key={tipo.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, tipoVisita: tipo.value }))}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    formData.tipoVisita === tipo.value
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {tipo.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" value={formData.nome} onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data" className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Data</Label>
              <Input id="data" type="date" value={formData.data} onChange={(e) => setFormData((prev) => ({ ...prev, data: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="hora" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Hora</Label>
              <Input id="hora" type="time" value={formData.hora} onChange={(e) => setFormData((prev) => ({ ...prev, hora: e.target.value }))} />
            </div>
          </div>

          <div>
            <Label htmlFor="responsavel" className="flex items-center gap-1"><User className="w-3 h-3" /> Responsável</Label>
            <Input id="responsavel" value={formData.responsavel} onChange={(e) => setFormData((prev) => ({ ...prev, responsavel: e.target.value }))} />
          </div>

          <div>
            <Label htmlFor="obs">Observações Gerais</Label>
            <Input id="obs" value={formData.observacoesGerais} onChange={(e) => setFormData((prev) => ({ ...prev, observacoesGerais: e.target.value }))} />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" className="flex-1">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
