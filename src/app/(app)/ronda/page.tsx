"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  FileText,
  MapPin,
  User,
  Calendar,
  Clock,
  CheckCircle,
  Building,
  Building2,
  Search,
  Filter,
  Loader2,
  Plus,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import { contratoService } from "@/lib/supabaseService";
import type { ContratoRonda } from "@/types/ronda";

const getPeriodicidadeLabel = (p: string) => {
  const map: Record<string, string> = {
    DIARIA: "Diária", SEMANAL: "Semanal", QUINZENAL: "Quinzenal",
    MENSAL: "Mensal", BIMESTRAL: "Bimestral", TRIMESTRAL: "Trimestral",
    SEMESTRAL: "Semestral", ANUAL: "Anual",
  };
  return map[p] || p;
};

// ==================== CONTRATO MODAL ====================
function ContratoModal({
  contrato,
  isOpen,
  onClose,
  onSave,
}: {
  contrato: ContratoRonda | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ContratoRonda>) => void;
}) {
  const [formData, setFormData] = useState({
    nome: "", sindico: "", endereco: "", periodicidade: "MENSAL",
    status: "EM IMPLANTACAO", tipo_uso: "", quantidade_torres: "", observacoes: "",
  });

  useEffect(() => {
    if (contrato) {
      setFormData({
        nome: contrato.nome, sindico: contrato.sindico, endereco: contrato.endereco,
        periodicidade: contrato.periodicidade, status: contrato.status || "EM IMPLANTACAO",
        tipo_uso: contrato.tipo_uso || "", quantidade_torres: contrato.quantidade_torres ? String(contrato.quantidade_torres) : "",
        observacoes: contrato.observacoes || "",
      });
    } else {
      setFormData({ nome: "", sindico: "", endereco: "", periodicidade: "MENSAL", status: "EM IMPLANTACAO", tipo_uso: "", quantidade_torres: "", observacoes: "" });
    }
  }, [contrato, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.sindico || !formData.endereco) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }
    onSave({
      id: contrato?.id,
      nome: formData.nome, sindico: formData.sindico, endereco: formData.endereco,
      periodicidade: formData.periodicidade as ContratoRonda["periodicidade"],
      status: formData.status as ContratoRonda["status"],
      tipo_uso: (formData.tipo_uso || undefined) as ContratoRonda["tipo_uso"],
      quantidade_torres: formData.quantidade_torres ? parseInt(formData.quantidade_torres) : undefined,
      observacoes: formData.observacoes,
    });
  };

  const handleChange = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg w-full max-w-md max-h-[95vh] overflow-y-auto shadow-2xl border border-border">
        <div className="sticky top-0 bg-background border-b border-border px-4 py-3 rounded-t-lg flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {contrato ? "Editar Contrato" : "Novo Contrato"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Nome do Contrato *</label>
            <Input value={formData.nome} onChange={(e) => handleChange("nome", e.target.value)} placeholder="Ex: CT001/2024 - Manutenção Preventiva" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-1"><User className="w-4 h-4" />Síndico *</label>
            <Input value={formData.sindico} onChange={(e) => handleChange("sindico", e.target.value)} placeholder="Nome do síndico" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-1"><MapPin className="w-4 h-4" />Endereço *</label>
            <Input value={formData.endereco} onChange={(e) => handleChange("endereco", e.target.value)} placeholder="Endereço completo" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-1"><Calendar className="w-4 h-4" />Periodicidade *</label>
            <select value={formData.periodicidade} onChange={(e) => handleChange("periodicidade", e.target.value)} className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="DIARIA">Diária</option>
              <option value="SEMANAL">Semanal</option>
              <option value="QUINZENAL">Quinzenal</option>
              <option value="MENSAL">Mensal</option>
              <option value="BIMESTRAL">Bimestral</option>
              <option value="TRIMESTRAL">Trimestral</option>
              <option value="SEMESTRAL">Semestral</option>
              <option value="ANUAL">Anual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-1"><Clock className="w-4 h-4" />Status *</label>
            <select value={formData.status} onChange={(e) => handleChange("status", e.target.value)} className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="EM IMPLANTACAO">Em Implantação</option>
              <option value="IMPLANTADO">Implantado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-1"><Building className="w-4 h-4" />Tipo de Uso</label>
            <select value={formData.tipo_uso} onChange={(e) => handleChange("tipo_uso", e.target.value)} className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Selecione</option>
              <option value="RESIDENCIAL">Residencial</option>
              <option value="NAO_RESIDENCIAL">Não Residencial</option>
              <option value="RESIDENCIAL_E_NAO_RESIDENCIAL">Residencial e Não Residencial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-1"><Building2 className="w-4 h-4" />Quantidade de Torres</label>
            <Input type="number" min="1" value={formData.quantidade_torres} onChange={(e) => handleChange("quantidade_torres", e.target.value)} placeholder="Ex: 1, 2, 3..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Observações</label>
            <Input value={formData.observacoes} onChange={(e) => handleChange("observacoes", e.target.value)} placeholder="Observações adicionais" />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
            <Button type="submit" className="flex-1">{contrato ? "Salvar Alterações" : "Criar Contrato"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==================== PAGE ====================
export default function RondaPage() {
  const router = useRouter();
  const [contratos, setContratos] = useState<ContratoRonda[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [periodicidadeFilter, setPeriodicidadeFilter] = useState("TODOS");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContrato, setEditingContrato] = useState<ContratoRonda | null>(null);

  const loadContratos = () => {
    setLoading(true);
    contratoService.getAll().then((data) => {
      setContratos(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { loadContratos(); }, []);

  const handleSave = async (data: Partial<ContratoRonda>) => {
    try {
      if (data.id) {
        await contratoService.update(data.id, data);
      } else {
        await contratoService.create(data);
      }
      setIsModalOpen(false);
      setEditingContrato(null);
      loadContratos();
    } catch (error) {
      console.error("Erro ao salvar contrato:", error);
      alert("Erro ao salvar contrato. Verifique o console.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este contrato?")) return;
    try {
      await contratoService.delete(id);
      loadContratos();
    } catch (error) {
      console.error("Erro ao excluir contrato:", error);
    }
  };

  const filtered = contratos
    .filter((c) => {
      const matchSearch = c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.sindico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.endereco.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPeriodicidade = periodicidadeFilter === "TODOS" || c.periodicidade === periodicidadeFilter;
      const matchStatus = statusFilter === "TODOS" || c.status === statusFilter;
      return matchSearch && matchPeriodicidade && matchStatus;
    })
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="w-full mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 gap-2">
            <h1 className="text-base sm:text-2xl font-bold text-foreground flex items-center gap-2 min-w-0 truncate">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
              <span className="truncate">Contratos</span>
            </h1>
            <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
              <Link href="/">
                <Button variant="outline" size="sm" className="px-2 sm:px-3">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Voltar</span>
                </Button>
              </Link>
              <Button onClick={() => { setEditingContrato(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 px-2 sm:px-3" size="sm">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Novo Contrato</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Visão Geral */}
        <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6 border border-border/50">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3">Visão Geral</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-sm">
            <div className="text-center p-4 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{contratos.length}</div>
              <div className="text-blue-100 font-medium">Total de Contratos</div>
            </div>
            <div className="text-center p-4 bg-emerald-600 rounded-lg shadow-md hover:bg-emerald-700 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{contratos.filter((c) => c.periodicidade === "SEMANAL").length}</div>
              <div className="text-emerald-100 font-medium">Semanais</div>
            </div>
            <div className="text-center p-4 bg-amber-600 rounded-lg shadow-md hover:bg-amber-700 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{contratos.filter((c) => c.periodicidade === "QUINZENAL").length}</div>
              <div className="text-amber-100 font-medium">Quinzenais</div>
            </div>
            <div className="text-center p-4 bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{contratos.filter((c) => c.periodicidade === "MENSAL").length}</div>
              <div className="text-purple-100 font-medium">Mensais</div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6 border border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                <Search className="w-4 h-4 inline mr-2" />Buscar
              </label>
              <Input placeholder="Nome, síndico ou endereço..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                <Filter className="w-4 h-4 inline mr-2" />Periodicidade
              </label>
              <select value={periodicidadeFilter} onChange={(e) => setPeriodicidadeFilter(e.target.value)} className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="TODOS">Todas as Periodicidades</option>
                <option value="DIARIA">Diária</option>
                <option value="SEMANAL">Semanal</option>
                <option value="QUINZENAL">Quinzenal</option>
                <option value="MENSAL">Mensal</option>
                <option value="BIMESTRAL">Bimestral</option>
                <option value="TRIMESTRAL">Trimestral</option>
                <option value="SEMESTRAL">Semestral</option>
                <option value="ANUAL">Anual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                <Filter className="w-4 h-4 inline mr-2" />Status
              </label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="TODOS">Todos os Status</option>
                <option value="IMPLANTADO">Implantado</option>
                <option value="EM IMPLANTACAO">Em Implantação</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full" onClick={() => { setSearchTerm(""); setPeriodicidadeFilter("TODOS"); setStatusFilter("TODOS"); }}>
                Limpar Filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Carregando contratos...</span>
          </div>
        )}

        {/* Grid de Contratos */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((contrato) => (
              <Card
                key={contrato.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 ${contrato.status === "IMPLANTADO" ? "border-l-green-500" : "border-l-yellow-500"}`}
                onClick={() => router.push(`/ronda/${contrato.id}`)}
              >
                <CardHeader className="pb-3 px-3 sm:px-6">
                  <div className="flex items-start justify-between gap-1">
                    <CardTitle className="text-sm sm:text-lg font-semibold text-foreground flex items-center gap-1.5 sm:gap-2 min-w-0">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                      <span className="truncate">{contrato.nome}</span>
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setEditingContrato(contrato); setIsModalOpen(true); }} className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(contrato.id); }} className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3 px-3 sm:px-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Síndico:</span>
                    <span className="truncate">{contrato.sindico}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="font-medium">Endereço:</span>
                    <span className="flex-1 line-clamp-2">{contrato.endereco}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Periodicidade:</span>
                    <Badge className="bg-purple-600 text-white hover:bg-purple-700">
                      {getPeriodicidadeLabel(contrato.periodicidade)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Status:</span>
                    <Badge className={contrato.status === "IMPLANTADO" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-yellow-600 hover:bg-yellow-700 text-white"}>
                      {contrato.status === "IMPLANTADO" ? "Implantado" : "Em Implantação"}
                    </Badge>
                  </div>
                  {contrato.tipo_uso && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="w-4 h-4" />
                      <span className="font-medium">Tipo de Uso:</span>
                      <Badge variant="outline">
                        {contrato.tipo_uso === "RESIDENCIAL" ? "Residencial" : contrato.tipo_uso === "NAO_RESIDENCIAL" ? "Não Residencial" : "Residencial e Não Residencial"}
                      </Badge>
                    </div>
                  )}
                  {contrato.quantidade_torres && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                      <span className="font-medium">Torres:</span>
                      <Badge variant="outline">{contrato.quantidade_torres}</Badge>
                    </div>
                  )}
                  {contrato.dataCriacao && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">Início:</span>
                      <span>{new Date(contrato.dataCriacao).toLocaleDateString("pt-BR")}</span>
                    </div>
                  )}
                  {contrato.observacoes && (
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Observações:</span> {contrato.observacoes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-2">
              {contratos.length === 0 ? "Nenhum contrato cadastrado ainda." : "Nenhum contrato encontrado com os filtros aplicados."}
            </p>
            {contratos.length === 0 && (
              <Button onClick={() => { setEditingContrato(null); setIsModalOpen(true); }} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />Cadastrar Primeiro Contrato
              </Button>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      <ContratoModal
        contrato={editingContrato}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingContrato(null); }}
        onSave={handleSave}
      />
    </div>
  );
}
