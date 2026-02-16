"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  Calendar,
  Loader2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Edit,
  Trash2,
} from "lucide-react";
import { contratoService, agendaService } from "@/lib/supabaseService";
import type { ContratoRonda, AgendaItem } from "@/types/ronda";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const DIAS_SEMANA_FULL = ["DOMINGO", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO"];

function getDaysInMonth(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

export default function AgendaPage() {
  const params = useParams();
  const router = useRouter();
  const contratoId = params.contratoId as string;

  const [contrato, setContrato] = useState<ContratoRonda | null>(null);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<AgendaItem | null>(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const [formData, setFormData] = useState({
    diaSemana: "SEGUNDA" as AgendaItem["diaSemana"],
    horario: "09:00",
    observacoes: "",
  });

  const loadData = useCallback(async () => {
    try {
      const c = await contratoService.getById(contratoId);
      if (!c) { router.push("/ronda"); return; }
      setContrato(c);
      const items = await agendaService.getAll();
      // Filtrar apenas os itens deste contrato
      setAgendaItems(items.filter((i) => i.contratoId === contratoId));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [contratoId, router]);

  useEffect(() => { loadData(); }, [loadData]);

  const days = useMemo(() => getDaysInMonth(currentYear, currentMonth), [currentYear, currentMonth]);

  const getEventsForDay = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const dayOfWeek = DIAS_SEMANA_FULL[date.getDay()];
    return agendaItems.filter((item) => item.diaSemana === dayOfWeek && item.ativo);
  };

  const handleSave = async () => {
    if (!contrato) return;
    try {
      if (editando) {
        await agendaService.update(editando.id, formData);
      } else {
        await agendaService.create({
          ...formData,
          contratoId,
          contratoNome: contrato.nome,
          endereco: contrato.endereco,
        });
      }
      setModalOpen(false);
      setEditando(null);
      setLoading(true);
      await loadData();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este agendamento?")) return;
    try { await agendaService.delete(id); await loadData(); }
    catch (e) { console.error(e); }
  };

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  if (loading) {
    return <div className="flex-1 flex items-center justify-center min-h-screen bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!contrato) return null;

  const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 pt-8 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/ronda/${contratoId}`}><Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" /> Rondas</Button></Link>
          <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" /> Agenda - {contrato.nome}
          </h1>
        </div>
        <Button onClick={() => { setEditando(null); setFormData({ diaSemana: "SEGUNDA", horario: "09:00", observacoes: "" }); setModalOpen(true); }} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" /> Novo Agendamento
        </Button>
      </div>

      {/* Navegação do mês */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" size="sm" onClick={prevMonth}><ChevronLeft className="w-4 h-4" /></Button>
        <h2 className="text-lg font-semibold text-foreground min-w-[200px] text-center">
          {MESES[currentMonth]} {currentYear}
        </h2>
        <Button variant="outline" size="sm" onClick={nextMonth}><ChevronRight className="w-4 h-4" /></Button>
      </div>

      {/* Calendário */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-1">
            {DIAS_SEMANA.map((dia) => (
              <div key={dia} className="text-center py-2 text-sm font-semibold text-muted-foreground">{dia}</div>
            ))}
            {days.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} className="min-h-[80px]" />;
              const events = getEventsForDay(day);
              const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
              return (
                <div
                  key={day}
                  className={`min-h-[80px] border border-border/50 rounded-lg p-1 ${isToday ? "bg-primary/10 border-primary/30" : "hover:bg-muted/50"}`}
                >
                  <div className={`text-xs font-medium mb-1 ${isToday ? "text-primary font-bold" : "text-muted-foreground"}`}>{day}</div>
                  {events.map((ev) => (
                    <div key={ev.id} className="bg-blue-600 text-white text-xs rounded px-1 py-0.5 mb-0.5 truncate cursor-pointer" title={`${ev.horario} - ${ev.observacoes || contrato.nome}`}>
                      <Clock className="w-3 h-3 inline mr-1" />{ev.horario}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Agendamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Agendamentos Recorrentes</CardTitle>
        </CardHeader>
        <CardContent>
          {agendaItems.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum agendamento.</p>
          ) : (
            <div className="space-y-2">
              {agendaItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-600 text-white">{item.diaSemana}</Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" /> {item.horario}
                    </div>
                    {item.observacoes && <span className="text-sm text-muted-foreground">— {item.observacoes}</span>}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => {
                      setEditando(item);
                      setFormData({ diaSemana: item.diaSemana, horario: item.horario, observacoes: item.observacoes || "" });
                      setModalOpen(true);
                    }}><Edit className="w-4 h-4 text-blue-600" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-red-600" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editando ? "Editar Agendamento" : "Novo Agendamento"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Dia da Semana *</Label>
              <select value={formData.diaSemana} onChange={(e) => setFormData((p) => ({ ...p, diaSemana: e.target.value as AgendaItem["diaSemana"] }))} className="w-full p-2 border border-border rounded-md bg-background text-foreground">
                {(["SEGUNDA","TERÇA","QUARTA","QUINTA","SEXTA","SÁBADO","DOMINGO"] as const).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div><Label>Horário *</Label><Input type="time" value={formData.horario} onChange={(e) => setFormData((p) => ({ ...p, horario: e.target.value }))} required /></div>
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
