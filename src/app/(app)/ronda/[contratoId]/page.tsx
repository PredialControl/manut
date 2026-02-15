"use client";

import { useState, useEffect, useCallback } from "react";
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
  FileText,
  Plus,
  Eye,
  Trash2,
  Calendar,
  Users,
  CheckCircle,
  AlertTriangle,
  Filter,
  Loader2,
} from "lucide-react";
import { contratoService, rondaService } from "@/lib/supabaseService";
import type { ContratoRonda, Ronda } from "@/types/ronda";
import { NovaRondaDialog } from "./_components/nova-ronda-dialog";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const formatarData = (data: string) => {
  const [ano, mes, dia] = data.split("-");
  if (ano && mes && dia) {
    return `${dia.padStart(2, "0")}/${mes.padStart(2, "0")}/${ano}`;
  }
  return data;
};

const calcularEstatisticas = (ronda: Ronda) => {
  const total = ronda.areasTecnicas.length;
  const ativos = ronda.areasTecnicas.filter((at) => at.status === "ATIVO").length;
  const manutencao = ronda.areasTecnicas.filter((at) => at.status === "EM MANUTENÇÃO").length;

  const itensChamado = (ronda.outrosItensCorrigidos || []).filter((item) => {
    const statusNorm = (item.status || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    const isItemChamado =
      item.categoria === "CHAMADO" ||
      (item.categoria === undefined && statusNorm !== "CONCLUIDO") ||
      (item.categoria === null && statusNorm !== "CONCLUIDO");
    return isItemChamado && statusNorm !== "CONCLUIDO";
  }).length;

  const fotosRondaChamados = ronda.fotosRonda.length;
  const totalItensChamado = itensChamado + fotosRondaChamados;
  const itensAtencao = manutencao + totalItensChamado;

  return { total, ativos, manutencao, itensChamado: totalItensChamado, itensAtencao };
};

export default function ContratoRondaPage() {
  const params = useParams();
  const router = useRouter();
  const contratoId = params.contratoId as string;

  const [contrato, setContrato] = useState<ContratoRonda | null>(null);
  const [rondas, setRondas] = useState<Ronda[]>([]);
  const [loading, setLoading] = useState(true);
  const [novaRondaOpen, setNovaRondaOpen] = useState(false);

  const mesAtual = new Date().getMonth();
  const anoAtual = new Date().getFullYear();
  const [mesSelecionado, setMesSelecionado] = useState(mesAtual);
  const [anoSelecionado, setAnoSelecionado] = useState(anoAtual);

  const anosDisponiveis = [anoAtual - 2, anoAtual - 1, anoAtual, anoAtual + 1];

  const loadData = useCallback(async () => {
    try {
      const contratoData = await contratoService.getById(contratoId);
      if (!contratoData) {
        router.push("/ronda");
        return;
      }
      setContrato(contratoData);

      const rondasData = await rondaService.getByContrato(contratoData.nome);
      // Load complete data for each ronda
      const rondasCompletas = await Promise.all(
        rondasData.map((r) => rondaService.loadCompleteRonda(r))
      );
      setRondas(rondasCompletas);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }, [contratoId, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const rondasFiltradas = rondas.filter((ronda) => {
    const dataRonda = new Date(ronda.data + "T00:00:00");
    return dataRonda.getMonth() === mesSelecionado && dataRonda.getFullYear() === anoSelecionado;
  });

  const handleNovaRonda = async (rondaData: {
    nome: string;
    tipoVisita: "RONDA" | "REUNIAO" | "OUTROS";
    data: string;
    hora: string;
    responsavel: string;
    observacoesGerais: string;
  }) => {
    if (!contrato) return;
    try {
      await rondaService.create({
        ...rondaData,
        contrato: contrato.nome,
      });
      setNovaRondaOpen(false);
      setLoading(true);
      await loadData();
    } catch (error) {
      console.error("Erro ao criar ronda:", error);
    }
  };

  const handleDeletarRonda = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta ronda?\n\nEsta ação não pode ser desfeita.")) return;
    try {
      await rondaService.delete(id);
      setRondas((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Erro ao deletar ronda:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-muted-foreground">Carregando rondas...</span>
        </div>
      </div>
    );
  }

  if (!contrato) return null;

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 pt-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/ronda">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-foreground truncate flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
            {contrato.nome}
          </h1>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button onClick={() => setNovaRondaOpen(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" /> Nova Ronda
          </Button>
        </div>
      </div>

      {/* Filtro Mês/Ano */}
      <div className="flex items-center gap-2 bg-card rounded-lg shadow-sm p-3 border border-border/50 animate-in fade-in duration-700">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground font-medium">Filtrar:</span>
        <Select value={mesSelecionado.toString()} onValueChange={(v) => setMesSelecionado(parseInt(v))}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent>
            {MESES.map((mes, index) => (
              <SelectItem key={index} value={index.toString()}>{mes}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={anoSelecionado.toString()} onValueChange={(v) => setAnoSelecionado(parseInt(v))}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            {anosDisponiveis.map((ano) => (
              <SelectItem key={ano} value={ano.toString()}>{ano}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabela de Rondas */}
      <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">Tipo</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />Data</div>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">
                    <div className="flex items-center gap-2"><Users className="w-4 h-4" />Responsável</div>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4" />Áreas</div>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" />Ativos</div>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">
                    <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-600" />Manutenção</div>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">
                    <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-orange-600" />Chamados</div>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">
                    <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-600" />Atenção</div>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">Ações</th>
                </tr>
              </thead>
              <tbody>
                {rondasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12">
                      <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground text-base mb-2">
                        {rondas.length === 0
                          ? "Nenhuma ronda realizada ainda para este contrato."
                          : `Nenhuma ronda encontrada para ${MESES[mesSelecionado]} de ${anoSelecionado}.`}
                      </p>
                      {rondas.length === 0 && (
                        <p className="text-muted-foreground text-sm">
                          Crie sua primeira ronda para começar a documentar as verificações técnicas.
                        </p>
                      )}
                    </td>
                  </tr>
                ) : (
                  rondasFiltradas.map((ronda) => {
                    const stats = calcularEstatisticas(ronda);
                    const tipoVisita = ronda.tipoVisita || "RONDA";
                    const tipoConfig: Record<string, { label: string; color: string }> = {
                      RONDA: { label: "Ronda", color: "text-blue-600" },
                      REUNIAO: { label: "Reunião", color: "text-green-600" },
                      OUTROS: { label: "Outros", color: "text-purple-600" },
                    };
                    const config = tipoConfig[tipoVisita] || tipoConfig.RONDA;

                    return (
                      <tr key={ronda.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">
                          <span className={`text-sm font-bold ${config.color}`}>{config.label}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-foreground">{formatarData(ronda.data)}</div>
                          <div className="text-sm text-muted-foreground">{ronda.hora}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-foreground">{ronda.responsavel || "—"}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="font-mono">{stats.total}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-green-600 text-white font-mono">{stats.ativos}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-yellow-600 text-white font-mono">{stats.manutencao}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-orange-600 text-white font-mono">{stats.itensChamado}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-red-600 text-white font-mono">{stats.itensAtencao}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Link href={`/ronda/${contratoId}/${ronda.id}`}>
                              <Button variant="outline" size="sm" className="h-8 px-3 text-blue-600 border-blue-200 hover:bg-blue-50">
                                <Eye className="w-4 h-4 mr-1" /> Ver
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeletarRonda(ronda.id)}
                              className="h-8 px-3 text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Excluir
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Resumo */}
          <div className="p-4 border-t border-border">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{rondas.length}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {rondas.reduce((t, r) => t + r.areasTecnicas.length, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Áreas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {rondas.reduce((t, r) => t + r.areasTecnicas.filter((a) => a.status === "ATIVO").length, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Ativos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {rondas.reduce((t, r) => t + r.areasTecnicas.filter((a) => a.status === "EM MANUTENÇÃO").length, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Manutenção</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {rondas.reduce((t, r) => {
                    const itens = (r.outrosItensCorrigidos || []).filter((item) => {
                      const s = (item.status || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
                      return (item.categoria === "CHAMADO" || (!item.categoria && s !== "CONCLUIDO")) && s !== "CONCLUIDO";
                    }).length;
                    return t + itens + r.fotosRonda.length;
                  }, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Chamados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {rondas.reduce((t, r) => {
                    const m = r.areasTecnicas.filter((a) => a.status === "EM MANUTENÇÃO").length;
                    const itens = (r.outrosItensCorrigidos || []).filter((item) => {
                      const s = (item.status || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
                      return (item.categoria === "CHAMADO" || (!item.categoria && s !== "CONCLUIDO")) && s !== "CONCLUIDO";
                    }).length;
                    return t + m + itens + r.fotosRonda.length;
                  }, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Atenção</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Nova Ronda */}
      <NovaRondaDialog
        open={novaRondaOpen}
        onOpenChange={setNovaRondaOpen}
        contratoNome={contrato.nome}
        onSave={handleNovaRonda}
      />
    </div>
  );
}
