import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Buscar contratos do Supabase
    const { data: contratosSupabase, error } = await supabase
      .from("contratos")
      .select("*")
      .order("nome", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!contratosSupabase || contratosSupabase.length === 0) {
      return NextResponse.json({ message: "Nenhum contrato encontrado no Supabase" });
    }

    const results = { created: 0, skipped: 0, errors: [] as string[] };

    for (const c of contratosSupabase) {
      // Verificar se já existe pelo supabaseId
      const existing = await prisma.contract.findUnique({
        where: { supabaseId: c.id },
      });

      if (existing) {
        results.skipped++;
        continue;
      }

      // Gerar sigla a partir do nome (primeiras letras de cada palavra)
      const acronym = c.nome
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 6);

      // Verificar se sigla já existe e adicionar sufixo se necessário
      let finalAcronym = acronym;
      let suffix = 1;
      while (await prisma.contract.findUnique({ where: { acronym: finalAcronym } })) {
        finalAcronym = `${acronym}${suffix}`;
        suffix++;
      }

      try {
        await prisma.contract.create({
          data: {
            name: c.nome,
            acronym: finalAcronym,
            address: c.endereco || null,
            sindico: c.sindico || null,
            status: c.status === "IMPLANTADO" ? "Implantado" : "Em implantação",
            type: "RONDA",
            periodicidade: c.periodicidade || null,
            tipoUso: c.tipo_uso || null,
            quantidadeTorres: c.quantidade_torres || null,
            observacoes: c.observacoes || null,
            supabaseId: c.id,
          },
        });
        results.created++;
      } catch (err: any) {
        results.errors.push(`${c.nome}: ${err.message}`);
      }
    }

    return NextResponse.json({
      message: `Importação concluída: ${results.created} criados, ${results.skipped} já existiam`,
      ...results,
      total: contratosSupabase.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
