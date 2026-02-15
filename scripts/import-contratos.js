const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function importContratos() {
  const response = await fetch('https://tvuwrrovxzakxrhsplvd.supabase.co/rest/v1/contratos?select=*&order=nome.asc', {
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2dXdycm92eHpha3hyaHNwbHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NDUzOTYsImV4cCI6MjA3MTIyMTM5Nn0.SNrfj5xVp2olmyZT8IgFpHxciUTKmLYfykaLtbwT3Do',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2dXdycm92eHpha3hyaHNwbHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NDUzOTYsImV4cCI6MjA3MTIyMTM5Nn0.SNrfj5xVp2olmyZT8IgFpHxciUTKmLYfykaLtbwT3Do'
    }
  });
  const contratos = await response.json();
  console.log('Contratos encontrados no Supabase:', contratos.length);

  let created = 0, skipped = 0;

  for (const c of contratos) {
    const existing = await prisma.contract.findFirst({ where: { supabaseId: c.id } });
    if (existing) { skipped++; continue; }

    const acronym = c.nome.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 6);
    let finalAcronym = acronym;
    let suffix = 1;
    while (await prisma.contract.findUnique({ where: { acronym: finalAcronym } })) {
      finalAcronym = acronym + suffix;
      suffix++;
    }

    await prisma.contract.create({
      data: {
        name: c.nome.trim(),
        acronym: finalAcronym,
        address: c.endereco || null,
        sindico: c.sindico ? c.sindico.trim() : null,
        status: c.status === 'IMPLANTADO' ? 'Implantado' : 'Em implantacao',
        type: 'RONDA',
        periodicidade: c.periodicidade || null,
        tipoUso: c.tipo_uso || null,
        quantidadeTorres: c.quantidade_torres || null,
        observacoes: c.observacoes || null,
        supabaseId: c.id,
      }
    });
    created++;
    console.log('Criado:', c.nome.trim(), '(' + finalAcronym + ')');
  }

  console.log('\nResultado: ' + created + ' criados, ' + skipped + ' ja existiam');
  await prisma.$disconnect();
}

importContratos().catch(e => { console.error(e); process.exit(1); });
