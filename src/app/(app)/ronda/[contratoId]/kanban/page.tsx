"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Columns,
  Loader2,
  Plus,
  GripVertical,
} from "lucide-react";
import { contratoService, rondaService } from "@/lib/supabaseService";
import type { ContratoRonda, Ronda, OutroItemCorrigido } from "@/types/ronda";

const COLUNAS = [
  { id: "PENDENTE", label: "Pendente", color: "bg-yellow-500" },
  { id: "EM ANDAMENTO", label: "Em Andamento", color: "bg-blue-500" },
  { id: "CONCLUÍDO", label: "Concluído", color: "bg-green-500" },
  { id: "CANCELADO", label: "Cancelado", color: "bg-red-500" },
];

export default function KanbanPage() {
  const params = useParams();
  const router = useRouter();
  const contratoId = params.contratoId as string;

  const [contrato, setContrato] = useState<ContratoRonda | null>(null);
  const [itens, setItens] = useState<OutroItemCorrigido[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const c = await contratoService.getById(contratoId);
      if (!c) { router.push("/ronda"); return; }
      setContrato(c);

      const rondas = await rondaService.getByContrato(c.nome);
      const completas = await Promise.all(rondas.map((r) => rondaService.loadCompleteRonda(r)));

      // Agregar todos os itens de todas as rondas
      const todosItens: OutroItemCorrigido[] = [];
      completas.forEach((r) => {
        (r.outrosItensCorrigidos || []).forEach((item) => {
          todosItens.push(item);
        });
      });
      setItens(todosItens);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [contratoId, router]);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Carregando kanban...</span>
      </div>
    );
  }

  if (!contrato) return null;

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 pt-8 bg-background min-h-screen">
      <div className="flex items-center gap-4">
        <Link href={`/ronda/${contratoId}`}>
          <Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" /> Rondas</Button>
        </Link>
        <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
          <Columns className="w-5 h-5 text-blue-600" /> Kanban - {contrato.nome}
        </h1>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUNAS.map((coluna) => {
          const itensFiltrados = itens.filter((i) => i.status === coluna.id);
          return (
            <div key={coluna.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${coluna.color}`} />
                <h3 className="font-semibold text-foreground">{coluna.label}</h3>
                <Badge variant="outline" className="ml-auto">{itensFiltrados.length}</Badge>
              </div>
              <div className="space-y-2 min-h-[200px] bg-muted/30 rounded-lg p-2">
                {itensFiltrados.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">Nenhum item</p>
                ) : (
                  itensFiltrados.map((item) => (
                    <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start justify-between">
                          <span className="font-medium text-sm text-foreground">{item.nome}</span>
                          <Badge variant="outline" className={`text-xs ${
                            item.prioridade === "ALTA" ? "border-red-500 text-red-600" :
                            item.prioridade === "MÉDIA" ? "border-yellow-500 text-yellow-600" :
                            "border-green-500 text-green-600"
                          }`}>
                            {item.prioridade}
                          </Badge>
                        </div>
                        {item.descricao && <p className="text-xs text-muted-foreground line-clamp-2">{item.descricao}</p>}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{item.local}</span>
                          <Badge variant="outline" className="text-xs">{item.tipo}</Badge>
                        </div>
                        {item.foto && (
                          <img src={item.foto} alt={item.nome} className="w-full h-20 object-cover rounded" />
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
