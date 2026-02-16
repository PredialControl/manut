"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  FileCheck,
  Loader2,
  Plus,
  Edit,
  Trash2,
  Search,
  FileText,
} from "lucide-react";
import { contratoService, parecerService } from "@/lib/supabaseService";
import type { ContratoRonda, ParecerTecnico } from "@/types/ronda";

export default function ParecerPage() {
  const params = useParams();
  const router = useRouter();
  const contratoId = params.contratoId as string;

  const [contrato, setContrato] = useState<ContratoRonda | null>(null);
  const [pareceres, setPareceres] = useState<ParecerTecnico[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<ParecerTecnico | null>(null);

  const [formData, setFormData] = useState({
    titulo: "",
    finalidade: "",
    narrativa_cenario: "",
    status: "NAO_EXECUTADO" as "EXECUTADO" | "NAO_EXECUTADO",
  });

  const loadData = useCallback(async () => {
    try {
      const c = await contratoService.getById(contratoId);
      if (!c) { router.push("/ronda"); return; }
      setContrato(c);
      const p = await parecerService.getByContrato(contratoId);
      setPareceres(p);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [contratoId, router]);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = pareceres.filter((p) =>
    p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.finalidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async () => {
    try {
      if (editando) {
        await parecerService.update(editando.id, { ...formData, contrato_id: contratoId });
      } else {
        await parecerService.create({ ...formData, contrato_id: contratoId });
      }
      setModalOpen(false);
      setEditando(null);
      setLoading(true);
      await loadData();
    } catch (e) { console.error(e); alert("Erro ao salvar parecer"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este parecer técnico?")) return;
    try { await parecerService.delete(id); await loadData(); }
    catch (e) { console.error(e); }
  };

  const openNew = () => {
    setEditando(null);
    setFormData({ titulo: "", finalidade: "", narrativa_cenario: "", status: "NAO_EXECUTADO" });
    setModalOpen(true);
  };

  const openEdit = (p: ParecerTecnico) => {
    setEditando(p);
    setFormData({ titulo: p.titulo, finalidade: p.finalidade, narrativa_cenario: p.narrativa_cenario, status: p.status || "NAO_EXECUTADO" });
    setModalOpen(true);
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
            <FileCheck className="w-5 h-5 text-blue-600" /> Parecer Técnico - {contrato.nome}
          </h1>
        </div>
        <Button onClick={openNew} className="bg-green-600 hover:bg-green-700"><Plus className="w-4 h-4 mr-2" /> Novo Parecer</Button>
      </div>

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar parecer..." className="pl-10" />
      </div>

      {/* Grid de Pareceres */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum parecer técnico encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((p) => (
            <Card key={p.id} className="group relative hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
              <div className="aspect-[2/3] bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 flex flex-col justify-between">
                <div>
                  <div className={`w-3 h-3 rounded-full mb-3 ${p.status === "EXECUTADO" ? "bg-green-500" : "bg-red-500"}`} />
                  <h3 className="font-bold text-foreground text-sm line-clamp-3">{p.titulo}</h3>
                  {p.finalidade && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{p.finalidade}</p>}
                </div>
                <div className="text-xs text-muted-foreground">
                  {p.created_at && new Date(p.created_at).toLocaleDateString("pt-BR")}
                </div>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="sm" variant="secondary" onClick={() => openEdit(p)}><Edit className="w-4 h-4" /></Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editando ? "Editar Parecer" : "Novo Parecer Técnico"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Título *</Label><Input value={formData.titulo} onChange={(e) => setFormData((p) => ({ ...p, titulo: e.target.value }))} required /></div>
            <div><Label>Finalidade</Label><Textarea value={formData.finalidade} onChange={(e) => setFormData((p) => ({ ...p, finalidade: e.target.value }))} rows={3} /></div>
            <div><Label>Narrativa do Cenário</Label><Textarea value={formData.narrativa_cenario} onChange={(e) => setFormData((p) => ({ ...p, narrativa_cenario: e.target.value }))} rows={5} /></div>
            <div>
              <Label>Status</Label>
              <select value={formData.status} onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value as typeof formData.status }))} className="w-full p-2 border border-border rounded-md bg-background text-foreground">
                <option value="NAO_EXECUTADO">Não Executado</option>
                <option value="EXECUTADO">Executado</option>
              </select>
            </div>
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
