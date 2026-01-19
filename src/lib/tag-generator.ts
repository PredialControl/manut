const tagPrefixes: { [key: string]: string[] } = {
    'AQS': ['aquecedor solar'],
    'AQC': ['central de aquecimento', 'aquecimento'],
    'AQG': ['aquecedor a gás', 'aquecedor gas'],
    'AQE': ['aquecedor elétrico', 'aquecedor eletrico'],
    'PRS': ['sistema de pressurização'],
    'BMB-REC': ['bomba de recalque', 'recalque'],
    'BMB-DRE': ['bomba de drenagem', 'drenagem', 'esgoto'],
    'BMB-PRS': ['bomba de pressurização', 'pressurização'],
    'BMB-INC': ['bomba de incêndio', 'incendio'],
    'BMB-ESC': ['bomba de escoamento', 'pluvial'],
    'BMB-PIS': ['bomba de piscina', 'piscina'],
    'FLP': ['filtro de piscina', 'filtro piscina'],
    'PSC': ['piscina coberta'],
    'PSI': ['piscina infantil'],
    'PSD': ['piscina descoberta'],
    'EDA': ["espelho d'água", "espelho d agua"],
    'HID': ['hidromassagem'],
    'FTA': ['fonte de água', 'fonte de agua'],
    'SS': ['sauna seca'],
    'SU': ['sauna úmida', 'sauna umida'],
    'BMB-CIR': ['bomba de circulação', 'circulacao'],
    'BMB-AQ': ['bomba de água quente', 'agua quente'],
    'QGBT': ['quadro geral de baixa tensão', 'qgbt'],
    'QD': ['quadro de distribuição', 'qd'],
    'QCB': ['quadro de comando de bombas', 'qcb'],
    'QIL': ['quadro de iluminação', 'qil', 'iluminacao'],
    'QT': ['quadro de tomadas', 'qt', 'tomadas'],
    'QILT': ['quadro de iluminação e tomadas', 'qilt'],
    'QAU': ['quadro de automação', 'qau', 'automacao'],
    'QE': ['quadro elétrico', 'qe'],
    'AC': ['ar condicionado'],
    'VPR': ['válvula redutora de pressão', 'valvula redutora', 'vpr'],
    'MPG': ['motor de portão', 'motor portao'],
    'ACT': ['atuador'],
    'SDAI': ['sistema de detecção e alarme de incêndio', 'sdai', 'deteccao'],
    'CAI': ['central de alarme de incêndio', 'cai'],
    'MDE': ['medidor de energia'],
    'MDA': ['medidor de água', 'medidor agua'],
    'MDG': ['medidor de gás', 'medidor gas'],
    'SNV': ['sensor de vazamento'],
    'ELS': ['elevador social'],
    'ELV': ['elevador de serviço', 'elevador servico'],
    'RIN': ['reservatório inferior'],
    'RSU': ['reservatório superior'],
    'HDR': ['hidrômetro'],
    'CGD': ['caixa de gordura'],
    'ANT': ['antena'],
    'GER': ['gerador'],
    'SOL': ['painel solar', 'fotovoltaico'],
    'EXTOR': ['exaustor'],
};

export function getPrefixForAssetName(name: string): string {
    const lowerCaseName = name.toLowerCase();
    for (const prefix in tagPrefixes) {
        const keywords = tagPrefixes[prefix];
        if (keywords.some(keyword => lowerCaseName.includes(keyword))) {
            return prefix;
        }
    }
    return 'GEN'; // Retorna 'Genérico' se nenhuma correspondência for encontrada
} 