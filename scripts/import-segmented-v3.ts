import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const maintenanceData = [
    // FOLHA 11
    {
        plan: "Portões",
        tasks: [
            { frequency: "Semanalmente", activity: "Verificação do estado das cremalheiras, roldanas, trilhos e guias", responsible: "Manutenção Local" },
            { frequency: "Mensalmente", activity: "Realizar a lubrificação periódica dos trilhos do motor e das fechaduras; Controlar a visita da empresa contratada para preventiva", responsible: "Manutenção Local" },
            { frequency: "Mensalmente ", activity: "Ajuste de folgas e alinhamento das estruturas móveis; Avaliação de desgaste por atrito ou corrosão; Análise do ponto de parada e do curso de abertura/fechamento; Ajuste e lubrificação de dobradiças, parafusos e articulações; Verificação da integridade do motor e nível de ruído; Teste de fotocélulas e sensores antiesmagamento; Verificação do funcionamento do sistema de parada de emergência; Teste de sensores magnéticos e travas eletromagnéticas", responsible: "Empresa Especializada" }
        ]
    },
    {
        plan: "Pressurização de Escadas",
        tasks: [
            { frequency: "Mensalmente", activity: "Teste de funcionamento do motor elétrico; Verificação de ruídos e vibrações excessivas; Controlar a visita da empresa contratada para manutenção preventiva", responsible: "Manutenção Local" },
            { frequency: "Mensalmente ", activity: "Fazer manutenção preventiva mensal nos ventiladores", responsible: "Empresa Especializada" },
            { frequency: "A cada 2 meses", activity: "Lubrificação dos mancais e rolamentos; Medição de corrente elétrica e temperatura do motor; Limpeza completa das pás, removendo poeira, gordura ou resíduos", responsible: "Empresa Especializada" },
            { frequency: "Anualmente", activity: "Verificação de empenamento ou trincas; Checagem do quadro de comando associado; Medição da pressão diferencial", responsible: "Empresa Especializada" }
        ]
    },
    {
        plan: "Ralos e Grelhas",
        tasks: [
            { frequency: "Mensalmente", activity: "Fazer a limpeza dos ralos e grelhas do empreendimento", responsible: "Manutenção Local" }
        ]
    },
    // FOLHA 12
    {
        plan: "Rejuntes",
        tasks: [
            { frequency: "Mensalmente", activity: "Avaliação manual para verificar se o rejunte esfarela com facilidade; Identificação de áreas com perda de compactação; Marcação dos trechos que necessitam substituição", responsible: "Manutenção Local" },
            { frequency: "Anualmente", activity: "Remoção parcial ou total do rejunte deteriorado; Limpeza e preparação das juntas antes da aplicação; Aplicação de novo rejunte", responsible: "Empresa Especializada" }
        ]
    },
    {
        plan: "Sauna Seca e Sauna Úmida",
        tasks: [
            { frequency: "Semanalmente", activity: "Regular e verificar a calibragem do termostato, conforme recomendação do fabricante", responsible: "Manutenção Local" },
            { frequency: "Mensalmente", activity: "Verificar o estado do madeiramento que fica próximo do trocador de calor; Inspeção da integridade do painel de comando", responsible: "Manutenção Local" }
        ]
    },
    {
        plan: "SDAI",
        tasks: [
            { frequency: "Diariamente", activity: "Verificar o status da central de alarme, se há algum alarme ou falha", responsible: "Manutenção Local" },
            { frequency: "Mensalmente", activity: "Controlar a visita da empresa contratada para manutenção preventiva", responsible: "Manutenção Local" },
            { frequency: "Mensalmente ", activity: "Verificação do estado físico dos detectores e acionadores manuais; Fazer a limpeza de todos os detectores de fumaça; Verificação do display, teclado e comunicação interna; Teste dos laços individualmente (loop test); Conferência do banco de baterias (tensão, autonomia e integridade); Verificação dos eventos registrados na memória da central; Verificação da comunicação entre módulos e a central", responsible: "Empresa Especializada" },
            { frequency: "Anualmente", activity: "Teste de falta de energia e funcionamento em modo bateria; Teste da saída de sirenes e módulos de acionamento; Emissão do relatório de inspeção e manutenção do SDAI", responsible: "Empresa Especializada" }
        ]
    },
    // FOLHA 13
    {
        plan: "Sistema de Aquecimento Solar",
        tasks: [
            { frequency: "Semanalmente", activity: "Inspeção da fixação e integridade dos coletores; Verificação de trincas, manchas ou danos no vidro", responsible: "Manutenção Local" },
            { frequency: "Mensalmente", activity: "Limpeza do vidro dos coletores para remoção de poeira, folhas e sujeira; Controlar a visita da empresa contratada para manutenção preventiva; Fazer a manutenção preventiva mensal; Verificação da integridade estrutural do reservatório; Inspeção de válvulas de alívio e segurança; Teste da bomba de circulação; Checagem de válvulas de retenção e registros", responsible: "Empresa Especializada" }
        ]
    },
    {
        plan: "Sistema Hidráulico e Reservatórios",
        tasks: [
            { frequency: "Diariamente", activity: "Verificar o nível dos reservatórios, o funcionamento das torneiras de boia e a chave de boia para controle de nível", responsible: "Manutenção Local" },
            { frequency: "Semestralmente", activity: "Fazer a limpeza do reservatório e solicitar para a empresa o laudo da limpeza; Inspeção estrutural das paredes, fundo e tampas; Avaliação da integridade das tubulações de entrada e saída; Abertura e fechamento de todos os registros; Fazer análise de potabilidade da água do empreendimento", responsible: "Empresa Especializada" }
        ]
    },
    {
        plan: "SPDA",
        tasks: [
            { frequency: "Mensalmente", activity: "Verificar conexões e malhas, se estão todas integras e sem oxidação; Verificar o status dos dispositivos de proteção contra surtos (DPS)", responsible: "Manutenção Local" },
            { frequency: "Anualmente", activity: "Fazer medições e solicitar relatório de SPDA conforme NBR-5419", responsible: "Empresa Especializada" }
        ]
    },
    {
        plan: "VRP",
        tasks: [
            { frequency: "Mensalmente", activity: "Verificar a estanqueidade e a pressão especificada para a válvula redutora de pressão", responsible: "Manutenção Local" },
            { frequency: "Semestralmente", activity: "Fazer o rodízio das VRPs", responsible: "Manutenção Local" },
            { frequency: "Anualmente", activity: "Fazer a limpeza e manutenção preventiva das VRPs", responsible: "Empresa Especializada" }
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
    console.log("🚀 Iniciando importação estruturada (Folhas 11-13)...");

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

    console.log("✅ Importação estruturada (Folhas 11-13) concluída!");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
