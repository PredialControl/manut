import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Schema para validar cada linha do CSV
const constructionItemSchema = z.object({
  numero: z.string().min(1, "Número é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  status: z.enum(["EM_ANDAMENTO", "FINALIZADO", "CONCLUIDO", "AGUARDANDO_VISTORIA", "IMPROCEDENTE"]),
  data_abertura: z.string().refine((date) => !isNaN(Date.parse(date)), "Data de abertura inválida"),
  prazo: z.string().optional().refine((date) => !date || date === '' || !isNaN(Date.parse(date)), "Prazo inválido"),
  retorno: z.string().optional(),
});

function parseCSV(text: string): string[][] {
  const lines = text.split('\n')
    .filter(line => line.trim()) // Remove linhas vazias
    .filter(line => !line.match(/^[;,\s]*$/)); // Remove linhas que só têm separadores e espaços
    
  return lines.map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    // Substituir ; por , se necessário (alguns CSVs usam ;)
    line = line.replace(/;/g, ',');
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    values.push(current.trim());
    return values.filter(val => val !== ''); // Remove valores vazios
  }).filter(row => row.length > 0); // Remove linhas completamente vazias
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/construction-items/import - Iniciando...');
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const contractId = formData.get('contractId') as string;

    console.log('File:', file?.name, 'ContractId:', contractId);

    if (!file || !contractId) {
      console.log('Erro: Arquivo ou contractId ausente');
      return NextResponse.json(
        { error: "Arquivo e ID do contrato são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se o contrato existe
    const contract = await prisma.contract.findUnique({
      where: { id: contractId }
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contrato não encontrado" },
        { status: 404 }
      );
    }

    // Ler o arquivo
    const text = await file.text();
    console.log('Conteúdo do arquivo (primeiros 200 chars):', text.substring(0, 200));
    
    // Parse do CSV
    const rows = parseCSV(text);
    console.log('Linhas parseadas:', rows.length);
    console.log('Primeiras 5 linhas:', rows.slice(0, 5));
    
    if (rows.length === 0) {
      console.log('Erro: Arquivo CSV vazio');
      return NextResponse.json(
        { error: "Arquivo CSV vazio" },
        { status: 400 }
      );
    }

    // Procurar linha com cabeçalhos (que contém 'numero')
    let headerIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row.some(cell => cell.toLowerCase().includes('numero'))) {
        headerIndex = i;
        break;
      }
    }
    
    if (headerIndex === -1) {
      console.log('Erro: Cabeçalhos não encontrados');
      return NextResponse.json(
        { error: "Cabeçalhos não encontrados. Certifique-se que há uma linha com 'numero', 'descricao', etc." },
        { status: 400 }
      );
    }

    console.log('Cabeçalhos encontrados na linha:', headerIndex + 1);
    const headers = rows[headerIndex].map(h => h.toLowerCase().trim());
    const dataRows = rows.slice(headerIndex + 1).filter(row => row.length >= 4); // Só linhas com dados suficientes

    // Verificar se os cabeçalhos necessários estão presentes
    const requiredHeaders = ['numero', 'descricao', 'status', 'data_abertura'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      return NextResponse.json(
        { error: `Cabeçalhos obrigatórios faltando: ${missingHeaders.join(', ')}` },
        { status: 400 }
      );
    }

    // Processar cada linha
    const validItems = [];
    const errors = [];

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const rowNumber = i + 2; // +2 porque começamos da linha 2 (1 é header)

      try {
                 // Criar objeto baseado nos headers
         const rowData: any = {};
         headers.forEach((header, index) => {
           const value = row[index]?.trim() || '';
           // Para campos opcionais, não incluir se estiver vazio
           if (value === '' && (header === 'prazo' || header === 'retorno')) {
             return; // não adiciona ao objeto
           }
           rowData[header] = value;
         });
         
         console.log(`Linha ${i + 2} dados:`, rowData);

        // Validar com Zod
        const validatedData = constructionItemSchema.parse(rowData);

        // Verificar se já existe item com esse número
        const existingItem = await prisma.constructionItem.findFirst({
          where: {
            number: validatedData.numero,
            contractId: contractId
          }
        });

        if (existingItem) {
          errors.push(`Linha ${rowNumber}: Item com número "${validatedData.numero}" já existe`);
          continue;
        }

        validItems.push({
          number: validatedData.numero,
          description: validatedData.descricao,
          status: validatedData.status,
          openedAt: new Date(validatedData.data_abertura),
          deadline: validatedData.prazo ? new Date(validatedData.prazo) : null,
          feedback: validatedData.retorno || null,
          contractId: contractId,
        });

      } catch (error) {
        if (error instanceof z.ZodError) {
          const messages = (error as any).errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
          errors.push(`Linha ${rowNumber}: ${messages}`);
        } else {
          errors.push(`Linha ${rowNumber}: Erro inesperado`);
        }
      }
    }

    // Se houver erros, retornar lista de erros
    if (errors.length > 0 && validItems.length === 0) {
      return NextResponse.json(
        { error: "Nenhum item válido encontrado", details: errors },
        { status: 400 }
      );
    }

    // Inserir itens válidos no banco
    let insertedCount = 0;
    
    if (validItems.length > 0) {
      const result = await prisma.constructionItem.createMany({
        data: validItems as any,
      });
      insertedCount = result.count;
    }

    return NextResponse.json({
      success: true,
      count: insertedCount,
      errors: errors.length > 0 ? errors : undefined,
      message: errors.length > 0 
        ? `${insertedCount} itens importados com sucesso. ${errors.length} itens com erro.`
        : `${insertedCount} itens importados com sucesso!`
    });

  } catch (error) {
    console.error('Erro no import:', error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
} 