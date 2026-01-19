"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface StatusChartProps {
  stats: {
    emAndamento: number;
    finalizado: number;
    improcedente: number;
    aguardandoVistoria: number;
    concluido: number;
  };
}

const COLORS = ['#3b82f6', '#10b981', '#6b7280', '#f97316', '#ef4444'];

const statusLabels = {
  emAndamento: "Em Andamento",
  concluido: "Concluido",
  improcedente: "Improcedente",
  aguardandoVistoria: "Ag Vistoria",
  finalizado: "F. Indevido"
};

export function StatusChart({ stats }: StatusChartProps) {
  // Calcular total para porcentagens
  const total = stats.emAndamento + stats.finalizado + stats.improcedente + stats.aguardandoVistoria + stats.concluido;

  // Criar dados do gráfico com porcentagens
  const chartData = [
    {
      name: "Em Andamento",
      value: stats.emAndamento,
      percentage: total > 0 ? Math.round((stats.emAndamento / total) * 100) : 0,
      color: COLORS[0]
    },
    {
      name: "Concluido",
      value: stats.concluido,
      percentage: total > 0 ? Math.round((stats.concluido / total) * 100) : 0,
      color: COLORS[1]
    },
    {
      name: "Improcedente",
      value: stats.improcedente,
      percentage: total > 0 ? Math.round((stats.improcedente / total) * 100) : 0,
      color: COLORS[2]
    },
    {
      name: "Ag Vistoria",
      value: stats.aguardandoVistoria,
      percentage: total > 0 ? Math.round((stats.aguardandoVistoria / total) * 100) : 0,
      color: COLORS[3]
    },
    {
      name: "F. Indevido",
      value: stats.finalizado,
      percentage: total > 0 ? Math.round((stats.finalizado / total) * 100) : 0,
      color: COLORS[4]
    },
  ].filter(item => item.value > 0); // Filtrar apenas status com itens

  if (total === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Status dos Itens</CardTitle>
          <CardDescription>Distribuição por status</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Nenhum item encontrado
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="text-center pb-0">
        <CardTitle>Status dos Itens</CardTitle>
        <CardDescription>Distribuição por status</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={false}
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--foreground))',
                borderRadius: '8px'
              }}
              formatter={(value: any, name: any) => [
                `${value} itens (${chartData.find(item => item.name === name)?.percentage}%)`,
                name
              ]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Texto abaixo da pizza */}
        <div className="text-center mt-4">
          <div className="flex flex-wrap justify-center gap-4">
            {chartData.map((item, index) => (
              <div key={index} className="text-sm font-medium" style={{ color: item.color }}>
                {item.name} ({item.percentage}%)
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 