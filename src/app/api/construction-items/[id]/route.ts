import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Processar datas corretamente para evitar problemas de timezone
    const processDateForDatabase = (dateString: string | null) => {
      if (!dateString) return null;
      
      // Se é uma string de data YYYY-MM-DD, criar Date object corretamente
      if (typeof dateString === 'string' && dateString.includes('-')) {
        const [year, month, day] = dateString.split('-');
        // Criar data no meio do dia para evitar problemas de timezone
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0);
      }
      
      return new Date(dateString);
    };

    const updatedItem = await prisma.constructionItem.update({
      where: { id },
      data: {
        ...body,
        openedAt: processDateForDatabase(body.openedAt),
        deadline: processDateForDatabase(body.deadline),
        rescheduledDate: processDateForDatabase(body.rescheduledDate),
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
} 