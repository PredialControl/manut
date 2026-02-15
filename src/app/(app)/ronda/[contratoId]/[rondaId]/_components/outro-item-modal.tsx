"use client";

import { useState, useEffect, useRef } from "react";
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
import { AlertTriangle, Upload } from "lucide-react";
import type { OutroItemCorrigido } from "@/types/ronda";

interface OutroItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: OutroItemCorrigido | null;
  categoria: "CHAMADO" | "CORRIGIDO";
  onSave: (item: OutroItemCorrigido) => void;
  contratoRonda: string;
  enderecoRonda: string;
  dataRonda: string;
  horaRonda: string;
}

export function OutroItemModal({
  open,
  onOpenChange,
  item,
  categoria,
  onSave,
  contratoRonda,
  enderecoRonda,
  dataRonda,
  horaRonda,
}: OutroItemModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    local: "",
    tipo: "CIVIL" as OutroItemCorrigido["tipo"],
    prioridade: "MÉDIA" as OutroItemCorrigido["prioridade"],
    status: "PENDENTE" as OutroItemCorrigido["status"],
    foto: null as string | null,
    observacoes: "",
    responsavel: "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        nome: item.nome,
        descricao: item.descricao,
        local: item.local,
        tipo: item.tipo,
        prioridade: item.prioridade,
        status: item.status,
        foto: item.foto,
        observacoes: item.observacoes || "",
        responsavel: item.responsavel || "",
      });
    } else {
      setFormData({
        nome: "",
        descricao: "",
        local: "",
        tipo: "CIVIL",
        prioridade: "MÉDIA",
        status: "PENDENTE",
        foto: null,
        observacoes: "",
        responsavel: "",
      });
    }
  }, [item, open]);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFormData((prev) => ({ ...prev, foto: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.local) {
      alert("Preencha o nome e o local do item");
      return;
    }

    onSave({
      id: item?.id || crypto.randomUUID(),
      nome: formData.nome,
      descricao: formData.descricao,
      local: formData.local,
      tipo: formData.tipo,
      prioridade: formData.prioridade,
      status: formData.status,
      contrato: contratoRonda,
      endereco: enderecoRonda,
      data: dataRonda,
      hora: horaRonda,
      foto: formData.foto,
      fotos: formData.foto ? [formData.foto] : [],
      categoria: categoria,
      observacoes: formData.observacoes,
      responsavel: formData.responsavel,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {item ? "Editar Item" : "Registrar Item"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome *</Label>
            <Input
              value={formData.nome}
              onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
              placeholder="Nome do item"
              required
            />
          </div>

          <div>
            <Label>Local *</Label>
            <Input
              value={formData.local}
              onChange={(e) => setFormData((prev) => ({ ...prev, local: e.target.value }))}
              placeholder="Local do item"
              required
            />
          </div>

          <div>
            <Label>Descrição / Pendência</Label>
            <Textarea
              value={formData.descricao}
              onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))}
              placeholder="Descreva o problema ou pendência"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo *</Label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData((prev) => ({ ...prev, tipo: e.target.value as typeof formData.tipo }))}
                className="w-full p-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary"
              >
                <option value="CIVIL">Civil</option>
                <option value="ELÉTRICA">Elétrica</option>
                <option value="HIDRÁULICA">Hidráulica</option>
                <option value="MECÂNICA">Mecânica</option>
                <option value="CORREÇÃO">Correção</option>
                <option value="MELHORIA">Melhoria</option>
                <option value="MANUTENÇÃO">Manutenção</option>
                <option value="OUTRO">Outro</option>
              </select>
            </div>
            <div>
              <Label>Prioridade *</Label>
              <select
                value={formData.prioridade}
                onChange={(e) => setFormData((prev) => ({ ...prev, prioridade: e.target.value as typeof formData.prioridade }))}
                className="w-full p-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary"
              >
                <option value="BAIXA">Baixa</option>
                <option value="MÉDIA">Média</option>
                <option value="ALTA">Alta</option>
              </select>
            </div>
          </div>

          <div>
            <Label>Status</Label>
            <select
              value={formData.status}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as typeof formData.status }))}
              className="w-full p-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary"
            >
              <option value="PENDENTE">Pendente</option>
              <option value="EM ANDAMENTO">Em Andamento</option>
              <option value="CONCLUÍDO">Concluído</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>

          <div>
            <Label>Responsável</Label>
            <Input
              value={formData.responsavel}
              onChange={(e) => setFormData((prev) => ({ ...prev, responsavel: e.target.value }))}
              placeholder="Responsável pelo item"
            />
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
              placeholder="Observações adicionais"
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
