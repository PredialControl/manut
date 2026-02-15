export interface ContratoRonda {
  id: string;
  nome: string;
  sindico: string;
  endereco: string;
  periodicidade: 'DIARIA' | 'SEMANAL' | 'QUINZENAL' | 'MENSAL' | 'BIMESTRAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';
  status?: 'IMPLANTADO' | 'EM IMPLANTACAO';
  tipo_uso?: 'RESIDENCIAL' | 'NAO_RESIDENCIAL' | 'RESIDENCIAL_E_NAO_RESIDENCIAL';
  quantidade_torres?: number;
  observacoes?: string;
  dataCriacao: string;
}

export interface AreaTecnica {
  id: string;
  nome: string;
  status: 'ATIVO' | 'EM MANUTENÇÃO' | 'ATENÇÃO';
  testeStatus?: 'TESTADO' | 'NAO_TESTADO';
  contrato: string;
  endereco: string;
  data: string;
  hora: string;
  foto: string | null;
  fotos?: string[];
  observacoes?: string;
}

export interface SecaoRonda {
  id: string;
  ordem: number;
  titulo: string;
  conteudo: string;
}

export interface Ronda {
  id: string;
  nome: string;
  contrato: string;
  data: string;
  hora: string;
  tipoVisita?: 'RONDA' | 'REUNIAO' | 'OUTROS';
  areasTecnicas: AreaTecnica[];
  fotosRonda: FotoRonda[];
  outrosItensCorrigidos: OutroItemCorrigido[];
  observacoesGerais?: string;
  responsavel?: string;
  secoes?: SecaoRonda[];
}

export interface FotoRonda {
  id: string;
  foto: string;
  fotos?: string[];
  local: string;
  pendencia: string;
  especialidade: string;
  responsavel: 'CONSTRUTORA' | 'CONDOMÍNIO';
  observacoes?: string;
  data: string;
  hora: string;
  criticidade?: 'Baixa' | 'Média' | 'Alta' | 'BAIXA' | 'MÉDIA' | 'ALTA';
}

export interface OutroItemCorrigido {
  id: string;
  nome: string;
  descricao: string;
  local: string;
  tipo: 'CIVIL' | 'ELÉTRICA' | 'HIDRÁULICA' | 'MECÂNICA' | 'CORREÇÃO' | 'MELHORIA' | 'MANUTENÇÃO' | 'OUTRO';
  prioridade: 'BAIXA' | 'MÉDIA' | 'ALTA';
  status: 'PENDENTE' | 'EM ANDAMENTO' | 'CONCLUÍDO' | 'CANCELADO';
  contrato: string;
  endereco: string;
  data: string;
  hora: string;
  foto: string | null;
  fotos: string[];
  categoria?: 'CHAMADO' | 'CORRIGIDO';
  observacoes?: string;
  responsavel?: string;
}

export interface AgendaItem {
  id: string;
  contratoId: string;
  contratoNome: string;
  endereco: string;
  diaSemana: 'SEGUNDA' | 'TERÇA' | 'QUARTA' | 'QUINTA' | 'SEXTA' | 'SÁBADO' | 'DOMINGO';
  horario: string;
  observacoes?: string;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
  recorrencia?: {
    tipo: 'DIARIO' | 'SEMANAL' | 'QUINZENAL' | 'MENSAL';
    intervalo: number;
    dataInicio: string;
    dataFim?: string;
    diasSemana?: string[];
    exclusoes?: string[];
  };
}

export interface Laudo {
  id: string;
  contrato_id: string;
  titulo: string;
  status: 'em-dia' | 'proximo-vencimento' | 'vencidos';
  data_vencimento?: string;
  data_emissao?: string;
  periodicidade?: string;
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ParecerTecnico {
  id: string;
  contrato_id: string;
  titulo: string;
  finalidade: string;
  narrativa_cenario: string;
  capa_url?: string;
  arquivo_word_url?: string;
  arquivo_word_nome?: string;
  status?: 'EXECUTADO' | 'NAO_EXECUTADO';
  topicos?: ParecerTopico[];
  created_at: string;
  updated_at: string;
}

export interface ParecerTopico {
  id: string;
  parecer_id: string;
  ordem: number;
  titulo: string;
  descricao: string;
  imagens?: ParecerImagem[];
  created_at: string;
}

export interface ParecerImagem {
  id: string;
  topico_id: string;
  ordem: number;
  url: string;
  descricao: string;
  created_at: string;
}

export interface RelatorioPendencias {
  id: string;
  contrato_id: string;
  titulo: string;
  capa_url?: string;
  foto_localidade_url?: string;
  data_inicio_vistoria?: string;
  historico_visitas?: string[];
  data_situacao_atual?: string;
  secoes?: RelatorioSecao[];
  created_at: string;
  updated_at: string;
}

export interface RelatorioSecao {
  id: string;
  relatorio_id: string;
  ordem: number;
  titulo_principal: string;
  subtitulo?: string;
  tem_subsecoes?: boolean;
  subsecoes?: RelatorioSubsecao[];
  pendencias?: RelatorioPendencia[];
  created_at: string;
}

export interface RelatorioSubsecao {
  id: string;
  secao_id: string;
  ordem: number;
  titulo: string;
  tipo?: 'MANUAL' | 'CONSTATACAO';
  pendencias?: RelatorioPendencia[];
  fotos_constatacao?: string[];
  descricao_constatacao?: string;
  created_at: string;
}

export interface RelatorioPendencia {
  id: string;
  secao_id: string;
  subsecao_id?: string;
  ordem: number;
  local: string;
  descricao: string;
  foto_url: string | null;
  foto_depois_url: string | null;
  data_recebimento?: string;
  status?: 'PENDENTE' | 'RECEBIDO' | 'NAO_FARAO';
  created_at: string;
}
