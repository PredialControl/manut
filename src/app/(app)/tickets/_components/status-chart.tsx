"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StatusChartProps {
  stats: {
    itensApontados: number;
    emAndamento: number;
    improcedente: number;
    aguardandoVistoria: number;
    concluido: number;
    fIndevido: number;
  };
}

const COLORS = ['#fbbf24', '#3b82f6', '#6b7280', '#f97316', '#10b981', '#ef4444'];

export function StatusChart({ stats }: StatusChartProps) {
  const total = stats.itensApontados + stats.emAndamento + stats.improcedente +
                stats.aguardandoVistoria + stats.concluido + stats.fIndevido;

  const chartData = [
    { name: "Itens Apontados", value: stats.itensApontados, color: COLORS[0] },
    { name: "Em Andamento", value: stats.emAndamento, color: COLORS[1] },
    { name: "Improcedente", value: stats.improcedente, color: COLORS[2] },
    { name: "Ag. Vistoria", value: stats.aguardandoVistoria, color: COLORS[3] },
    { name: "Concluído", value: stats.concluido, color: COLORS[4] },
    { name: "F. Indevido", value: stats.fIndevido, color: COLORS[5] },
  ].filter(item => item.value > 0);

  if (total === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Status dos Chamados</CardTitle>
          <CardDescription>Distribuição por status</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Nenhum chamado encontrado
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="text-center pb-0">
        <CardTitle>Status dos Chamados</CardTitle>
        <CardDescription>Total: {total}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
