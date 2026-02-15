"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, Upload, Wrench } from "lucide-react";
import type { AreaTecnica } from "@/types/ronda";

const AREAS_TECNICAS_PREDEFINIDAS = [
  "Bombas de Recalque",
  "Bombas de Incêndio",
  "Bombas de Esgoto / Drenagem",
  "Quadro Elétrico Geral",
  "Gerador",
  "Elevadores",
  "Portões Automáticos",
  "Sistema de CFTV",
  "Sistema de Interfonia",
  "Para-raios / SPDA",
  "Iluminação de Emergência",
  "Hidrantes e Extintores",
  "Reservatórios de Água",
  "Casa de Máquinas",
  "Cobertura / Telhado",
  "Fachada",
  "Playground / Área de Lazer",
  "Piscina",
  "Academia",
  "Salão de Festas",
  "Garagem",
  "Jardim / Paisagismo",
];

interface AreaTecnicaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  area: AreaTecnica | null;
  onSave: (area: AreaTecnica) => void;
  contratoRonda: string;
  enderecoRonda: string;
  dataRonda: string;
  horaRonda: string;
}

export function AreaTecnicaModal({
  open,
  onOpenChange,
  area,
  onSave,
  contratoRonda,
  enderecoRonda,
  dataRonda,
  horaRonda,
}: AreaTecnicaModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nome: "",
    status: "ATIVO" as "ATIVO" | "EM MANUTENÇÃO" | "ATENÇÃO",
    testeStatus: "TESTADO" as "TESTADO" | "NAO_TESTADO",
    foto: null as string | null,
    observacoes: "",
  });

  useEffect(() => {
    if (area) {
      setFormData({
        nome: area.nome,
        status: area.status,
        testeStatus: area.testeStatus || "TESTADO",
        foto: area.foto,
        observacoes: area.observacoes || "",
      });
    } else {
      setFormData({ nome: "", status: "ATIVO", testeStatus: "TESTADO", foto: null, observacoes: "" });
    }
  }, [area, open]);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFormData((prev) => ({ ...prev, foto: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome) { alert("Selecione a área técnica"); return; }

    onSave({
      id: area?.id || crypto.randomUUID(),
      nome: formData.nome,
      status: formData.status,
      testeStatus: formData.testeStatus,
      contrato: contratoRonda,
      endereco: enderecoRonda,
      data: dataRonda,
      hora: horaRonda,
      foto: formData.foto,
      observacoes: formData.observacoes,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            {area ? "Editar Área Técnica" : "Adicionar Área Técnica"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Área Técnica *</Label>
            <select
              value={formData.nome}
              onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
              className="w-full p-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Selecione a área técnica</option>
              {AREAS_TECNICAS_PREDEFINIDAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <Label>Status *</Label>
            <select
              value={formData.status}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as typeof formData.status }))}
              className="w-full p-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary"
            >
              <option value="ATIVO">Ativo</option>
              <option value="EM MANUTENÇÃO">Em Manutenção</option>
              <option value="ATENÇÃO">Atenção</option>
            </select>
          </div>

          <div>
            <Label>Teste de Funcionamento *</Label>
            <select
              value={formData.testeStatus}
              onChange={(e) => setFormData((prev) => ({ ...prev, testeStatus: e.target.value as typeof formData.testeStatus }))}
              className="w-full p-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary"
            >
              <option value="TESTADO">Feito teste de funcionamento do ativo</option>
              <option value="NAO_TESTADO">Não foi possível realizar o teste</option>
            </select>
          </div>

          <div>
            <Label>Foto</Label>
            <div className="space-y-2">
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                <Upload className="w-4 h-4 mr-2" /> Selecionar Foto
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
              {formData.foto && (
                <div className="mt-2">
                  <img src={formData.foto} alt="Preview" className="w-full h-32 object-cover rounded-lg border" />
                  <Button type="button" variant="outline" size="sm" onClick={() => setFormData((prev) => ({ ...prev, foto: null }))} className="w-full mt-2 text-red-600">
                    Remover Foto
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label>Observações</Label>
            <Input
              value={formData.observacoes}
              onChange={(e) => setFormData((prev) => ({ ...prev, observacoes: e.target.value }))}
              placeholder="Observações sobre a área técnica"
            />
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
