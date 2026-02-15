"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock, User, FileText } from "lucide-react";

interface NovaRondaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contratoNome: string;
  onSave: (data: {
    nome: string;
    tipoVisita: "RONDA" | "REUNIAO" | "OUTROS";
    data: string;
    hora: string;
    responsavel: string;
    observacoesGerais: string;
  }) => void;
}

export function NovaRondaDialog({ open, onOpenChange, contratoNome, onSave }: NovaRondaDialogProps) {
  const [formData, setFormData] = useState({
    nome: "VISITA TÉCNICA",
    tipoVisita: "RONDA" as "RONDA" | "REUNIAO" | "OUTROS",
    data: new Date().toISOString().split("T")[0],
    hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    responsavel: "",
    observacoesGerais: "",
  });

  const handleTipoChange = (tipo: "RONDA" | "REUNIAO" | "OUTROS") => {
    let novoNome = "";
    if (tipo === "RONDA") novoNome = "VISITA TÉCNICA";
    else if (tipo === "REUNIAO") novoNome = "REUNIÃO DE ALINHAMENTO";
    else novoNome = "";
    setFormData((prev) => ({ ...prev, tipoVisita: tipo, nome: novoNome }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome) {
      alert("Por favor, preencha o nome da ronda");
      return;
    }
    onSave(formData);
    // Reset
    setFormData({
      nome: "VISITA TÉCNICA",
      tipoVisita: "RONDA",
      data: new Date().toISOString().split("T")[0],
      hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      responsavel: "",
      observacoesGerais: "",
    });
  };

  const tipoLabel =
    formData.tipoVisita === "REUNIAO" ? "Reunião" :
    formData.tipoVisita === "OUTROS" ? "Registro" : "Ronda";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Nova {tipoLabel}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de Visita */}
          <div>
            <Label className="mb-2 block">Tipo de Visita *</Label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: "RONDA", label: "Ronda" },
                { value: "REUNIAO", label: "Reunião" },
                { value: "OUTROS", label: "Outros" },
              ] as const).map((tipo) => (
                <button
                  key={tipo.value}
                  type="button"
                  onClick={() => handleTipoChange(tipo.value)}
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

          {/* Nome */}
          <div>
            <Label htmlFor="nome">
              Nome da {tipoLabel} *
            </Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
              placeholder={
                formData.tipoVisita === "REUNIAO"
                  ? "Ex: Reunião com Síndico"
                  : formData.tipoVisita === "OUTROS"
                  ? "Ex: Vistoria Pontual"
                  : "Ex: Ronda Matutina"
              }
              required
            />
          </div>

          {/* Contrato (read-only) */}
          <div>
            <Label>Contrato</Label>
            <Input value={contratoNome} readOnly className="bg-muted" />
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data" className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Data *
              </Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData((prev) => ({ ...prev, data: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="hora" className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> Hora *
              </Label>
              <Input
                id="hora"
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData((prev) => ({ ...prev, hora: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Responsável */}
          <div>
            <Label htmlFor="responsavel" className="flex items-center gap-1">
              <User className="w-3 h-3" /> Responsável
            </Label>
            <Input
              id="responsavel"
              value={formData.responsavel}
              onChange={(e) => setFormData((prev) => ({ ...prev, responsavel: e.target.value }))}
              placeholder="Nome do responsável"
            />
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="obs">
              {formData.tipoVisita === "REUNIAO"
                ? "Resumo da Reunião"
                : formData.tipoVisita === "OUTROS"
                ? "Descrição da Atividade"
                : "Observações Gerais"}
            </Label>
            {formData.tipoVisita !== "RONDA" ? (
              <Textarea
                id="obs"
                value={formData.observacoesGerais}
                onChange={(e) => setFormData((prev) => ({ ...prev, observacoesGerais: e.target.value }))}
                placeholder={
                  formData.tipoVisita === "REUNIAO"
                    ? "Descreva o que foi discutido..."
                    : "Descreva a atividade realizada..."
                }
                rows={4}
              />
            ) : (
              <Input
                id="obs"
                value={formData.observacoesGerais}
                onChange={(e) => setFormData((prev) => ({ ...prev, observacoesGerais: e.target.value }))}
                placeholder="Observações sobre a ronda"
              />
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Criar {tipoLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
