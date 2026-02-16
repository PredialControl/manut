"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  FileBarChart,
  Loader2,
  Plus,
  Edit,
  Trash2,
  Search,
  FileText,
  Layers,
} from "lucide-react";
import { contratoService, relatorioPendenciasService } from "@/lib/supabaseService";
import type { ContratoRonda, RelatorioPendencias } from "@/types/ronda";

export default function RelatoriosPage() {
  const params = useParams();
  const router = useRouter();
  const contratoId = params.contratoId as string;

  const [contrato, setContrato] = useState<ContratoRonda | null>(null);
  const [relatorios, setRelatorios] = useState<RelatorioPendencias[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<RelatorioPendencias | null>(null);
  const [formTitulo, setFormTitulo] = useState("");

  const loadData = useCallback(async () => {
    try {
      const c = await contratoService.getById(contratoId);
      if (!c) { router.push("/ronda"); return; }
      setContrato(c);
      const r = await relatorioPendenciasService.getByContrato(contratoId);
      setRelatorios(r);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [contratoId, router]);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = relatorios.filter((r) => r.titulo.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSave = async () => {
    if (!formTitulo.trim()) { alert("Preencha o título"); return; }
    try {
      if (editando) {
        await relatorioPendenciasService.update(editando.id, { titulo: formTitulo });
      } else {
        await relatorioPendenciasService.create({ titulo: formTitulo, contrato_id: contratoId });
      }
      setModalOpen(false);
      setEditando(null);
      setLoading(true);
      await loadData();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este relatório?")) return;
    try { await relatorioPendenciasService.delete(id); await loadData(); }
    catch (e) { console.error(e); }
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center min-h-screen bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!contrato) return null;

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 pt-8 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/ronda/${contratoId}`}><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" /> Rondas</Button></Link>
          <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-blue-600" /> Relatórios de Pendências - {contrato.nome}
          </h1>
        </div>
        <Button onClick={() => { setEditando(null); setFormTitulo(""); setModalOpen(true); }} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" /> Novo Relatório
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar relatório..." className="pl-10" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum relatório de pendências encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((r) => (
            <Card key={r.id} className="group relative hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
              <div className="aspect-[2/3] bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 p-4 flex flex-col justify-between">
                <div>
                  <Layers className="w-6 h-6 text-orange-600 mb-3" />
                  <h3 className="font-bold text-foreground text-sm line-clamp-3">{r.titulo}</h3>
                  {r.secoes && <p className="text-xs text-muted-foreground mt-2">{r.secoes.length} seções</p>}
                </div>
                <div className="text-xs text-muted-foreground">
                  {r.created_at && new Date(r.created_at).toLocaleDateString("pt-BR")}
                </div>
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="sm" variant="secondary" onClick={() => { setEditando(r); setFormTitulo(r.titulo); setModalOpen(true); }}><Edit className="w-4 h-4" /></Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(r.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editando ? "Editar Relatório" : "Novo Relatório"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Título *</Label><Input value={formTitulo} onChange={(e) => setFormTitulo(e.target.value)} required /></div>
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
