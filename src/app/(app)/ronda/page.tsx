"use client";

import { useState, useEffect } from "react";
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
  CheckCircle,
  Building,
  Building2,
  Search,
  Filter,
  Loader2,
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

export default function RondaPage() {
  const [contratos, setContratos] = useState<ContratoRonda[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [periodicidadeFilter, setPeriodicidadeFilter] = useState("TODOS");

  useEffect(() => {
    contratoService.getAll().then((data) => {
      setContratos(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = contratos.filter((c) => {
    const matchSearch = c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.sindico.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPeriodicidade = periodicidadeFilter === "TODOS" || c.periodicidade === periodicidadeFilter;
    return matchSearch && matchPeriodicidade;
  });

  return (
    <div className="flex-1 space-y-6 p-10 pt-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-700">
        <Link href="/">
          <Button variant="ghost" className="hover:bg-secondary transition-all duration-300">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Menu
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Ronda de Inspeção</h1>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="text-center p-4 bg-blue-600 rounded-lg shadow-md">
          <div className="text-3xl font-bold text-white mb-1">{contratos.length}</div>
          <div className="text-blue-100 font-medium text-sm">Total de Contratos</div>
        </div>
        <div className="text-center p-4 bg-emerald-600 rounded-lg shadow-md">
          <div className="text-3xl font-bold text-white mb-1">
            {contratos.filter((c) => c.periodicidade === "SEMANAL").length}
          </div>
          <div className="text-emerald-100 font-medium text-sm">Semanais</div>
        </div>
        <div className="text-center p-4 bg-amber-600 rounded-lg shadow-md">
          <div className="text-3xl font-bold text-white mb-1">
            {contratos.filter((c) => c.periodicidade === "QUINZENAL").length}
          </div>
          <div className="text-amber-100 font-medium text-sm">Quinzenais</div>
        </div>
        <div className="text-center p-4 bg-purple-600 rounded-lg shadow-md">
          <div className="text-3xl font-bold text-white mb-1">
            {contratos.filter((c) => c.periodicidade === "MENSAL").length}
          </div>
          <div className="text-purple-100 font-medium text-sm">Mensais</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card rounded-lg shadow-sm p-4 border border-border/50 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              <Search className="w-4 h-4 inline mr-2" />Buscar
            </label>
            <Input
              placeholder="Nome ou síndico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              <Filter className="w-4 h-4 inline mr-2" />Periodicidade
            </label>
            <select
              value={periodicidadeFilter}
              onChange={(e) => setPeriodicidadeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="TODOS">Todas</option>
              <option value="DIARIA">Diária</option>
              <option value="SEMANAL">Semanal</option>
              <option value="QUINZENAL">Quinzenal</option>
              <option value="MENSAL">Mensal</option>
              <option value="BIMESTRAL">Bimestral</option>
              <option value="TRIMESTRAL">Trimestral</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => { setSearchTerm(""); setPeriodicidadeFilter("TODOS"); }}
            >
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {filtered.map((contrato, index) => (
            <div
              key={contrato.id}
              className="animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
            >
              <Link href={`/ronda/${contrato.id}`}>
                <Card className={`group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-l-4 ${contrato.status === "IMPLANTADO" ? "border-l-green-500" : "border-l-yellow-500"}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-1">
                      <CardTitle className="text-sm sm:text-lg font-semibold text-foreground flex items-center gap-2 min-w-0 group-hover:text-primary transition-colors">
                        <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="truncate">{contrato.nome}</span>
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span className="font-medium">Síndico:</span>
                      <span className="truncate">{contrato.sindico}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{contrato.endereco}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <Badge className="bg-purple-600 text-white hover:bg-purple-700">
                        {getPeriodicidadeLabel(contrato.periodicidade)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4" />
                      <Badge className={contrato.status === "IMPLANTADO" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-yellow-600 hover:bg-yellow-700 text-white"}>
                        {contrato.status === "IMPLANTADO" ? "Implantado" : "Em Implantação"}
                      </Badge>
                    </div>
                    {contrato.tipo_uso && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="w-4 h-4" />
                        <Badge variant="outline">
                          {contrato.tipo_uso === "RESIDENCIAL" ? "Residencial" : contrato.tipo_uso === "NAO_RESIDENCIAL" ? "Não Residencial" : "Misto"}
                        </Badge>
                      </div>
                    )}
                    {contrato.quantidade_torres && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="w-4 h-4" />
                        <Badge variant="outline">{contrato.quantidade_torres} Torre(s)</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
          {filtered.length === 0 && !loading && (
            <div className="col-span-full text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">Nenhum contrato encontrado</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
