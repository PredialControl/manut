import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Dados extraídos das imagens enviadas
const maintenanceData = [
    // FOLHA 1
    {
        plan: "Antena Coletiva",
        tasks: [
            { frequency: "A cada 3 meses", activity: "Verificar condições físicas das antenas externas; Conferir alinhamento, fixação e integridade das hastes; Inspecionar oxidação, corrosão ou desgaste mecânico", responsible: "Manutenção Local" },
            { frequency: "Anualmente", activity: "Avaliar cabos coaxiais expostos a intempéries; Inspeção de conectores e emendas para evitar perda de sinal; Verificação de divisores, taps e amplificadores; Aperto e revisão dos pontos de conexão", responsible: "Empresa Especializada" }
        ]
    },
    {
        plan: "Bombas Hidráulicas",
        tasks: [
            { frequency: "Semanalmente", activity: "Verificar se a bomba apresenta ruídos ou vibrações anormais", responsible: "Manutenção Local" },
            { frequency: "Quinzenalmente", activity: "Fazer rodízio das bombas, por meio da chave de alternância no painel elétrico", responsible: "Manutenção Local" },
            { frequency: "Mensalmente", activity: "Verificação de ruídos anormais, vibrações ou aquecimento excessivo; Inspeção do alinhamento do conjunto motor/bomba; Verificação de vazamentos nos vedantes, flanges e conexões; Inspeção das condições das bases, amortecedores e suportes; Verificação das válvulas de sucção e recalque; Inspeção e limpeza dos pré-filtro, quando aplicável; Teste de retenção das válvulas de retenção; Verificação dos selos mecânicos e substituição quando necessário; Avaliação da integridade do eixo, rotor e carcaça; Medição da vibração do conjunto; Verificação de corrente, tensão e equilíbrio entre fases; Limpeza dos contatores, relés e disjuntores; Inspeção dos cabos e conexões elétricas; Teste de partida e parada; Teste de alternância automática entre bombas", responsible: "Empresa Especializada" }
        ]
    },
    // FOLHA 2
    {
        plan: "Cabine e Quadros elétricos",
        tasks: [
            { frequency: "A cada 2 meses", activity: "Verificação das condições físicas dos painéis; Identificação de pontos quentes, odor de queimado ou sinais de superaquecimento; Avaliação de integridade das portas, travas, segregações e proteções; Testar o disjuntor tipo DR apertando o botão localizado no próprio aparelho; Fazer a limpeza do quadro e o reaperto dos cabos e conexões; Inspeção do sistema de aterramento e continuidade", responsible: "Empresa Especializada" },
            { frequency: "Anualmente", activity: "Fazer uma termografia no quadro para verificar se há pontos de aquecimento; Fazer limpeza e reaperto da cabine primária (PAME)", responsible: "Empresa Especializada" },
            { frequency: "A cada 3 anos", activity: "Verificar e, se necessário, efetuar a troca das conexões (tomadas, interruptores, pontos de luz e outros)", responsible: "Empresa Especializada" }
        ]
    },
    {
        plan: "Churrasqueira",
        tasks: [
            { frequency: "Semanalmente", activity: "Limpeza geral, inclusive das grelhas; Inspeção da tampa (quando existente), portas e dobradiças; Avaliação de fissuras ou desgastes no revestimento; Verificação da integridade da bancada e pontos de apoio; Avaliação dos queimadores e acendimento; Conferência de registros e válvulas de segurança; Verificação de cabos e conexões; Checagem de botões, termostatos e dispositivos de proteção; Verificar os revestimentos, tijolos refratários e, havendo necessidade, providenciar reparos", responsible: "Manutenção Local" }
        ]
    },
    // FOLHA 3
    {
        plan: "Cobertura",
        tasks: [
            { frequency: "Quinzenalmente", activity: "Verificar e limpar os ralo e grelhas das águas pluviais, calhas e canaletas; Verificação de desprendimento ou corrosão das peças; Inspeção visual da manta ou revestimento impermeável; Conferência das áreas de proteção mecânica (argamassa, piso, placas).", responsible: "Manutenção Local" },
            { frequency: "Anualmente", activity: "Revisão dos telhados com substituição de peças quebradas (telhas, cumeeiras, rufos, ferragens) e reposição de peças deslocadas; Verificar a integridade dos sistemas de impermeabilização e reconstitua a proteção mecânica", responsible: "Empresa Especializada" }
        ]
    },
    {
        plan: "Descarga",
        tasks: [
            { frequency: "Semestralmente", activity: "Verificar mecanismos internos da caixa acoplada; Limpar e verificar a regulagem dos mecanismos de descarga.", responsible: "Manutenção Local" },
            { frequency: "Anualmente", activity: "Verificar a estanqueidade da válvula de descarga.", responsible: "Manutenção Local" }
        ]
    },
    {
        plan: "Elevadores",
        tasks: [
            { frequency: "Diariamente", activity: "Verificar o nivelamento da cabina, botoeiras, presença de ruídos, trepidações durante o trajeto e solicitar reparo se necessário", responsible: "Manutenção Local" },
            { frequency: "Mensalmente", activity: "Controlar a frequência das inspeções e manutenções da empresa contratada.", responsible: "Manutenção Local" },
            { frequency: "Mensalmente ", activity: "Fazer a manutenção preventiva mensal dos equipamentos", responsible: "Empresa Especializada" },
            { frequency: "Anualmente", activity: "Emissão do RIA (Relatório de Inspeção Anual)", responsible: "Empresa Especializada" }
        ]
    },
    {
        plan: "Equipamentos Academia",
        tasks: [
            { frequency: "Diariamente", activity: "Higienização e limpeza dos equipamentos e identificação de pequenas irregularidades", responsible: "Manutenção Local" },
            { frequency: "Mensalmente", activity: "Controlar a frequência das inspeções e manutenções da empresa contratada.", responsible: "Manutenção Local" },
            { frequency: "Mensalmente  ", activity: "Fazer a manutenção preventiva mensal dos equipamentos", responsible: "Empresa Especializada" }
        ]
    },
    // FOLHA 4
    {
        plan: "Equipamentos de Climatização",
        tasks: [
            { frequency: "Semanalmente", activity: "Ligar o equipamento para verificar o funcionamento", responsible: "Manutenção Local" },
            { frequency: "Mensalmente", activity: "Controlar a frequência das inspeções e manutenções da empresa contratada.", responsible: "Manutenção Local" },
            { frequency: "Mensalmente   ", activity: "Fazer a manutenção preventiva mensal dos equipamentos", responsible: "Empresa Especializada" },
            { frequency: "Anualmente", activity: "Manter contrato de manutenção e conservação com empresa especializada; Solicitar para a empresa contratada o PMOC e ART", responsible: "Empresa Especializada" }
        ]
    },
    {
        plan: "Esquadrias de Alumínio",
        tasks: [
            { frequency: "A cada 3 meses", activity: "Efetuar limpeza geral das esquadrias e seus componentes; Passar spray lubrificante ou similar, em todas as esquadrias; Verificar a presença de fissuras, falhas na vedação e fixação nos caixilhos e reconstituir sua integridade onde for necessário", responsible: "Manutenção Local" },
            { frequency: "Anualmente", activity: "Verificação das borrachas de vedação (EPDM) e escovinhas; Substituição de borrachas ressecadas ou soltas; Inspeção de silicones e arremates de vedação; Verificação de ferragens, parafusos e suportes metálicos; Conferência dos calços e das fitas de vedação do vidro", responsible: "Empresa Especializada" }
        ]
    },
    {
        plan: "Esquadrias de Ferro",
        tasks: [
            { frequency: "A cada 3 meses", activity: "Verificar as esquadrias para identificação de pontos de oxidação; Verificação de trincas, deformações ou empenamentos; Inspeção da fixação das esquadrias à alvenaria; Lubrificação de dobradiças, roldanas, batentes e trilhos", responsible: "Manutenção Local" },
            { frequency: "Anualmente", activity: "Ajuste de folgas em portas e janelas; Remoção de pontos de ferrugem com escova de aço ou lixa; Repintura das áreas afetadas ou aplicação de demãos completas, conforme necessidade; Verificação das borrachas de vedação; Inspeção dos calços e suporte dos vidros; Aperto de parafusos e presilhas metálicas", responsible: "Empresa Especializada" }
        ]
    },
    // FOLHA 5
    {
        plan: "Esquadrias de Madeira",
        tasks: [
            { frequency: "A cada 3 meses", activity: "Verificação de empenamento, rachaduras ou trincas; Avaliação do estado das fibras da madeira; Identificação de desgastes ou danos por impacto; Lubrificação de dobradiças, trincos e fechaduras", responsible: "Manutenção Local" },
            { frequency: "Anualmente", activity: "Ajuste do alinhamento entre folha e batente; Avaliação da integridade da pintura, verniz ou stain; Lixamento e reaplicação de acabamento quando desgastado; Aplicação de camadas protetivas contra umidade e raios UV; Verificar falhas de vedação, fixação das esquadrias e reconstituir sua integridade, onde for necessário.", responsible: "Empresa Especializada" }
        ]
    },
    {
        plan: "Exaustores",
        tasks: [
            { frequency: "Mensalmente", activity: "Teste de funcionamento do motor elétrico; Verificação de ruídos e vibrações excessivas", responsible: "Manutenção Local" },
            { frequency: "Anualmente", activity: "Lubrificação dos mancais e rolamentos; Medição de corrente elétrica e temperatura do motor; Limpeza completa das pás, removendo poeira, gordura ou resíduos; Verificação de empenamento ou trincas; Checagem do quadro de comando associado; Medição da pressão diferencial", responsible: "Empresa Especializada" }
        ]
    },
    {
        plan: "Extintores",
        tasks: [
            { frequency: "Semanalmente", activity: "Inspeção mensal de lacres, pinos, manômetros e condições externas", responsible: "Manutenção Local" },
            { frequency: "Mensalmente", activity: "Verificação da pressão interna conforme o manômetro; Verificação de data de validade da carga e do teste hidrostático; Inspeção de suportes, fixações, sinalização e acessibilidade", responsible: "Manutenção Local" },
            { frequency: "Anualmente", activity: "Fazer a pressurização dos extintores", responsible: "Empresa Especializada" },
            { frequency: "A cada 5 anos", activity: "Submeter o extintor a vistoria conforme a data do teste hidrostático", responsible: "Empresa Especializada" }
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
    console.log("🚀 Iniciando importação estruturada (Folhas 1-5)...");

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

    console.log("✅ Importação estruturada (Folhas 1-5) concluída!");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
