"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Award,
  Loader2,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar,
} from "lucide-react";
import { contratoService, laudoService } from "@/lib/supabaseService";
import type { ContratoRonda, Laudo } from "@/types/ronda";

const COLUNAS = [
  { id: "em-dia", label: "Em Dia", color: "bg-green-500", icon: CheckCircle },
  { id: "proximo-vencimento", label: "Próximo ao Vencimento", color: "bg-yellow-500", icon: AlertTriangle },
  { id: "vencidos", label: "Vencidos", color: "bg-red-500", icon: XCircle },
];

export default function LaudosPage() {
  const params = useParams();
  const router = useRouter();
  const contratoId = params.contratoId as string;

  const [contrato, setContrato] = useState<ContratoRonda | null>(null);
  const [laudos, setLaudos] = useState<Laudo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Laudo | null>(null);

  const [formData, setFormData] = useState({
    titulo: "",
    status: "em-dia" as Laudo["status"],
    data_vencimento: "",
    data_emissao: "",
    periodicidade: "Anual",
    observacoes: "",
  });

  const loadData = useCallback(async () => {
    try {
      const c = await contratoService.getById(contratoId);
      if (!c) { router.push("/ronda"); return; }
      setContrato(c);
      const l = await laudoService.getByContrato(contratoId);
      setLaudos(l);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [contratoId, router]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async () => {
    try {
      if (editando) {
        await laudoService.update(editando.id, { ...formData, contrato_id: contratoId });
      } else {
        await laudoService.create({ ...formData, contrato_id: contratoId });
      }
      setModalOpen(false);
      setEditando(null);
      setLoading(true);
      await loadData();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este laudo?")) return;
    try { await laudoService.delete(id); await loadData(); }
    catch (e) { console.error(e); }
  };

  const openNew = () => {
    setEditando(null);
    setFormData({ titulo: "", status: "em-dia", data_vencimento: "", data_emissao: "", periodicidade: "Anual", observacoes: "" });
    setModalOpen(true);
  };

  const openEdit = (l: Laudo) => {
    setEditando(l);
    setFormData({
      titulo: l.titulo,
      status: l.status,
      data_vencimento: l.data_vencimento || "",
      data_emissao: l.data_emissao || "",
      periodicidade: l.periodicidade || "Anual",
      observacoes: l.observacoes || "",
    });
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!contrato) return null;

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 pt-8 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/ronda/${contratoId}`}>
            <Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" /> Rondas</Button>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" /> Laudos - {contrato.nome}
          </h1>
        </div>
        <Button onClick={openNew} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" /> Novo Laudo
        </Button>
      </div>

      {/* Kanban de Laudos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUNAS.map((coluna) => {
          const laudosFiltrados = laudos.filter((l) => l.status === coluna.id);
          const Icon = coluna.icon;
          return (
            <div key={coluna.id} className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <div className={`w-3 h-3 rounded-full ${coluna.color}`} />
                <Icon className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">{coluna.label}</h3>
                <Badge variant="outline" className="ml-auto">{laudosFiltrados.length}</Badge>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {laudosFiltrados.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">Nenhum laudo</p>
                ) : (
                  laudosFiltrados.map((laudo) => (
                    <Card key={laudo.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <span className="font-medium text-sm text-foreground">{laudo.titulo}</span>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(laudo)}>
                              <Edit className="w-3 h-3 text-blue-600" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleDelete(laudo.id)}>
                              <Trash2 className="w-3 h-3 text-red-600" />
                            </Button>
                          </div>
                        </div>
                        {laudo.periodicidade && <Badge variant="outline" className="text-xs">{laudo.periodicidade}</Badge>}
                        {laudo.data_vencimento && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" /> Venc: {laudo.data_vencimento}
                          </div>
                        )}
                        {laudo.observacoes && <p className="text-xs text-muted-foreground line-clamp-2">{laudo.observacoes}</p>}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editando ? "Editar Laudo" : "Novo Laudo"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Título *</Label><Input value={formData.titulo} onChange={(e) => setFormData((p) => ({ ...p, titulo: e.target.value }))} required /></div>
            <div>
              <Label>Status</Label>
              <select value={formData.status} onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value as Laudo["status"] }))} className="w-full p-2 border border-border rounded-md bg-background text-foreground">
                <option value="em-dia">Em Dia</option>
                <option value="proximo-vencimento">Próximo ao Vencimento</option>
                <option value="vencidos">Vencido</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Data Emissão</Label><Input type="date" value={formData.data_emissao} onChange={(e) => setFormData((p) => ({ ...p, data_emissao: e.target.value }))} /></div>
              <div><Label>Data Vencimento</Label><Input type="date" value={formData.data_vencimento} onChange={(e) => setFormData((p) => ({ ...p, data_vencimento: e.target.value }))} /></div>
            </div>
            <div>
              <Label>Periodicidade</Label>
              <select value={formData.periodicidade} onChange={(e) => setFormData((p) => ({ ...p, periodicidade: e.target.value }))} className="w-full p-2 border border-border rounded-md bg-background text-foreground">
                <option value="Anual">Anual</option>
                <option value="Bimestral">Bimestral</option>
                <option value="Trimestral">Trimestral</option>
                <option value="Semestral">Semestral</option>
                <option value="Mensal">Mensal</option>
              </select>
            </div>
            <div><Label>Observações</Label><Input value={formData.observacoes} onChange={(e) => setFormData((p) => ({ ...p, observacoes: e.target.value }))} /></div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancelar</Button>
              <Button onClick={handleSave} className="flex-1">Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
