export interface MaintenanceTask {
  periodicity: string;
  details: string;
  isSpecialized?: boolean;
}

export interface MaintenanceInfo {
  description: string;
  category: string;
  tasks: MaintenanceTask[];
}

export const maintenanceData: { [key: string]: MaintenanceInfo } = {
  'BMB-REC': {
    description: 'Bomba de recalque',
    category: 'Bombas',
    tasks: [{ periodicity: 'Mensal', details: 'Inspecionar pressurização, estanqueidade, vibração, reaperto de conexões e funcionamento geral' }]
  },
  'BMB-DRE': {
    description: 'Bomba de drenagem / esgoto',
    category: 'Bombas',
    tasks: [{ periodicity: 'Mensal', details: 'Limpeza do poço de recalque, verificação de funcionamento da bomba e bóias de nível' }]
  },
  'BMB-PRS': {
    description: 'Bomba de pressurização',
    category: 'Bombas',
    tasks: [{ periodicity: 'Mensal', details: 'Verificação de pressão de saída, estanqueidade, conexões elétricas e funcionamento do pressostato' }]
  },
  'BMB-INC': {
    description: 'Bomba de incêndio',
    category: 'Bombas',
    tasks: [{ periodicity: 'Semanal', details: 'Teste manual e automático de partida, verificação de válvulas de retenção, pressão, reaperto de conexões, inspeção de ruídos e funcionamento geral' }]
  },
  'BMB-ESC': {
    description: 'Bomba de escoamento / pluvial',
    category: 'Bombas',
    tasks: [{ periodicity: 'Mensal', details: 'Teste funcional em dias de chuva, verificação de detritos e limpeza do poço' }]
  },
  'BMB-PIS': {
    description: 'Bomba de piscina',
    category: 'Bombas',
    tasks: [{ periodicity: 'Quinzenal', details: 'Limpeza de pré-filtro, teste de funcionamento, verificação de ruído e vazamentos' }]
  },
  'BMB-CIR': {
    description: 'Bomba de circulação',
    category: 'Bombas',
    tasks: [{ periodicity: 'Mensal', details: 'Verificação de circulação contínua, temperatura de retorno e estanqueidade das conexões' }]
  },
  'BMB-AQ': {
    description: 'Bomba de água quente',
    category: 'Bombas',
    tasks: [{ periodicity: 'Mensal', details: 'Teste de funcionamento com água quente, estanqueidade de conexões e funcionamento do pressostato' }]
  },
  'PRS': {
    description: 'Sistema de Pressurização',
    category: 'Sistemas',
    tasks: [{ periodicity: 'Mensal', details: 'Verificação das bombas, válvulas de retenção, pressostatos, painéis de comando e estanqueidade' }]
  },
  'QGBT': {
    description: 'Quadro Geral de BT',
    category: 'Quadros Elétricos',
    tasks: [{ periodicity: 'Semestral', details: 'Medições de corrente e tensão, reaperto geral de conexões, limpeza interna, verificação de disjuntores, cabos e contatos' }]
  },
  'QD': {
    description: 'Quadro de Distribuição',
    category: 'Quadros Elétricos',
    tasks: [{ periodicity: 'Semestral', details: 'Medições de corrente e tensão, reaperto geral de conexões, limpeza interna, verificação de disjuntores, cabos e contatos' }]
  },
  'QCB': {
    description: 'Quadro de Comando de Bombas',
    category: 'Quadros Elétricos',
    tasks: [{ periodicity: 'Semestral', details: 'Medições de corrente e tensão, reaperto geral de conexões, limpeza interna, verificação de disjuntores, cabos e contatos' }]
  },
  'QIL': {
    description: 'Quadro de Iluminação',
    category: 'Quadros Elétricos',
    tasks: [{ 
      periodicity: 'Semestral', 
      details: 'Medições de corrente e tensão, reaperto geral de conexões, limpeza interna, verificação de disjuntores, cabos e contatos',
    }]
  },
  'QT': {
    description: 'Quadro de Tomadas',
    category: 'Quadros Elétricos',
    tasks: [{ periodicity: 'Semestral', details: 'Medições de corrente e tensão, reaperto geral de conexões, limpeza interna, verificação de disjuntores, cabos e contatos' }]
  },
  'QILT': {
    description: 'Quadro de Iluminação e Tomadas',
    category: 'Quadros Elétricos',
    tasks: [{ periodicity: 'Semestral', details: 'Medições de corrente e tensão, reaperto geral de conexões, limpeza interna, verificação de disjuntores, cabos e contatos' }]
  },
  'QAU': {
    description: 'Quadro de Automação',
    category: 'Quadros Elétricos',
    tasks: [{ periodicity: 'Semestral', details: 'Medições de corrente e tensão, reaperto geral de conexões, limpeza interna, verificação de disjuntores, cabos e contatos' }]
  },
  'QE': {
    description: 'Quadro Elétrico (genérico)',
    category: 'Quadros Elétricos',
    tasks: [{ periodicity: 'Semestral', details: 'Medições de corrente e tensão, reaperto geral de conexões, limpeza interna, verificação de disjuntores, cabos e contatos' }]
  },
  'AC': {
    description: 'Ar Condicionado',
    category: 'Climatização',
    tasks: [{ 
      periodicity: 'Mensal', 
      details: 'Limpeza de unidade condensadora; Limpeza de unidade evaporadora; Limpeza dos gabinetes; Verificar conexões (reapertar caso necessário), peças metálicas, tubulações, mancais, suportes e demais fixações; Verificar pressões; Verificar vazamentos; Verificar ruídos'
    }]
  },
  'VPR': {
    description: 'Válvula Redutora de Pressão',
    category: 'Hidráulica',
    tasks: [{ periodicity: 'Semestral', details: 'Verificação de calibração, vazamentos, regulagem de pressão e limpeza de componentes internos' }]
  },
  'MPG': {
    description: 'Motor de Portão',
    category: 'Automação',
    tasks: [{ periodicity: 'Mensal', details: 'Lubrificação de engrenagens, teste de fim de curso, inversores e sensores de segurança' }]
  },
  'ACT': {
    description: 'Atuador',
    category: 'Automação',
    tasks: [{ periodicity: 'Trimestral', details: 'Teste de acionamento, verificação de torque e resposta do mecanismo' }]
  },
  'SDAI': {
    description: 'Sistema de Detecção de Incêndio',
    category: 'Segurança',
    tasks: [{ periodicity: 'Mensal', details: 'Teste funcional de detectores, botoeiras, sirenes, painel de controle e backup de bateria' }]
  },
  'CAI': {
    description: 'Central de Alarme de Incêndio',
    category: 'Segurança',
    tasks: [{ periodicity: 'Mensal', details: 'Verificação de alarmes, painéis, fiação, backup de energia e operação de sensores conectados' }]
  },
  'MDE': {
    description: 'Medidor de Energia',
    category: 'Medição',
    tasks: [{ periodicity: 'Anual', details: 'Verificação de integridade, leitura e lacres' }]
  },
  'MDA': {
    description: 'Medidor de Água',
    category: 'Medição',
    tasks: [{ periodicity: 'Anual', details: 'Verificação de leitura e funcionamento geral' }]
  },
  'MDG': {
    description: 'Medidor de Gás',
    category: 'Medição',
    tasks: [{ periodicity: 'Anual', details: 'Verificação de consumo e estanqueidade' }]
  },
  'SNV': {
    description: 'Sensor de Vazamento',
    category: 'Segurança',
    tasks: [{ periodicity: 'Mensal', details: 'Teste de funcionamento, alarme sonoro, limpeza e verificação da bateria' }]
  },
  'ELS': {
    description: 'Elevador Social',
    category: 'Vertical',
    tasks: [{ periodicity: 'Mensal', details: 'Lubrificação, teste de frenagem, portas, botoeiras, sistema de emergência (realizado por empresa habilitada)', isSpecialized: true }]
  },
  'ELV': {
    description: 'Elevador de Serviço',
    category: 'Vertical',
    tasks: [{ periodicity: 'Mensal', details: 'Lubrificação, teste de frenagem, portas, botoeiras, sistema de emergência (realizado por empresa habilitada)', isSpecialized: true }]
  },
  'RIN': {
    description: 'Reservatório Inferior',
    category: 'Hidráulica',
    tasks: [{ periodicity: 'Semestral', details: 'Inspeção estrutural, limpeza interna, verificação de tampas e conexões hidráulicas' }]
  },
  'RSU': {
    description: 'Reservatório Superior',
    category: 'Hidráulica',
    tasks: [{ periodicity: 'Semestral', details: 'Inspeção estrutural, limpeza interna, verificação de tampas e conexões hidráulicas' }]
  },
  'HDR': {
    description: 'Hidrômetro',
    category: 'Hidráulica',
    tasks: [{ periodicity: 'Anual', details: 'Verificação de leitura, vedação, fixação e sinais de vazamento' }]
  },
  'CGD': {
    description: 'Caixa de Gordura',
    category: 'Hidráulica',
    tasks: [{ periodicity: 'Mensal', details: 'Retirada e limpeza dos resíduos, verificação de conexões e vedação da tampa' }]
  },
  'AQG': {
    description: 'Aquecedor a Gás',
    category: 'Aquecimento',
    tasks: [{ periodicity: 'Trimestral', details: 'Verificação de chamas, exaustão, limpeza dos dutos e conexões de gás' }]
  },
  'AQE': {
    description: 'Aquecedor Elétrico',
    category: 'Aquecimento',
    tasks: [{ periodicity: 'Trimestral', details: 'Teste da resistência elétrica, verificação de cabos e dispositivos de segurança' }]
  },
  'AQS': {
    description: 'Aquecedor Solar',
    category: 'Aquecimento',
    tasks: [{ periodicity: 'Trimestral', details: 'Limpeza das placas solares, verificação de bomba de circulação e temperatura' }]
  },
  'AQC': {
    description: 'Central de Aquecimento',
    category: 'Aquecimento',
    tasks: [{ periodicity: 'Mensal', details: 'Verificação de vazamentos, temperatura da água, funcionamento das bombas e comandos' }]
  },
  'SS': {
    description: 'Sauna Seca',
    category: 'Lazer',
    tasks: [{ periodicity: 'Mensal', details: 'Verificação da resistência, termostato, ventilação e limpeza das superfícies' }]
  },
  'SU': {
    description: 'Sauna Úmida',
    category: 'Lazer',
    tasks: [{ periodicity: 'Mensal', details: 'Teste do gerador de vapor, estanqueidade da cabine e funcionamento do dreno' }]
  },
  'PSC': {
    description: 'Piscina Coberta',
    category: 'Lazer',
    tasks: [{ periodicity: 'Semanal', details: 'Análise de pH/cloro, verificação do sistema de filtragem, bomba e aspiração' }]
  },
  'PSI': {
    description: 'Piscina Infantil',
    category: 'Lazer',
    tasks: [{ periodicity: 'Semanal', details: 'Teste de qualidade da água, segurança das bordas e funcionamento da bomba' }]
  },
  'PSD': {
    description: 'Piscina Descoberta',
    category: 'Lazer',
    tasks: [{ periodicity: 'Semanal', details: 'Análise química da água, limpeza do pré-filtro, inspeção dos dispositivos elétricos' }]
  },
  'EDA': {
    description: "Espelho D'Água",
    category: 'Lazer',
    tasks: [{ periodicity: 'Mensal', details: 'Limpeza da lâmina d’água, verificação da bomba e iluminação subaquática' }]
  },
  'HID': {
    description: 'Hidromassagem',
    category: 'Lazer',
    tasks: [{ periodicity: 'Mensal', details: 'Inspeção dos jatos, aquecimento, estanqueidade e painel de comando' }]
  },
  'FTA': {
    description: 'Fonte de Água',
    category: 'Lazer',
    tasks: [{ periodicity: 'Mensal', details: 'Verificação da bomba, bicos, iluminação e cronômetro (se houver)' }]
  },
  'FLP': {
    description: 'Filtro de Piscina',
    category: 'Lazer',
    tasks: [{ periodicity: 'Quinzenal', details: 'Retro lavagem, verificação da pressão no manômetro, válvula seletora e areia do filtro' }]
  },
  'ANT': {
    description: 'Antena',
    category: 'Outros',
    tasks: [{ periodicity: 'Semestral', details: 'Inspeção visual, fixação e conexão de cabos' }]
  },
  'GER': {
    description: 'Gerador',
    category: 'Outros',
    tasks: [
      { periodicity: 'Semanal', details: 'Teste de carga, nível de óleo, painel de controle e sistema de partida' },
      { periodicity: 'Mensal', details: 'Manutenção preventiva com empresa especializada', isSpecialized: true }
    ]
  },
  'SOL': {
    description: 'Painel Solar / Fotovoltaico',
    category: 'Outros',
    tasks: [{ periodicity: 'Trimestral', details: 'Verificação de módulos, conexões e desempenho do sistema' }]
  },
  'EXTOR': {
    description: 'Exaustor',
    category: 'Outros',
    tasks: [{ periodicity: 'Trimestral', details: 'Verificação de fixação, limpeza de pás, ruído e funcionamento' }]
  }
}; 