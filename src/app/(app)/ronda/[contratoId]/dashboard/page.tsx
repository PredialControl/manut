"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  FileText,
  Users,
  Wrench,
  Loader2,
  Eye,
} from "lucide-react";
import { contratoService, rondaService } from "@/lib/supabaseService";
import type { ContratoRonda, Ronda } from "@/types/ronda";

const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

export default function DashboardRondaPage() {
  const params = useParams();
  const router = useRouter();
  const contratoId = params.contratoId as string;

  const [contrato, setContrato] = useState<ContratoRonda | null>(null);
  const [rondas, setRondas] = useState<Ronda[]>([]);
  const [loading, setLoading] = useState(true);

  const mesAtual = new Date().getMonth();
  const anoAtual = new Date().getFullYear();
  const [mesSelecionado, setMesSelecionado] = useState(mesAtual);
  const [anoSelecionado, setAnoSelecionado] = useState(anoAtual);

  const loadData = useCallback(async () => {
    try {
      const c = await contratoService.getById(contratoId);
      if (!c) { router.push("/ronda"); return; }
      setContrato(c);
      const r = await rondaService.getByContrato(c.nome);
      const completas = await Promise.all(r.map((rd) => rondaService.loadCompleteRonda(rd)));
      setRondas(completas);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [contratoId, router]);

  useEffect(() => { loadData(); }, [loadData]);

  const rondasMes = useMemo(() =>
    rondas.filter((r) => {
      const d = new Date(r.data + "T00:00:00");
      return d.getMonth() === mesSelecionado && d.getFullYear() === anoSelecionado;
    }), [rondas, mesSelecionado, anoSelecionado]);

  const metricas = useMemo(() => {
    const totalVisitas = rondasMes.length;
    let areasAtivas = 0, areasManutencao = 0, areasAtencao = 0, totalChamados = 0, totalCorrigidos = 0;

    rondasMes.forEach((r) => {
      r.areasTecnicas.forEach((a) => {
        if (a.status === "ATIVO") areasAtivas++;
        else if (a.status === "EM MANUTENÇÃO") areasManutencao++;
        else areasAtencao++;
      });
      totalChamados += r.fotosRonda.length;
      totalChamados += (r.outrosItensCorrigidos || []).filter((i) => {
        const s = (i.status || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
        return (i.categoria === "CHAMADO" || !i.categoria) && s !== "CONCLUIDO";
      }).length;
      totalCorrigidos += (r.outrosItensCorrigidos || []).filter((i) => i.status === "CONCLUÍDO").length;
    });

    return { totalVisitas, areasAtivas, areasManutencao, areasAtencao, totalChamados, totalCorrigidos };
  }, [rondasMes]);

  // Últimas áreas de todas as rondas para status atual dos equipamentos
  const equipamentosStatus = useMemo(() => {
    const mapa = new Map<string, { nome: string; status: string; data: string }>();
    rondas.forEach((r) => {
      r.areasTecnicas.forEach((a) => {
        const existing = mapa.get(a.nome);
        if (!existing || a.data > existing.data) {
          mapa.set(a.nome, { nome: a.nome, status: a.status, data: a.data });
        }
      });
    });
    return Array.from(mapa.values()).sort((a, b) => a.nome.localeCompare(b.nome));
  }, [rondas]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Carregando dashboard...</span>
      </div>
    );
  }

  if (!contrato) return null;

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 pt-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/ronda/${contratoId}`}>
            <Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" /> Rondas</Button>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" /> Dashboard - {contrato.nome}
          </h1>
        </div>
        <div className="flex gap-2">
          <Select value={mesSelecionado.toString()} onValueChange={(v) => setMesSelecionado(parseInt(v))}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>{MESES.map((m, i) => <SelectItem key={i} value={i.toString()}>{m}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={anoSelecionado.toString()} onValueChange={(v) => setAnoSelecionado(parseInt(v))}>
            <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
            <SelectContent>{[anoAtual - 1, anoAtual, anoAtual + 1].map((a) => <SelectItem key={a} value={a.toString()}>{a}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Visitas no Mês", value: metricas.totalVisitas, color: "text-blue-600", bg: "bg-blue-600" },
          { label: "Áreas Ativas", value: metricas.areasAtivas, color: "text-green-600", bg: "bg-green-600" },
          { label: "Em Manutenção", value: metricas.areasManutencao, color: "text-yellow-600", bg: "bg-yellow-600" },
          { label: "Em Atenção", value: metricas.areasAtencao, color: "text-red-600", bg: "bg-red-600" },
          { label: "Chamados Abertos", value: metricas.totalChamados, color: "text-orange-600", bg: "bg-orange-600" },
          { label: "Itens Corrigidos", value: metricas.totalCorrigidos, color: "text-emerald-600", bg: "bg-emerald-600" },
        ].map((m) => (
          <div key={m.label} className={`text-center p-4 ${m.bg} rounded-lg shadow-md`}>
            <div className="text-3xl font-bold text-white mb-1">{m.value}</div>
            <div className="text-white/80 font-medium text-xs">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Visitas do Mês */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" /> Visitas em {MESES[mesSelecionado]} {anoSelecionado}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rondasMes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma visita registrada neste mês.</p>
          ) : (
            <div className="space-y-3">
              {rondasMes.map((r) => {
                const [ano, mes, dia] = r.data.split("-");
                return (
                  <div key={r.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Badge className={r.tipoVisita === "RONDA" ? "bg-blue-600 text-white" : r.tipoVisita === "REUNIAO" ? "bg-green-600 text-white" : "bg-purple-600 text-white"}>
                        {r.tipoVisita === "REUNIAO" ? "Reunião" : r.tipoVisita === "OUTROS" ? "Outros" : "Ronda"}
                      </Badge>
                      <div>
                        <span className="font-medium text-foreground">{r.nome}</span>
                        <span className="text-sm text-muted-foreground ml-2">{dia}/{mes}/{ano} - {r.hora}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">{r.areasTecnicas.length} áreas</span>
                      <span className="text-muted-foreground">{r.fotosRonda.length + (r.outrosItensCorrigidos?.length || 0)} itens</span>
                      <Link href={`/ronda/${contratoId}/${r.id}`}>
                        <Button variant="outline" size="sm"><Eye className="w-4 h-4" /></Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status dos Equipamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-green-600" /> Status Atual dos Equipamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {equipamentosStatus.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum equipamento registrado.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {equipamentosStatus.map((eq) => (
                <div key={eq.nome} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <span className="font-medium text-foreground text-sm">{eq.nome}</span>
                  <Badge className={
                    eq.status === "ATIVO" ? "bg-green-600 text-white" :
                    eq.status === "EM MANUTENÇÃO" ? "bg-yellow-600 text-white" :
                    "bg-red-600 text-white"
                  }>
                    {eq.status === "ATIVO" ? "Ativo" : eq.status === "EM MANUTENÇÃO" ? "Manutenção" : "Atenção"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
