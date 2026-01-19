import prisma from "@/lib/prisma";
import { PlansClient } from "./_components/plans-client";
import { AddPlanDialog } from "./_components/add-plan-dialog";

export type ChecklistItem = {
  id: string;
  description: string;
};

export type MaintenanceTaskTemplate = {
  id: string;
  sistema?: string;
  atividade?: string;
  periodicidade?: string;
  responsavel?: string;
  checklist: ChecklistItem[];
};

export type FormattedPlan = {
  id: string;
  acronym: string;
  name: string;
  category: string;
  sistema: string;
  periodicidade: string;
  atividade: string;
  taskCount: number;
  tasks: MaintenanceTaskTemplate[];
  description: string;
};

export type FormattedTask = {
  id: string;
  description: string;
  frequency: string;
  assetName: string;
  assetTag: string;
  location: string;
};

export default async function MaintenancePlansPage() {
  const plans = await prisma.maintenancePlan.findMany({
    include: {
      tasks: {
        include: {
          checklist: true,
        },
      },
    },
    orderBy: {
      category: "asc",
    },
  });

  // Mapeamento manual dos dados dos planos
  const planDataMap: Record<string, { sistema: string; periodicidade: string; atividade: string }> = {
    "BEP": { sistema: "Bomba de Esgoto Predial", periodicidade: "Mensal", atividade: "Limpeza do poço; Teste de boias; Acionamento manual e automático; Checagem de ruídos e vibração" },
    "BAP": { sistema: "Bomba de Água Potável / Recalque", periodicidade: "Mensal", atividade: "Verificar pressão; Testar pressostato; Checar ruídos e vazamentos; Teste de partida" },
    "BHI": { sistema: "Bomba de Hidrante / Incêndio", periodicidade: "Mensal", atividade: "Testar com hidrante aberto; Checar pressão e vazão; Verificar jockey; Inspecionar registros e válvulas" },
    "BMP": { sistema: "Bomba de Pressurização de Escada", periodicidade: "Mensal", atividade: "Testar acionamento por abertura de porta; Verificar inversor; Checar parada automática" },
    "BRF": { sistema: "Bomba de Flushing", periodicidade: "Trimestral", atividade: "Limpeza de filtros; Teste de funcionamento; Verificar estanqueidade" },
    "BGLP": { sistema: "Bomba de Gás GLP", periodicidade: "Trimestral", atividade: "Verificar reguladores; Testar pressostatos; Inspecionar sensores de gás" },
    "BAC": { sistema: "Bomba de Água de Condensado", periodicidade: "Trimestral", atividade: "Verificar linha de drenagem; Testar funcionamento; Limpeza" },
    "BCP": { sistema: "Bomba de Circulação Predial", periodicidade: "Mensal", atividade: "Verificar pressão e retorno; Inspecionar motor e selo; Testar automático/manual" },
    "BAF": { sistema: "Bomba de Água Fria", periodicidade: "Mensal", atividade: "Inspeção de funcionamento; Teste de pressão; Checagem de válvulas" },
    "BAQ": { sistema: "Bomba de Água Quente", periodicidade: "Mensal", atividade: "Checagem de temperatura; Verificar válvulas e selo mecânico; Lubrificação" },
    "BCH": { sistema: "Bomba da Casa de Máquinas Hidráulica", periodicidade: "Mensal", atividade: "Checar funcionamento de pressostato; Testar bomba e ruídos; Verificar mangueiras" },
    "QGBT": { sistema: "Quadro Geral de Baixa Tensão", periodicidade: "Semestral", atividade: "Termografia; Reaperto de conexões; Limpeza interna; Checar disjuntores" },
    "QD": { sistema: "Quadro de Distribuição", periodicidade: "Semestral", atividade: "Verificar disjuntores e DRs; Testar circuitos; Atualizar etiquetas" },
    "QDF": { sistema: "Quadro de Força", periodicidade: "Trimestral", atividade: "Testar contatores e relés; Reaperto; Termografia" },
    "QTA": { sistema: "Quadro de Transferência Automática", periodicidade: "Trimestral", atividade: "Simular falta de energia; Testar comutação; Verificar retorno para rede" },
    "QED": { sistema: "Quadro de Energia de Emergência", periodicidade: "Semestral", atividade: "Verificar circuitos prioritários; Testar funcionamento; Limpeza e reaperto" },
    "QDL": { sistema: "Quadro de Iluminação", periodicidade: "Semestral", atividade: "Teste de circuitos; Reaperto geral; Etiquetagem atualizada" },
    "QFT": { sistema: "Quadro de Tomadas", periodicidade: "Semestral", atividade: "Teste de tomadas; Verificação de disjuntores; Reaperto e organização de fiação" },
    "QCA": { sistema: "Quadro de Controle de Automação", periodicidade: "Trimestral", atividade: "Teste de sensores e CLPs; Atualização de lógica; Verificação de comunicação" },
    "QINC": { sistema: "Quadro de Incêndio", periodicidade: "Mensal", atividade: "Verificação de alimentação elétrica; Teste da bomba; Checagem de luzes piloto e alarmes" },
    "QCC": { sistema: "Quadro de Comando de Chiller", periodicidade: "Trimestral", atividade: "Verificação de comando e proteções; Teste de sensores; Checagem de alarmes" },
    "QAC": { sistema: "Quadro de Ar-Condicionado", periodicidade: "Trimestral", atividade: "Distribuição dos ACs; Verificação de disjuntores e cabos; Reaperto de conexões" },
    "QF": { sistema: "Quadro de Fachada", periodicidade: "Anual", atividade: "Inspeção geral; Verificação de medidores; Conformidade com concessionária" },
    "QEE": { sistema: "Quadro de Entrada de Energia", periodicidade: "Semestral", atividade: "Inspeção visual; Termografia; Checagem de barramentos e cabos" },
    "QG": { sistema: "Quadro Geral", periodicidade: "Semestral", atividade: "Limpeza geral; Reaperto de barramentos; Teste de disjuntores e fusíveis" },
    "QDP": { sistema: "Quadro de Proteção", periodicidade: "Semestral", atividade: "Verificação de disjuntores; Checagem de componentes de proteção; Etiquetagem" },
    "QDR": { sistema: "Quadro de Reversão", periodicidade: "Trimestral", atividade: "Verificar tempo de comutação; Testar partida de emergência; Checar comandos" },
    "QGCC": { sistema: "Quadro Geral de Chiller Central", periodicidade: "Semestral", atividade: "Inspeção de alimentação; Teste de intertravamento; Termografia" },
    "ACS": { sistema: "Ar-Condicionado Split", periodicidade: "Trimestral", atividade: "Limpeza de filtros e serpentina; Verificar dreno; Testar controle remoto" },
    "ACVRF": { sistema: "Ar-Condicionado VRF / VRV", periodicidade: "Trimestral", atividade: "Verificar unidades internas e externas; Checar gás refrigerante; Testar sensores" },
    "UTA": { sistema: "Unidade de Tratamento de Ar", periodicidade: "Trimestral", atividade: "Troca de filtros; Verificar motores e correias; Limpeza interna" },
    "VE": { sistema: "Ventilador de Exaustão", periodicidade: "Trimestral", atividade: "Testar funcionamento; Limpar hélice e carcaça; Verificar vibração" },
    "ACC": { sistema: "Ar-Condicionado Cassete", periodicidade: "Trimestral", atividade: "Limpeza de filtros; Verificar palhetas; Checar serpentina e dreno" },
    "ACF": { sistema: "Fan Coil", periodicidade: "Trimestral", atividade: "Checar motor; Limpar bandeja e serpentinas; Testar sensores" },
    "RAC": { sistema: "Rooftop Air Conditioner", periodicidade: "Trimestral", atividade: "Limpeza de filtros; Checagem de serpentina e compressor; Teste de pressostato" },
    "FAN": { sistema: "Fan Coil Unit", periodicidade: "Trimestral", atividade: "Limpeza interna; Verificação de ventiladores; Checagem da serpentina e bandeja" },
    "ACD": { sistema: "Ar-Condicionado tipo Duto / VRF", periodicidade: "Trimestral", atividade: "Limpeza de filtros; Verificação de gás; Checagem de sensores e automação" }
  };

  const formattedPlans: FormattedPlan[] = plans.map((plan) => {
    // Usar a primeira tarefa do plano para obter sistema, periodicidade e atividade
    const firstTask = plan.tasks[0];

    // Se não há tarefas, usar dados padrão baseados na sigla
    if (!firstTask) {
      const planData = planDataMap[plan.acronym] || { sistema: "N/A", periodicidade: "N/A", atividade: "N/A" };
      return {
        ...plan,
        name: plan.description,
        sistema: planData.sistema,
        periodicidade: planData.periodicidade,
        atividade: planData.atividade,
        taskCount: plan.tasks.length,
      };
    }

    // Usar dados reais da primeira tarefa
    const taskWithNewFields = firstTask as any; // Cast temporário para resolver tipo
    return {
      ...plan,
      name: plan.description,
      sistema: taskWithNewFields.sistema || "N/A",
      periodicidade: taskWithNewFields.periodicidade || "N/A",
      atividade: taskWithNewFields.atividade || "N/A",
      taskCount: plan.tasks.length,
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4">
        <div className="flex items-center justify-end">
          <AddPlanDialog />
        </div>
        <PlansClient data={formattedPlans} />
      </div>
    </div>
  );
} 