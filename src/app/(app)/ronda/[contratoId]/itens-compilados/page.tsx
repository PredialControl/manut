"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Layers,
  Loader2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
} from "lucide-react";
import { contratoService, rondaService } from "@/lib/supabaseService";
import type { ContratoRonda, Ronda, OutroItemCorrigido, FotoRonda } from "@/types/ronda";

interface ItemCompilado {
  id: string;
  rondaId: string;
  rondaNome: string;
  rondaData: string;
  tipo: "chamado" | "foto" | "corrigido";
  nome: string;
  local: string;
  descricao: string;
  status: string;
  prioridade: string;
  especialidade: string;
}

export default function ItensCompiladosPage() {
  const params = useParams();
  const router = useRouter();
  const contratoId = params.contratoId as string;

  const [contrato, setContrato] = useState<ContratoRonda | null>(null);
  const [itens, setItens] = useState<ItemCompilado[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("TODOS");

  const loadData = useCallback(async () => {
    try {
      const c = await contratoService.getById(contratoId);
      if (!c) { router.push("/ronda"); return; }
      setContrato(c);

      const rondas = await rondaService.getByContrato(c.nome);
      const completas = await Promise.all(rondas.map((r) => rondaService.loadCompleteRonda(r)));

      const todosItens: ItemCompilado[] = [];
      completas.forEach((r) => {
        // Fotos de ronda (chamados)
        r.fotosRonda.forEach((f) => {
          todosItens.push({
            id: f.id, rondaId: r.id, rondaNome: r.nome, rondaData: r.data,
            tipo: "foto", nome: f.pendencia || f.local, local: f.local,
            descricao: f.pendencia, status: "PENDENTE", prioridade: f.criticidade || "Média",
            especialidade: f.especialidade,
          });
        });
        // Outros itens
        (r.outrosItensCorrigidos || []).forEach((item) => {
          todosItens.push({
            id: item.id, rondaId: r.id, rondaNome: r.nome, rondaData: r.data,
            tipo: item.categoria === "CORRIGIDO" ? "corrigido" : "chamado",
            nome: item.nome, local: item.local, descricao: item.descricao,
            status: item.status, prioridade: item.prioridade,
            especialidade: item.tipo,
          });
        });
      });

      setItens(todosItens);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [contratoId, router]);

  useEffect(() => { loadData(); }, [loadData]);

  const itensFiltrados = useMemo(() => {
    if (filtroStatus === "TODOS") return itens;
    return itens.filter((i) => i.status === filtroStatus);
  }, [itens, filtroStatus]);

  const metricas = useMemo(() => {
    const total = itens.length;
    const pendentes = itens.filter((i) => i.status === "PENDENTE").length;
    const emAndamento = itens.filter((i) => i.status === "EM ANDAMENTO").length;
    const concluidos = itens.filter((i) => i.status === "CONCLUÍDO").length;
    return { total, pendentes, emAndamento, concluidos };
  }, [itens]);

  if (loading) {
    return <div className="flex-1 flex items-center justify-center min-h-screen bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!contrato) return null;

  const formatarData = (d: string) => { const [a, m, dia] = d.split("-"); return `${dia}/${m}/${a}`; };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 pt-8 bg-background min-h-screen">
      <div className="flex items-center gap-4">
        <Link href={`/ronda/${contratoId}`}><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" /> Rondas</Button></Link>
        <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" /> Itens Compilados - {contrato.nome}
        </h1>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: metricas.total, color: "bg-blue-600" },
          { label: "Pendentes", value: metricas.pendentes, color: "bg-yellow-600" },
          { label: "Em Andamento", value: metricas.emAndamento, color: "bg-blue-500" },
          { label: "Concluídos", value: metricas.concluidos, color: "bg-green-600" },
        ].map((m) => (
          <div key={m.label} className={`text-center p-4 ${m.color} rounded-lg shadow-md`}>
            <div className="text-3xl font-bold text-white">{m.value}</div>
            <div className="text-white/80 text-sm">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Barra de progresso */}
      {metricas.total > 0 && (
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium text-foreground">{Math.round((metricas.concluidos / metricas.total) * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${(metricas.concluidos / metricas.total) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Filtro */}
      <div className="flex gap-2">
        {["TODOS", "PENDENTE", "EM ANDAMENTO", "CONCLUÍDO", "CANCELADO"].map((s) => (
          <Button key={s} variant={filtroStatus === s ? "default" : "outline"} size="sm" onClick={() => setFiltroStatus(s)}>
            {s === "TODOS" ? "Todos" : s === "PENDENTE" ? "Pendentes" : s === "EM ANDAMENTO" ? "Em Andamento" : s === "CONCLUÍDO" ? "Concluídos" : "Cancelados"}
          </Button>
        ))}
      </div>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Ronda</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Data</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Item</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Local</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Tipo</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Prioridade</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {itensFiltrados.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">Nenhum item encontrado.</td></tr>
                ) : (
                  itensFiltrados.map((item) => (
                    <tr key={item.id} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm text-foreground">{item.rondaNome}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{formatarData(item.rondaData)}</td>
                      <td className="py-3 px-4 text-sm font-medium text-foreground">{item.nome}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{item.local}</td>
                      <td className="py-3 px-4"><Badge variant="outline" className="text-xs">{item.especialidade}</Badge></td>
                      <td className="py-3 px-4">
                        <Badge className={`text-xs ${item.prioridade === "ALTA" || item.prioridade === "Alta" ? "bg-red-600 text-white" : item.prioridade === "MÉDIA" || item.prioridade === "Média" ? "bg-yellow-600 text-white" : "bg-green-600 text-white"}`}>
                          {item.prioridade}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`text-xs ${item.status === "CONCLUÍDO" ? "bg-green-600 text-white" : item.status === "EM ANDAMENTO" ? "bg-blue-600 text-white" : item.status === "CANCELADO" ? "bg-red-600 text-white" : "bg-yellow-600 text-white"}`}>
                          {item.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
