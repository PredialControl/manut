import { supabase } from './supabase';
import type { ContratoRonda, Ronda, AreaTecnica, FotoRonda, OutroItemCorrigido, AgendaItem, Laudo, ParecerTecnico, RelatorioPendencias } from '@/types/ronda';

// ==================== CONTRATOS ====================
export const contratoService = {
  async getAll(): Promise<ContratoRonda[]> {
    const { data, error } = await supabase
      .from('contratos')
      .select('*')
      .order('nome', { ascending: true });
    if (error) throw error;
    return (data || []).map((c: any) => ({
      id: c.id,
      nome: c.nome,
      sindico: c.sindico,
      endereco: c.endereco,
      periodicidade: c.periodicidade,
      status: c.status,
      tipo_uso: c.tipo_uso,
      quantidade_torres: c.quantidade_torres,
      observacoes: c.observacoes,
      dataCriacao: c.data_criacao || c.created_at,
    }));
  },

  async getById(id: string): Promise<ContratoRonda | null> {
    const { data, error } = await supabase
      .from('contratos')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return {
      id: data.id,
      nome: data.nome,
      sindico: data.sindico,
      endereco: data.endereco,
      periodicidade: data.periodicidade,
      status: data.status,
      tipo_uso: data.tipo_uso,
      quantidade_torres: data.quantidade_torres,
      observacoes: data.observacoes,
      dataCriacao: data.data_criacao || data.created_at,
    };
  },
};

// ==================== RONDAS ====================
export const rondaService = {
  async getByContrato(contratoNome: string): Promise<Ronda[]> {
    const { data, error } = await supabase
      .from('rondas')
      .select('*')
      .eq('contrato', contratoNome)
      .order('data', { ascending: false });
    if (error) throw error;
    return (data || []).map((r: any) => ({
      id: r.id,
      nome: r.nome,
      contrato: r.contrato,
      data: r.data,
      hora: r.hora,
      tipoVisita: r.tipo_visita,
      observacoesGerais: r.observacoes_gerais,
      responsavel: r.responsavel,
      secoes: r.secoes ? (typeof r.secoes === 'string' ? JSON.parse(r.secoes) : r.secoes) : [],
      areasTecnicas: [],
      fotosRonda: [],
      outrosItensCorrigidos: [],
    }));
  },

  async loadCompleteRonda(ronda: Ronda): Promise<Ronda> {
    const [areas, fotos, itens] = await Promise.all([
      areaTecnicaService.getByRonda(ronda.id),
      fotoRondaService.getByRonda(ronda.id),
      outroItemService.getByRonda(ronda.id),
    ]);
    return { ...ronda, areasTecnicas: areas, fotosRonda: fotos, outrosItensCorrigidos: itens };
  },

  async create(ronda: Partial<Ronda>): Promise<string> {
    const id = crypto.randomUUID();
    const { error } = await supabase.from('rondas').insert({
      id,
      nome: ronda.nome,
      contrato: ronda.contrato,
      data: ronda.data,
      hora: ronda.hora,
      tipo_visita: ronda.tipoVisita || 'RONDA',
      responsavel: ronda.responsavel || '',
      observacoes_gerais: ronda.observacoesGerais || '',
      secoes: ronda.secoes ? JSON.stringify(ronda.secoes) : '[]',
    });
    if (error) throw error;
    return id;
  },

  async update(id: string, updates: Partial<Ronda>): Promise<void> {
    const mapped: any = {};
    if (updates.nome !== undefined) mapped.nome = updates.nome;
    if (updates.data !== undefined) mapped.data = updates.data;
    if (updates.hora !== undefined) mapped.hora = updates.hora;
    if (updates.tipoVisita !== undefined) mapped.tipo_visita = updates.tipoVisita;
    if (updates.responsavel !== undefined) mapped.responsavel = updates.responsavel;
    if (updates.observacoesGerais !== undefined) mapped.observacoes_gerais = updates.observacoesGerais;
    if (updates.secoes !== undefined) mapped.secoes = JSON.stringify(updates.secoes);
    const { error } = await supabase.from('rondas').update(mapped).eq('id', id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('rondas').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== AREAS TECNICAS ====================
export const areaTecnicaService = {
  async getByRonda(rondaId: string): Promise<AreaTecnica[]> {
    const { data, error } = await supabase
      .from('areas_tecnicas')
      .select('*')
      .eq('ronda_id', rondaId);
    if (error) throw error;
    return (data || []).map((a: any) => ({
      id: a.id,
      nome: a.nome,
      status: a.status || 'ATIVO',
      testeStatus: a.teste_status,
      contrato: a.contrato,
      endereco: a.endereco,
      data: a.data,
      hora: a.hora,
      foto: a.foto,
      fotos: a.fotos,
      observacoes: a.observacoes,
    }));
  },

  async create(area: Partial<AreaTecnica> & { ronda_id: string }): Promise<string> {
    const id = crypto.randomUUID();
    const { error } = await supabase.from('areas_tecnicas').insert({
      id,
      ronda_id: area.ronda_id,
      nome: area.nome,
      status: area.status || 'ATIVO',
      teste_status: area.testeStatus,
      contrato: area.contrato,
      endereco: area.endereco,
      data: area.data,
      hora: area.hora,
      foto: area.foto,
      observacoes: area.observacoes || '',
    });
    if (error) throw error;
    return id;
  },

  async update(id: string, updates: Partial<AreaTecnica>): Promise<void> {
    const mapped: any = {};
    if (updates.nome !== undefined) mapped.nome = updates.nome;
    if (updates.status !== undefined) mapped.status = updates.status;
    if (updates.testeStatus !== undefined) mapped.teste_status = updates.testeStatus;
    if (updates.foto !== undefined) mapped.foto = updates.foto;
    if (updates.observacoes !== undefined) mapped.observacoes = updates.observacoes;
    const { error } = await supabase.from('areas_tecnicas').update(mapped).eq('id', id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('areas_tecnicas').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== FOTOS RONDA ====================
export const fotoRondaService = {
  async getByRonda(rondaId: string): Promise<FotoRonda[]> {
    const { data, error } = await supabase
      .from('fotos_ronda')
      .select('*')
      .eq('ronda_id', rondaId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []).map((f: any) => ({
      id: f.id,
      foto: f.foto || f.url_foto,
      fotos: f.fotos,
      local: f.local || f.descricao,
      pendencia: f.pendencia || f.descricao,
      especialidade: f.especialidade || '',
      responsavel: f.responsavel || 'CONDOMÍNIO',
      observacoes: f.observacoes,
      data: f.data,
      hora: f.hora,
      criticidade: f.criticidade,
    }));
  },

  async create(foto: Partial<FotoRonda> & { ronda_id: string }): Promise<string> {
    const id = crypto.randomUUID();
    const { error } = await supabase.from('fotos_ronda').insert({
      id,
      ronda_id: foto.ronda_id,
      foto: foto.foto,
      local: foto.local,
      pendencia: foto.pendencia,
      especialidade: foto.especialidade,
      responsavel: foto.responsavel,
      observacoes: foto.observacoes || '',
      data: foto.data,
      hora: foto.hora,
      criticidade: foto.criticidade,
    });
    if (error) throw error;
    return id;
  },

  async update(id: string, updates: Partial<FotoRonda>): Promise<void> {
    const { error } = await supabase.from('fotos_ronda').update(updates).eq('id', id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('fotos_ronda').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== OUTROS ITENS ====================
export const outroItemService = {
  async getByRonda(rondaId: string): Promise<OutroItemCorrigido[]> {
    const { data, error } = await supabase
      .from('outros_itens_corrigidos')
      .select('*')
      .eq('ronda_id', rondaId);
    if (error) throw error;
    return (data || []).map((i: any) => ({
      id: i.id,
      nome: i.nome,
      descricao: i.descricao,
      local: i.local,
      tipo: i.tipo,
      prioridade: i.prioridade,
      status: i.status,
      contrato: i.contrato,
      endereco: i.endereco,
      data: i.data,
      hora: i.hora,
      foto: i.foto,
      fotos: i.fotos || [],
      categoria: i.categoria,
      observacoes: i.observacoes,
      responsavel: i.responsavel,
    }));
  },

  async create(item: Partial<OutroItemCorrigido> & { ronda_id: string }): Promise<string> {
    const id = crypto.randomUUID();
    const { error } = await supabase.from('outros_itens_corrigidos').insert({
      id,
      ronda_id: item.ronda_id,
      nome: item.nome,
      descricao: item.descricao,
      local: item.local,
      tipo: item.tipo,
      prioridade: item.prioridade,
      status: item.status || 'PENDENTE',
      contrato: item.contrato,
      endereco: item.endereco,
      data: item.data,
      hora: item.hora,
      foto: item.foto,
      observacoes: item.observacoes || '',
      responsavel: item.responsavel || '',
    });
    if (error) throw error;
    return id;
  },

  async update(id: string, updates: Partial<OutroItemCorrigido>): Promise<void> {
    const { error } = await supabase.from('outros_itens_corrigidos').update(updates).eq('id', id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('outros_itens_corrigidos').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== AGENDA ====================
export const agendaService = {
  async getAll(): Promise<AgendaItem[]> {
    const { data, error } = await supabase
      .from('agenda')
      .select('*')
      .order('horario', { ascending: true });
    if (error) throw error;
    return (data || []).map((a: any) => ({
      id: a.id,
      contratoId: a.contrato_id,
      contratoNome: a.contrato_nome,
      endereco: a.endereco,
      diaSemana: a.dia_semana,
      horario: a.horario,
      observacoes: a.observacoes,
      ativo: a.ativo,
      dataCriacao: a.data_criacao,
      dataAtualizacao: a.data_atualizacao,
      recorrencia: a.recorrencia,
    }));
  },

  async create(item: Partial<AgendaItem>): Promise<string> {
    const id = crypto.randomUUID();
    const { error } = await supabase.from('agenda').insert({
      id,
      contrato_id: item.contratoId,
      contrato_nome: item.contratoNome,
      endereco: item.endereco,
      dia_semana: item.diaSemana,
      horario: item.horario,
      observacoes: item.observacoes || '',
      ativo: item.ativo ?? true,
      recorrencia: item.recorrencia || null,
    });
    if (error) throw error;
    return id;
  },

  async update(id: string, updates: Partial<AgendaItem>): Promise<void> {
    const mapped: any = {};
    if (updates.diaSemana !== undefined) mapped.dia_semana = updates.diaSemana;
    if (updates.horario !== undefined) mapped.horario = updates.horario;
    if (updates.observacoes !== undefined) mapped.observacoes = updates.observacoes;
    if (updates.ativo !== undefined) mapped.ativo = updates.ativo;
    if (updates.recorrencia !== undefined) mapped.recorrencia = updates.recorrencia;
    const { error } = await supabase.from('agenda').update(mapped).eq('id', id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('agenda').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== LAUDOS ====================
export const laudoService = {
  async getByContrato(contratoId: string): Promise<Laudo[]> {
    const { data, error } = await supabase
      .from('laudos')
      .select('*')
      .eq('contrato_id', contratoId)
      .order('titulo', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(laudo: Partial<Laudo>): Promise<string> {
    const id = crypto.randomUUID();
    const { error } = await supabase.from('laudos').insert({ id, ...laudo });
    if (error) throw error;
    return id;
  },

  async update(id: string, updates: Partial<Laudo>): Promise<void> {
    const { error } = await supabase.from('laudos').update(updates).eq('id', id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('laudos').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== PARECER TÉCNICO ====================
export const parecerService = {
  async getByContrato(contratoId: string): Promise<ParecerTecnico[]> {
    const { data, error } = await supabase
      .from('pareceres_tecnicos')
      .select('*')
      .eq('contrato_id', contratoId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(parecer: Partial<ParecerTecnico>): Promise<string> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const { error } = await supabase.from('pareceres_tecnicos').insert({
      id, ...parecer, created_at: now, updated_at: now,
    });
    if (error) throw error;
    return id;
  },

  async update(id: string, updates: Partial<ParecerTecnico>): Promise<void> {
    const { error } = await supabase.from('pareceres_tecnicos').update({
      ...updates, updated_at: new Date().toISOString(),
    }).eq('id', id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('pareceres_tecnicos').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== RELATÓRIO DE PENDÊNCIAS ====================
export const relatorioPendenciasService = {
  async getByContrato(contratoId: string): Promise<RelatorioPendencias[]> {
    const { data, error } = await supabase
      .from('relatorios_pendencias')
      .select('*')
      .eq('contrato_id', contratoId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(relatorio: Partial<RelatorioPendencias>): Promise<string> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const { error } = await supabase.from('relatorios_pendencias').insert({
      id, ...relatorio, created_at: now, updated_at: now,
    });
    if (error) throw error;
    return id;
  },

  async update(id: string, updates: Partial<RelatorioPendencias>): Promise<void> {
    const { error } = await supabase.from('relatorios_pendencias').update({
      ...updates, updated_at: new Date().toISOString(),
    }).eq('id', id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('relatorios_pendencias').delete().eq('id', id);
    if (error) throw error;
  },
};
