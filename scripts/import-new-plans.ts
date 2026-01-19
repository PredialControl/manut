import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const csvData = `Sistema / Ativo,Frequência,Atividade de Manutenção,Responsável
Antena Coletiva,Trimestral,"Verificar condições físicas, alinhamento, fixação e oxidação das hastes e cabos.",Manutenção Local 
Antena Coletiva,Anual,"Inspeção de conectores, divisores e amplificadores para evitar perda de sinal.",Empresa Especializada 
Bombas Hidráulicas,Semanal,Verificar se a bomba apresenta ruídos ou vibrações anormais.,Manutenção Local 
Bombas Hidráulicas,Quinzenal,Fazer rodízio das bombas via chave de alternância no painel.,Manutenção Local 
Bombas Hidráulicas,Mensal,"Manutenção técnica: selos mecânicos, alinhamento, correntes elétricas e vibração.",Empresa Especializada 
Quadros Elétricos,Bimestral,"Verificar pontos quentes, odor de queimado e integridade física dos painéis.",Empresa Especializada 
Quadros Elétricos,Anual,"Termografia, limpeza, reaperto de conexões e teste do disjuntor DR.",Empresa Especializada 
Churrasqueira,Semanal,"Limpeza geral, inspeção de queimadores, registros e válvulas de segurança.",Manutenção Local 
Cobertura,Quinzenal,"Limpar ralos, grelhas pluviais, calhas e condutores; remover detritos.",Manutenção Local 
Cobertura,Anual,"Inspeção da manta impermeável, telhas, rufos e proteção mecânica.",Empresa Especializada 
Descarga,Semestral,Verificar mechanisms internos da caixa acoplada.,Manutenção Local 
Elevadores,Diário,"Verificar nivelamento da cabina, botoeiras, ruídos e trepidações.",Manutenção Local 
Elevadores,Mensal,Manutenção preventiva mensal técnica conforme contrato.,Empresa Especializada 
Elevadores,Anual,Emissão do RIA (Relatório de Inspeção Anual).,Empresa Especializada 
Academia,Diário,"Higienização, limpeza e identificação de irregularidades nos aparelhos.",Manutenção Local 
Climatização,Mensal,Manutenção técnica preventiva e limpeza de filtros/serpentinas.,Empresa Especializada 
Climatização,Anual,Emissão de PMOC e ART do sistema.,Empresa Especializada 
Esquadrias (Alu/Ferro),Trimestral,"Limpeza, lubrificação de trilhos/dobradiças e busca por pontos de oxidação.",Manutenção Local 
Extintores,Mensal,"Inspeção de lacres, manômetros, validade da carga e acessibilidade.",Manutenção Local 
Extintores,Anual,Realizar a pressurização dos cilindros.,Empresa Especializada 
Fachada,Mensal,"Verificar estado das juntas de dilatação, rejuntes e vedação das janelas.",Manutenção Local 
Gerador de Energia,Quinzenal,Fazer teste de funcionamento sem carga por 15 minutos.,Manutenção Local 
Gerador de Energia,Trimestral,Realizar o teste com carga no gerador.,Empresa Especializada 
Hidrante,Semanal,"Verificar integridade dos componentes (mangueira, bico e chave storz).",Manutenção Local 
Hidrante,Semestral,Drenar a rede e trocar a água abrindo o ponto mais baixo.,Manutenção Local 
Iluminação Emerg.,Bimestral,Testar autonomia das luminárias pelo botão de teste.,Manutenção Local 
Instalações de Gás,Mensal,Ronda visual para identificar possíveis vazamentos.,Manutenção Local 
Instalações de Gás,Anual,Efetuar teste de estanqueidade nas tubulações com emissão de laudo.,Empresa Especializada 
Piscina,Diário,Limpeza física e medição/ajuste dos parâmetros químicos da água.,Manutenção Local 
Piscina,Semanal,Lavagem do filtro de areia.,Manutenção Local 
SDAI (Alarme),Diário,Verificar status da central (alarmes ou falhas no painel).,Manutenção Local 
SDAI (Alarme),Mensal,"Teste de laços, limpeza de detectores e teste de baterias.",Empresa Especializada 
Sistema Solar,Semanal,Limpeza dos vidros dos coletores (poeira/folhas) e inspeção de trincas.,Manutenção Local 
Hidráulica/Reserva,Diário,Verificar nível dos reservatórios e funcionamento das boias.,Manutenção Local 
Hidráulica/Reserva,Semestral,Limpeza/desinfecção dos reservatórios e análise de potabilidade.,Empresa Especializada 
SPDA (Para-raios),Mensal,"Verificar conexões, malhas e status dos protetores de surto (DPS).",Manutenção Local 
VRP (Válvulas),Semestral,Realizar o rodízio das válvulas redutoras de pressão.,Manutenção Local`;

function generateAcronym(name: string): string {
    return name
        .split(/\s+/)
        .map(word => word.substring(0, 3).toUpperCase())
        .join("-")
        .substring(0, 10);
}

async function main() {
    console.log("Iniciando importação do novo plano de manutenção...");

    const lines = csvData.split('\n').slice(1); // Pular cabeçalho

    const systems = new Set<string>();
    const rows: any[] = [];

    for (const line of lines) {
        if (!line.trim()) continue;

        // Regex simples para lidar com campos entre aspas contendo vírgulas
        const parts = line.match(/(".*?"|[^",\s][^",]*?|[^",\s])(?=\s*,|\s*$)/g);

        if (parts && parts.length >= 4) {
            const system = parts[0].trim();
            const frequency = parts[1].trim();
            const activity = parts[2].replace(/^"|"$/g, '').trim();
            const responsible = parts[3].trim();

            systems.add(system);
            rows.push({ system, frequency, activity, responsible });
        }
    }

    console.log(`Encontrados ${systems.size} sistemas/ativos.`);

    // 1. Criar Planos (MaintenancePlan)
    const planMap = new Map<string, string>();
    for (const system of Array.from(systems)) {
        const acronym = generateAcronym(system);
        const plan = await prisma.maintenancePlan.upsert({
            where: { acronym },
            update: { description: system },
            create: {
                acronym,
                description: system,
                category: "Geral"
            }
        });
        planMap.set(system, plan.id);
        console.log(`Plano criado/atualizado: ${system} (${acronym})`);
    }

    // 2. Criar Modelos de Tarefas (MaintenanceTaskTemplate)
    for (const row of rows) {
        const planId = planMap.get(row.system);
        if (!planId) continue;

        await prisma.maintenanceTaskTemplate.create({
            data: {
                planId,
                sistema: row.system,
                atividade: row.activity,
                periodicidade: row.frequency,
                responsavel: row.responsible,
            }
        });
    }

    console.log(`Importação concluída. ${rows.length} atividades importadas.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
