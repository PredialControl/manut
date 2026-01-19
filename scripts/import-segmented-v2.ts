import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const maintenanceData = [
    // FOLHA 6
    {
        plan: "Fachada",
        tasks: [
            { frequency: "Mensalmente", activity: "Verificar o estado dos elementos da fachada, brise, juntas de dilatação, rejunte, vedação das janelas", responsible: "Manutenção Local" },
            { frequency: "Anualmente", activity: "Inspeção dos selantes das juntas de esquadrias, peitoris e encontros de materiais; Identificação de ressecamento, perda de elasticidade ou destacamento", responsible: "Empresa Especializada" },
            { frequency: "A cada 3 anos", activity: "Limpeza e Pintura da fachada; Verificação de peças ocas (som cavo) para detecção de desplacamento; Rejuntamento em áreas degradadas", responsible: "Empresa Especializada" }
        ]
    },
    {
        plan: "Gerador de Água Quente",
        tasks: [
            { frequency: "Diariamente", activity: "Verificação do estado físico de boilers, aquecedores e trocadores; Identificação de vazamentos em conexões ou tubulações; Verificação das bombas de recirculação e temperatura dos queimadores", responsible: "Manutenção Local" },
            { frequency: "Mensalmente", activity: "Fazer a manutenção preventiva mensal dos equipamentos", responsible: "Empresa Especializada" },
            { frequency: "Anualmente", activity: "Emissão do Relatório de Manutenção dos equipamentos", responsible: "Empresa Especializada" }
        ]
    },
    {
        plan: "Gerador de Energia",
        tasks: [
            { frequency: "Semanalmente", activity: "Verificar o nível de combustível do reservatório e, se necessário, complementar", responsible: "Manutenção Local" },
            { frequency: "Quinzenalmente", activity: "Fazer teste sem carga, por 15 minutos", responsible: "Manutenção Local" },
            { frequency: "Mensalmente", activity: "Controlar a frequência das inspeções e manutenções da empresa contratada.", responsible: "Manutenção Local" },
            { frequency: "Mensalmente ", activity: "Fazer a manutenção preventiva mensal dos equipamentos", responsible: "Empresa Especializada" },
            { frequency: "A cada 3 meses", activity: "Fazer o teste com carga no gerador", responsible: "Empresa Especializada" },
            { frequency: "Anualmente", activity: "Comparar os gases de saída do motor com os padrões da densidade calorimétrica da Escala Ringelmann", responsible: "Empresa Especializada" }
        ]
    },
    // FOLHA 7
    {
        plan: "Hidrante",
        tasks: [
            { frequency: "Diariamente", activity: "Verificar se o lacre do hidrante foi rompido", responsible: "Manutenção Local" },
            { frequency: "Semanalmente", activity: "Verificar se o hidrante está com todos os componentes (mangueira, bico e chave storz)", responsible: "Manutenção Local" },
            { frequency: "Semestralmente", activity: "Abrir o ponto mais baixo do hidrante para drenar a rede e trocar a água", responsible: "Manutenção Local" }
        ]
    },
    {
        plan: "Iluminação de Emergência",
        tasks: [
            { frequency: "A cada 2 meses", activity: "Testar a iluminação pelo botão de teste do bloco autônomo", responsible: "Manutenção Local" },
            { frequency: "Semestralmente", activity: "Fazer teste de funcionamento das luminárias. Para isso basta desligar a luminária da tomada ou desativar o disjuntor correspondente.", responsible: "Manutenção Local" }
        ]
    },
    {
        plan: "Interfone",
        tasks: [
            { frequency: "Mensalmente", activity: "Verificação de funcionamento dos aparelhos telefônicos, trocando-o caso necessário; Controlar a frequência das inspeções e manutenções da empresa contratada.", responsible: "Manutenção Local" },
            { frequency: "Mensalmente ", activity: "Fazer a manutenção preventiva mensal dos equipamentos", responsible: "Empresa Especializada" }
        ]
    },
    {
        plan: "Instalações de Gás",
        tasks: [
            { frequency: "Mensalmente", activity: "Fazer ronda para verificar se há algum vazamento", responsible: "Manutenção Local" },
            { frequency: "Anualmente", activity: "Efetuar teste de estanqueidade nas tubulações de gás.", responsible: "Empresa Especializada" },
            { frequency: "A cada 3 anos", activity: "Trocar todas as mangueiras de gás", responsible: "Empresa Especializada" }
        ]
    },
    {
        plan: "Irrigação",
        tasks: [
            { frequency: "Quinzenalmente", activity: "Verificar o funcionamento dos dispositivos de irrigação (aspersores, gotejadores), o volume e periodicidade das regas; Verificação de tubulações expostas, conexões e válvulas; Identificação de vazamentos, erosões e áreas com acúmulo de água", responsible: "Manutenção Local" },
            { frequency: "Mensalmente", activity: "Limpeza dos bicos para remoção de sujeira e incrustações; Ajuste do alcance e direção dos aspersores; Teste de funcionamento das válvulas de irrigação", responsible: "Empresa Especializada" }
        ]
    },
    // FOLHA 8
    {
        plan: "Janela Maxim-Air",
        tasks: [
            { frequency: "A cada 3 meses", activity: "Lubrificação dos braços articulados e dobradiças; Inspeção dos fechos e trincos para evitar folgas excessivas; Teste do curso de abertura completa e parcial", responsible: "Manutenção Local" },
            { frequency: "Anualmente", activity: "Ajuste da tensão do braço para garantir abertura equilibrada; Verificação das borrachas de vedação (EPDM) quanto a ressecamento, deformação ou desgaste; Substituição de borrachas danificadas; Aperto de parafusos e suportes metálicos", responsible: "Empresa Especializada" }
        ]
    },
    {
        plan: "Junta de Dilatação",
        tasks: [
            { frequency: "A cada 6 meses", activity: "Inspeção de ressecamento, rachaduras ou perda de elasticidade; Verificação de infiltração após chuvas intensas", responsible: "Manutenção Local" },
            { frequency: "Anualmente", activity: "Teste de aderência do selante às bordas da junta; Substituição de selantes comprometidos", responsible: "Empresa Especializada" }
        ]
    },
    {
        plan: "Leitura diária",
        tasks: [
            { frequency: "Diariamente", activity: "Fazer leitura do consumo de água e gás da área comum", responsible: "Manutenção Local" }
        ]
    },
    {
        plan: "Mangueiras de Incêndio",
        tasks: [
            { frequency: "Semanalmente", activity: "Inspeção mensal de lacres e condições externas; Verificação de data de validade do teste hidrostático; Verificação do estado físico (dobras, cortes, deformações); Verificação de abrigo, acoplamento, registro, chave storz e sinalização", responsible: "Manutenção Local" },
            { frequency: "Anualmente", activity: "Submeter mangueira ao teste hidrostático", responsible: "Empresa Especializada" }
        ]
    },
    // FOLHA 9
    {
        plan: "PCF",
        tasks: [
            { frequency: "Mensalmente", activity: "Limpeza dos alojadores de trincos, do piso e do batente", responsible: "Manutenção Local" },
            { frequency: "A cada 2 meses", activity: "Aplicar óleo lubrificante nas dobradiças e maçanetas para garantir o seu perfeito funcionamento", responsible: "Manutenção Local" },
            { frequency: "A cada 3 meses", activity: "Teste das molas aéreas ou embutidas (molas hidráulicas);", responsible: "Manutenção Local" },
            { frequency: "Anualmente", activity: "Ajuste de velocidade de fechamento e impacto final; Substituição de molas danificadas ou com vazamento de óleo; Substituição de barras danificadas ou com falhas; Ajuste de travas e fechos", responsible: "Empresa Especializada" }
        ]
    },
    {
        plan: "Piscina",
        tasks: [
            { frequency: "Diariamente", activity: "Fazer a limpeza da piscina e medição dos parâmetros da água", responsible: "Empresa Especializada" },
            { frequency: "Semanalmente", activity: "Lavar o filtro de areia", responsible: "Empresa Especializada" },
            { frequency: "Anualmente", activity: "Trocar a areia dos filtros", responsible: "Empresa Especializada" },
            { frequency: "Mensalmente", activity: "Inspeção de rejuntes, pastilhas, cerâmicas e pedras; Verifique o estado do rejuntamento e se há revestimentos soltos ou trincados; Verificação da impermeabilização perimetral", responsible: "Manutenção Local" }
        ]
    },
    {
        plan: "Piso Intertravado",
        tasks: [
            { frequency: "A cada 2 meses", activity: "Retirar grama e ervas daninhas das juntas dos pisos, caso venham crescer; Aplicação de herbicida apropriado", responsible: "Manutenção Local" },
            { frequency: "A cada 6 meses", activity: "Reposição do pó de assentamento nas áreas que sofreram recalque", responsible: "Manutenção Local" },
            { frequency: "Anualmente", activity: "Substituição de peças quebradas, lascadas ou desgastadas; Compactação da base e sub-base sempre que necessário; Correção de desníveis para evitar tropeços e pontos de poças", responsible: "Empresa Especializada" }
        ]
    },
    // FOLHA 10
    {
        plan: "Playground",
        tasks: [
            { frequency: "Mensalmente", activity: "Verificar a integridade dos brinquedos; Aperto de parafusos, conexões e suportes; Verificação de corrosão, empenamento ou fissuras; Inspeção de soldas e trincas; Avaliação do estado de pintura e proteção anticorrosiva", responsible: "Manutenção Local" },
            { frequency: "Anualmente", activity: "Substituição de peças quebradas ou desgastadas; Reparos ou repintura quando houver desgaste; Correção de superfícies ásperas (lixamento; Aplicação de verniz, stain ou tratamento protetor", responsible: "Empresa Especializada" }
        ]
    },
    {
        plan: "Poço (gordura, esgoto, pluvial)",
        tasks: [
            { frequency: "Quinzenalmente", activity: "Verificar o funcionamento da bomba", responsible: "Manutenção Local" },
            { frequency: "Semestralmente", activity: "Fazer a limpeza do poço e desobstrução das redes", responsible: "Empresa Especializada" }
        ]
    },
    {
        plan: "Pontos de Ancoragem",
        tasks: [
            { frequency: "Semestralmente", activity: "Verificar se existem componentes faltando, com defeito ou com partes danificadas", responsible: "Manutenção Local" },
            { frequency: "Anualmente", activity: "Fazer ensaio de resistência e emitir relatório", responsible: "Empresa Especializada" }
        ]
    }
];

function generateAcronym(name: string): string {
    return name
        .split(/\s+/)
        .map(word => word.substring(0, 3).toUpperCase())
        .join("-")
        .substring(0, 10);
}

async function main() {
    console.log("🚀 Iniciando importação estruturada (Folhas 6-10)...");

    for (const item of maintenanceData) {
        const acronym = generateAcronym(item.plan);

        const plan = await prisma.maintenancePlan.upsert({
            where: { acronym },
            update: { description: item.plan },
            create: {
                acronym,
                description: item.plan,
                category: "Geral"
            }
        });

        console.log(`📦 Plano: ${item.plan} (${acronym})`);

        for (const task of item.tasks) {
            await prisma.maintenanceTaskTemplate.create({
                data: {
                    planId: plan.id,
                    sistema: item.plan,
                    atividade: task.activity,
                    periodicidade: task.frequency,
                    responsavel: task.responsible,
                }
            });
            console.log(`  - Tarefa ${task.frequency} adicionada.`);
        }
    }

    console.log("✅ Importação estruturada (Folhas 6-10) concluída!");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
