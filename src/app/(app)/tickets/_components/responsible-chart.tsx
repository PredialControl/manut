"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ResponsibleChartProps {
  stats: {
    condominio: number;
    construtora: number;
    outros: number;
  };
}

const COLORS = ['#10b981', '#ef4444', '#6b7280'];

export function ResponsibleChart({ stats }: ResponsibleChartProps) {
  const total = stats.condominio + stats.construtora + stats.outros;

  const chartData = [
    { name: "Condomínio", value: stats.condominio, color: COLORS[0] },
    { name: "Construtora", value: stats.construtora, color: COLORS[1] },
    { name: "Outros", value: stats.outros, color: COLORS[2] },
  ].filter(item => item.value > 0);

  if (total === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Responsável</CardTitle>
          <CardDescription>Distribuição por responsável</CardDescription>
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
        <CardTitle>Responsável</CardTitle>
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
