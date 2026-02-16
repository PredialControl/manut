"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  FileText,
  AlertTriangle,
  Edit,
  Plus,
  Trash2,
  Wrench,
  BarChart3,
  AlertCircle,
  Info,
  CheckCircle,
  Save,
  X,
  Camera,
  Loader2,
  Users,
  Download,
} from "lucide-react";
import {
  contratoService,
  rondaService,
  areaTecnicaService,
  fotoRondaService,
  outroItemService,
} from "@/lib/supabaseService";
import type { ContratoRonda, Ronda, AreaTecnica, FotoRonda, OutroItemCorrigido, SecaoRonda } from "@/types/ronda";
import { AreaTecnicaModal } from "./_components/area-tecnica-modal";
import { OutroItemModal } from "./_components/outro-item-modal";
import { EditarRondaDialog } from "./_components/editar-ronda-dialog";
import { downloadRelatorioPDF } from "@/lib/pdfReact";

const NUMEROS_ROMANOS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];

const SECOES_PADRAO: SecaoRonda[] = [
  {
    id: "objetivo-default",
    ordem: 1,
    titulo: "Objetivo do Relatório de Status de Equipamentos e Áreas Comuns",
    conteudo:
      "O presente relatório tem como finalidade apresentar de forma clara, técnica e organizada o status atual dos equipamentos e das áreas comuns do empreendimento. Seu intuito é fornecer uma visão consolidada das condições operacionais, de conservação e de segurança de cada sistema inspecionado, permitindo identificar pendências, riscos potenciais e necessidades de manutenção preventiva ou corretiva.\n\nAlém de registrar as constatações verificadas durante a vistoria, este relatório busca auxiliar a gestão predial no planejamento das ações necessárias, apoiando a tomada de decisão e garantindo maior controle sobre o desempenho e a vida útil dos equipamentos. Dessa forma, o documento contribui para a manutenção da qualidade, segurança e funcionalidade das instalações, promovendo a continuidade das operações e o bem-estar dos usuários.",
  },
];

export default function VisualizarRondaPage() {
  const params = useParams();
  const router = useRouter();
  const contratoId = params.contratoId as string;
  const rondaId = params.rondaId as string;

  const [contrato, setContrato] = useState<ContratoRonda | null>(null);
  const [ronda, setRonda] = useState<Ronda | null>(null);
  const [loading, setLoading] = useState(true);

  // Modais
  const [areaModalOpen, setAreaModalOpen] = useState(false);
  const [areaEditando, setAreaEditando] = useState<AreaTecnica | null>(null);
  const [outroItemModalOpen, setOutroItemModalOpen] = useState(false);
  const [outroItemEditando, setOutroItemEditando] = useState<OutroItemCorrigido | null>(null);
  const [outroItemCategoria, setOutroItemCategoria] = useState<"CHAMADO" | "CORRIGIDO">("CHAMADO");
  const [editarRondaOpen, setEditarRondaOpen] = useState(false);

  // Seções
  const [secoes, setSecoes] = useState<SecaoRonda[]>(SECOES_PADRAO);
  const [editandoSecao, setEditandoSecao] = useState<string | null>(null);
  const [novaSecao, setNovaSecao] = useState({ titulo: "", conteudo: "" });
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const contratoData = await contratoService.getById(contratoId);
      if (!contratoData) { router.push("/ronda"); return; }
      setContrato(contratoData);

      const rondasData = await rondaService.getByContrato(contratoData.nome);
      const rondaFound = rondasData.find((r) => r.id === rondaId);
      if (!rondaFound) { router.push(`/ronda/${contratoId}`); return; }

      const rondaCompleta = await rondaService.loadCompleteRonda(rondaFound);
      setRonda(rondaCompleta);
      setSecoes(rondaCompleta.secoes || SECOES_PADRAO);
    } catch (error) {
      console.error("Erro ao carregar ronda:", error);
    } finally {
      setLoading(false);
    }
  }, [contratoId, rondaId, router]);

  useEffect(() => { loadData(); }, [loadData]);

  // === AREA TECNICA HANDLERS ===
  const handleSalvarArea = async (area: AreaTecnica) => {
    if (!ronda) return;
    try {
      if (areaEditando) {
        await areaTecnicaService.update(area.id, area);
      } else {
        await areaTecnicaService.create({ ...area, ronda_id: ronda.id });
      }
      setAreaModalOpen(false);
      setAreaEditando(null);
      await loadData();
    } catch (error) {
      console.error("Erro ao salvar área:", error);
    }
  };

  const handleDeletarArea = async (id: string) => {
    if (!confirm("Excluir esta área técnica?")) return;
    try {
      await areaTecnicaService.delete(id);
      await loadData();
    } catch (error) {
      console.error("Erro ao deletar área:", error);
    }
  };

  // === OUTRO ITEM HANDLERS ===
  const handleSalvarOutroItem = async (item: OutroItemCorrigido) => {
    if (!ronda) return;
    try {
      if (outroItemEditando) {
        await outroItemService.update(item.id, item);
      } else {
        await outroItemService.create({ ...item, ronda_id: ronda.id });
      }
      setOutroItemModalOpen(false);
      setOutroItemEditando(null);
      await loadData();
    } catch (error) {
      console.error("Erro ao salvar item:", error);
    }
  };

  const handleDeletarOutroItem = async (id: string) => {
    if (!confirm("Excluir este item?")) return;
    try {
      await outroItemService.delete(id);
      await loadData();
    } catch (error) {
      console.error("Erro ao deletar item:", error);
    }
  };

  // === EDITAR RONDA ===
  const handleEditarRonda = async (updates: Partial<Ronda>) => {
    try {
      await rondaService.update(rondaId, updates);
      setEditarRondaOpen(false);
      await loadData();
    } catch (error) {
      console.error("Erro ao editar ronda:", error);
    }
  };

  // === SEÇÕES ===
  const handleAdicionarSecao = async () => {
    if (!novaSecao.titulo.trim()) { alert("Preencha o título da seção"); return; }
    const secao: SecaoRonda = {
      id: `secao-${Date.now()}`,
      ordem: secoes.length + 1,
      titulo: novaSecao.titulo,
      conteudo: novaSecao.conteudo,
    };
    const novas = [...secoes, secao];
    try {
      await rondaService.update(rondaId, { secoes: novas });
      setSecoes(novas);
      setNovaSecao({ titulo: "", conteudo: "" });
      setMostrandoFormulario(false);
    } catch (error) {
      console.error("Erro ao salvar seção:", error);
    }
  };

  const handleEditarSecao = async (id: string, titulo: string, conteudo: string) => {
    const atualizadas = secoes.map((s) => (s.id === id ? { ...s, titulo, conteudo } : s));
    try {
      await rondaService.update(rondaId, { secoes: atualizadas });
      setSecoes(atualizadas);
      setEditandoSecao(null);
    } catch (error) {
      console.error("Erro ao editar seção:", error);
    }
  };

  const handleDeletarSecao = async (id: string) => {
    const atualizadas = secoes.filter((s) => s.id !== id).map((s, i) => ({ ...s, ordem: i + 1 }));
    try {
      await rondaService.update(rondaId, { secoes: atualizadas });
      setSecoes(atualizadas);
    } catch (error) {
      console.error("Erro ao deletar seção:", error);
    }
  };

  // === RESUMO EXECUTIVO ===
  const resumoExecutivo = useMemo(() => {
    if (!ronda) return { equipamentosAtencao: [], equipamentosNormais: [], chamadosAbertos: [], itensCorrigidos: [] };
    const equipamentosAtencao: string[] = [];
    const equipamentosNormais: string[] = [];
    const chamadosAbertos: string[] = [];
    const itensCorrigidos: string[] = [];

    ronda.areasTecnicas.forEach((area) => {
      if (area.status === "ATENÇÃO" || area.status === "EM MANUTENÇÃO") {
        equipamentosAtencao.push(`${area.nome}: ${area.observacoes || area.status}`);
      } else {
        equipamentosNormais.push(`${area.nome}: Operacional`);
      }
    });

    ronda.fotosRonda.forEach((item) => {
      const texto = item.pendencia ? `Pendência: ${item.pendencia}` : `${item.especialidade} – ${item.local}`;
      if (item.criticidade === "Alta" || item.criticidade === "ALTA") {
        equipamentosAtencao.push(`${item.especialidade} (${item.local}): ${texto}`);
      } else {
        chamadosAbertos.push(`${item.especialidade} (${item.local}): ${texto}`);
      }
    });

    ronda.outrosItensCorrigidos?.forEach((item) => {
      if (!item) return;
      const isChamado = item.categoria === "CHAMADO" || (!item.categoria && item.status === "PENDENTE");
      if (isChamado && item.status === "PENDENTE") {
        chamadosAbertos.push(`${item.tipo || "Geral"} (${item.local}): ${item.descricao || item.nome} - Prioridade: ${item.prioridade || "MÉDIA"}`);
      } else if (item.status === "CONCLUÍDO") {
        itensCorrigidos.push(`${item.nome} (${item.local}): ${item.observacoes || item.descricao || "Item corrigido"}`);
      }
    });

    return { equipamentosAtencao, equipamentosNormais, chamadosAbertos, itensCorrigidos };
  }, [ronda]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Carregando ronda...</span>
      </div>
    );
  }

  if (!ronda || !contrato) return null;

  const formatarData = (data: string) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const isItemChamado = (item: OutroItemCorrigido) => {
    if (item.categoria !== undefined && item.categoria !== null) return item.categoria === "CHAMADO";
    return true;
  };

  const itensChamados = ronda.outrosItensCorrigidos?.filter(isItemChamado) || [];
  const itensCorrigidos = ronda.outrosItensCorrigidos?.filter((i) => i.categoria === "CORRIGIDO") || [];

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 pt-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link href={`/ronda/${contratoId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Voltar</span>
            </Button>
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">{ronda.nome}</h1>
              <Badge variant="outline" className={
                ronda.tipoVisita === "REUNIAO" ? "bg-green-100 text-green-800 border-green-200" :
                ronda.tipoVisita === "OUTROS" ? "bg-purple-100 text-purple-800 border-purple-200" :
                "bg-blue-100 text-blue-800 border-blue-200"
              }>
                {ronda.tipoVisita === "REUNIAO" ? "Reunião" : ronda.tipoVisita === "OUTROS" ? "Outros" : "Ronda"}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm truncate">{contrato.nome}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            onClick={async () => {
              if (ronda && contrato) {
                try { await downloadRelatorioPDF(ronda, contrato, ronda.areasTecnicas || []); }
                catch (e) { console.error("Erro ao gerar PDF:", e); }
              }
            }}
            variant="outline" size="sm"
          >
            <Download className="w-4 h-4 mr-1" /> PDF
          </Button>
          <Button onClick={() => setEditarRondaOpen(true)} variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-1" /> Editar
          </Button>
        </div>
      </div>

      {/* Informações da Ronda */}
      <Card className="animate-in fade-in duration-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Informações da Ronda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Data</div>
              <div className="text-lg font-semibold text-foreground">{formatarData(ronda.data)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Hora</div>
              <div className="text-lg font-semibold text-foreground">{ronda.hora || "N/A"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Responsável</div>
              <div className="text-lg font-semibold text-foreground">{ronda.responsavel || "—"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Áreas Verificadas</div>
              <div className="text-lg font-semibold text-blue-600">{ronda.areasTecnicas.length}</div>
            </div>
          </div>
          {ronda.observacoesGerais && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="text-sm font-medium text-muted-foreground mb-2">Observações Gerais</div>
              <p className="text-foreground">{ronda.observacoesGerais}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seções do Relatório */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Seções do Relatório
            </CardTitle>
            <Button onClick={() => setMostrandoFormulario(!mostrandoFormulario)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" /> Nova Seção
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {mostrandoFormulario && (
            <div className="border-2 border-purple-300 rounded-lg p-4 bg-purple-50 dark:bg-purple-950/20 space-y-3">
              <div>
                <label className="text-sm font-bold mb-1 block">Título da Seção</label>
                <Input value={novaSecao.titulo} onChange={(e) => setNovaSecao({ ...novaSecao, titulo: e.target.value })} placeholder="Ex: Observações, Recomendações, etc." />
              </div>
              <div>
                <label className="text-sm font-bold mb-1 block">Conteúdo</label>
                <Textarea value={novaSecao.conteudo} onChange={(e) => setNovaSecao({ ...novaSecao, conteudo: e.target.value })} placeholder="Digite o conteúdo da seção..." rows={4} />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => { setMostrandoFormulario(false); setNovaSecao({ titulo: "", conteudo: "" }); }}>
                  <X className="w-4 h-4 mr-2" /> Cancelar
                </Button>
                <Button onClick={handleAdicionarSecao} className="bg-purple-600 hover:bg-purple-700">
                  <Save className="w-4 h-4 mr-2" /> Salvar Seção
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {secoes.sort((a, b) => a.ordem - b.ordem).map((secao) => (
              <div key={secao.id} className="border border-border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
                {editandoSecao === secao.id ? (
                  <EditarSecaoForm secao={secao} onSalvar={(t, c) => handleEditarSecao(secao.id, t, c)} onCancelar={() => setEditandoSecao(null)} />
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-foreground">
                        {NUMEROS_ROMANOS[secao.ordem - 1] || secao.ordem} - {secao.titulo}
                      </h4>
                      <div className="mt-2 text-muted-foreground whitespace-pre-wrap text-sm">{secao.conteudo}</div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="ghost" size="sm" onClick={() => setEditandoSecao(secao.id)}>
                        <Edit className="w-4 h-4 text-blue-600" />
                      </Button>
                      {secao.id !== "objetivo-default" && (
                        <Button variant="ghost" size="sm" onClick={() => handleDeletarSecao(secao.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Áreas Técnicas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-green-600" />
              Áreas Técnicas Verificadas
            </CardTitle>
            <Button onClick={() => { setAreaEditando(null); setAreaModalOpen(true); }} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" /> Adicionar Área
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {ronda.areasTecnicas.length === 0 ? (
            <div className="text-center py-8">
              <Wrench className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma área técnica verificada ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {ronda.areasTecnicas.map((area) => (
                <Card key={area.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-blue-600" />
                        {area.nome}
                      </CardTitle>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { setAreaEditando(area); setAreaModalOpen(true); }}>
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDeletarArea(area.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Badge className={
                      area.status === "ATIVO" ? "bg-green-600 text-white" :
                      area.status === "EM MANUTENÇÃO" ? "bg-yellow-600 text-white" :
                      "bg-red-600 text-white"
                    }>
                      {area.status === "ATIVO" ? "Ativo" : area.status === "EM MANUTENÇÃO" ? "Em Manutenção" : "Atenção"}
                    </Badge>
                    {area.testeStatus !== "NAO_TESTADO" && (
                      <div className="p-2 border border-green-500 rounded text-sm font-medium text-center text-green-700">
                        Feito teste de funcionamento do ativo
                      </div>
                    )}
                    {area.foto && (
                      <div className="pt-2 border-t border-border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Camera className="w-4 h-4" /> Foto:
                        </div>
                        <img src={area.foto} alt={area.nome} className="w-full h-32 object-cover rounded-lg border" />
                      </div>
                    )}
                    {area.observacoes && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Obs:</span> {area.observacoes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Itens Abertura de Chamado */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Itens para Abertura de Chamado
            </CardTitle>
            <Button onClick={() => { setOutroItemEditando(null); setOutroItemCategoria("CHAMADO"); setOutroItemModalOpen(true); }} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" /> Registrar Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {itensChamados.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum item para abertura de chamado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {itensChamados.map((item) => (
                <Card key={item.id} className="border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{item.nome}</CardTitle>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{item.tipo || "Geral"}</Badge>
                      <Badge variant="outline" className={`text-xs ${item.prioridade === "ALTA" ? "border-red-500 text-red-600" : item.prioridade === "MÉDIA" ? "border-yellow-500 text-yellow-600" : "border-green-500 text-green-600"}`}>
                        {item.prioridade || "Média"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    {item.foto && (
                      <div className="mb-3 rounded-md overflow-hidden h-40 bg-muted">
                        <img src={item.foto} alt={item.nome} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="space-y-1 text-sm">
                      <div><span className="font-semibold text-muted-foreground">Local:</span> {item.local}</div>
                      <div><span className="font-semibold text-muted-foreground">Pendência:</span> {item.descricao || "Não informada"}</div>
                      {item.observacoes && <div><span className="font-semibold text-muted-foreground">Obs:</span> {item.observacoes}</div>}
                    </div>
                    <div className="flex gap-2 mt-3 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => { setOutroItemEditando(item); setOutroItemCategoria("CHAMADO"); setOutroItemModalOpen(true); }}>
                        <Edit className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeletarOutroItem(item.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Itens Corrigidos */}
      {itensCorrigidos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Itens Corrigidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {itensCorrigidos.map((item) => (
                <li key={item.id} className="flex items-start gap-2 text-foreground">
                  <span className="mt-1">•</span>
                  <span>{item.nome} ({item.local}): {item.observacoes || item.descricao || "Item corrigido"}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Resumo Executivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Resumo Executivo – Pontos Críticos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {resumoExecutivo.equipamentosAtencao.length > 0 && (
            <div className="bg-orange-100 dark:bg-orange-950/30 border-l-4 border-orange-500 p-4 rounded-r-lg">
              <h3 className="font-bold flex items-center gap-2 mb-3 text-foreground">
                <AlertCircle className="w-5 h-5" /> Equipamentos em Atenção / Em Manutenção
              </h3>
              <ul className="space-y-1">{resumoExecutivo.equipamentosAtencao.map((i, idx) => <li key={idx} className="text-sm">• {i}</li>)}</ul>
            </div>
          )}
          {resumoExecutivo.equipamentosNormais.length > 0 && (
            <div className="bg-green-100 dark:bg-green-950/30 border-l-4 border-green-500 p-4 rounded-r-lg">
              <h3 className="font-bold flex items-center gap-2 mb-3 text-foreground">
                <CheckCircle className="w-5 h-5" /> Equipamentos Status Normal
              </h3>
              <ul className="space-y-1">{resumoExecutivo.equipamentosNormais.map((i, idx) => <li key={idx} className="text-sm">• {i}</li>)}</ul>
            </div>
          )}
          {resumoExecutivo.chamadosAbertos.length > 0 && (
            <div className="bg-yellow-100 dark:bg-yellow-950/30 border-l-4 border-yellow-500 p-4 rounded-r-lg">
              <h3 className="font-bold flex items-center gap-2 mb-3 text-foreground">
                <AlertTriangle className="w-5 h-5" /> Itens para Abertura de Chamado
              </h3>
              <ul className="space-y-1">{resumoExecutivo.chamadosAbertos.map((i, idx) => <li key={idx} className="text-sm">• {i}</li>)}</ul>
            </div>
          )}
          {resumoExecutivo.equipamentosAtencao.length === 0 && resumoExecutivo.equipamentosNormais.length === 0 && resumoExecutivo.chamadosAbertos.length === 0 && (
            <div className="text-center py-8">
              <Info className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma informação registrada ainda.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modais */}
      <AreaTecnicaModal
        open={areaModalOpen}
        onOpenChange={setAreaModalOpen}
        area={areaEditando}
        onSave={handleSalvarArea}
        contratoRonda={contrato.nome}
        enderecoRonda={contrato.endereco}
        dataRonda={ronda.data}
        horaRonda={ronda.hora}
      />

      <OutroItemModal
        open={outroItemModalOpen}
        onOpenChange={setOutroItemModalOpen}
        item={outroItemEditando}
        categoria={outroItemCategoria}
        onSave={handleSalvarOutroItem}
        contratoRonda={contrato.nome}
        enderecoRonda={contrato.endereco}
        dataRonda={ronda.data}
        horaRonda={ronda.hora}
      />

      <EditarRondaDialog
        open={editarRondaOpen}
        onOpenChange={setEditarRondaOpen}
        ronda={ronda}
        onSave={handleEditarRonda}
      />
    </div>
  );
}

// Componente auxiliar para editar seção inline
function EditarSecaoForm({ secao, onSalvar, onCancelar }: { secao: SecaoRonda; onSalvar: (titulo: string, conteudo: string) => void; onCancelar: () => void; }) {
  const [titulo, setTitulo] = useState(secao.titulo);
  const [conteudo, setConteudo] = useState(secao.conteudo);
  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-bold mb-1 block">Título da Seção</label>
        <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
      </div>
      <div>
        <label className="text-sm font-bold mb-1 block">Conteúdo</label>
        <Textarea value={conteudo} onChange={(e) => setConteudo(e.target.value)} rows={4} />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancelar}><X className="w-4 h-4 mr-2" /> Cancelar</Button>
        <Button onClick={() => onSalvar(titulo, conteudo)} className="bg-blue-600 hover:bg-blue-700"><Save className="w-4 h-4 mr-2" /> Salvar</Button>
      </div>
    </div>
  );
}
