"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ItemsProgressChartProps {
  stats: {
    emAndamento: number;
    finalizado: number;
    improcedente: number;
    aguardandoVistoria: number;
    concluido: number;
  };
}

export function ItemsProgressChart({ stats }: ItemsProgressChartProps) {
  const total = stats.emAndamento + stats.finalizado + stats.improcedente + stats.aguardandoVistoria + stats.concluido;
  
  const chartData = [
    {
      name: "Total",
      quantidade: total,
      concluidos: stats.concluido,
    },
  ];

  if (total === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="text-center pb-0">
          <CardTitle>Progresso dos Itens</CardTitle>
          <CardDescription>Quantidade vs Concluídos</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Nenhum item encontrado
          </div>
        </CardContent>
      </Card>
    );
  }

  const percentage = total > 0 ? Math.round((stats.concluido / total) * 100) : 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="text-center pb-0">
        <CardTitle>Progresso dos Itens</CardTitle>
        <CardDescription>Quantidade vs Concluídos</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  // Pegar apenas o item que está sendo hoverado
                  const hoveredData = payload.find(item => item.payload && item.payload.name === "Total");
                  if (hoveredData) {
                    const dataKey = hoveredData.dataKey;
                    const value = hoveredData.value;
                    const label = dataKey === "quantidade" ? "Total" : "Concluídos";
                    
                    return (
                      <div className="bg-white p-2 border rounded shadow-lg">
                        <p className="font-medium">
                          {label}: {value} itens
                        </p>
                      </div>
                    );
                  }
                }
                return null;
              }}
            />
            <Bar dataKey="quantidade" fill="#3b82f6" radius={4} />
            <Bar dataKey="concluidos" fill="#10b981" radius={4} />
          </BarChart>
        </ResponsiveContainer>
        
        {/* Informações abaixo do gráfico */}
        <div className="text-center mt-4">
          <div className="flex flex-wrap justify-center gap-6">
            <div className="text-sm font-medium text-blue-600">
              Total: {total} itens
            </div>
            <div className="text-sm font-medium text-green-600">
              Concluídos: {stats.concluido} itens
            </div>
            <div className="text-sm font-medium text-gray-600">
              Progresso: {percentage}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 