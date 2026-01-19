"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface EspecialidadeChartProps {
  stats: {
    civil: number;
    eletrica: number;
    hidraulica: number;
    sistemas: number;
  };
}

const COLORS = ['#3b82f6', '#fbbf24', '#06b6d4', '#a855f7'];

export function EspecialidadeChart({ stats }: EspecialidadeChartProps) {
  // Criar dados de especialidades com valores reais
  const especialidadeData = [
    { 
      name: "Civil",
      value: stats.civil,
      color: COLORS[0]
    },
    { 
      name: "Elétrica",
      value: stats.eletrica,
      color: COLORS[1]
    },
    { 
      name: "Hidráulica",
      value: stats.hidraulica,
      color: COLORS[2]
    },
    { 
      name: "Sistemas",
      value: stats.sistemas,
      color: COLORS[3]
    },
  ].filter(item => item.value > 0);

  const total = especialidadeData.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="text-center pb-0">
          <CardTitle>Especialidades</CardTitle>
          <CardDescription>Distribuição por especialidade</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Nenhuma especialidade encontrada
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="text-center pb-0">
        <CardTitle>Especialidades</CardTitle>
        <CardDescription>Distribuição por especialidade</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={especialidadeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={false}
              outerRadius={60}
              innerRadius={30}
              fill="#8884d8"
              dataKey="value"
            >
              {especialidadeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any, name: any) => [
                `${value} itens`, 
                name
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Texto abaixo da pizza */}
        <div className="text-center mt-4">
          <div className="flex flex-wrap justify-center gap-4">
            {especialidadeData.map((item, index) => {
              const percentage = Math.round((item.value / total) * 100);
              return (
                <div key={index} className="text-sm font-medium" style={{ color: item.color }}>
                  {item.name} ({percentage}%)
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 