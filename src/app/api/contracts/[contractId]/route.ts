import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ contractId: string }> }
) {
  try {
    const params = await context.params;
    const contract = await prisma.contract.findUnique({
      where: {
        id: params.contractId,
      },
      select: {
        id: true,
        name: true,
        acronym: true,
        imageUrl: true,
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contrato não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(contract);
  } catch (error) {
    console.error("Erro ao buscar contrato:", error);
    return NextResponse.json(
      { error: "Erro ao buscar contrato" },
      { status: 500 }
    );
  }
}
