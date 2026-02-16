import { Document, Page, View, Text, StyleSheet, Image as PDFImage, pdf, Svg, Path, Circle, Line, Polyline } from '@react-pdf/renderer';
import type { AreaTecnica, Ronda, ContratoRonda, FotoRonda, SecaoRonda } from '@/types/ronda';
import { CM_TO_PT } from './pdfConfig';

// Componente de Ícone para PDF
const PDFIcon = ({ name, color, size = 12 }: { name: string, color: string, size?: number }) => {
  switch (name) {
    case 'BarChart3':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M18 20V10" />
          <Path d="M12 20V4" />
          <Path d="M6 20v-6" />
        </Svg>
      );
    case 'AlertTriangle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <Line x1="12" y1="9" x2="12" y2="13" />
          <Line x1="12" y1="17" x2="12.01" y2="17" />
        </Svg>
      );
    case 'CheckCircle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <Polyline points="22 4 12 14.01 9 11.01" />
        </Svg>
      );
    case 'Wrench':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </Svg>
      );
    case 'Info':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="12" cy="12" r="10" />
          <Line x1="12" y1="16" x2="12" y2="12" />
          <Line x1="12" y1="8" x2="12.01" y2="8" />
        </Svg>
      );
    case 'AlertCircle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="12" cy="12" r="10" />
          <Line x1="12" y1="8" x2="12" y2="12" />
          <Line x1="12" y1="16" x2="12.01" y2="16" />
        </Svg>
      );
    case 'MousePointer':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
          <Path d="M13 13l6 6" />
        </Svg>
      );
    default:
      return null;
  }
};

const colors = {
  primary: '#0f172a',
  secondary: '#334155',
  accent: '#3b82f6',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  text: '#1e293b',
  textLight: '#64748b',
  border: '#e2e8f0',
  bgLight: '#f8fafc',
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 4.0 * CM_TO_PT,
    paddingBottom: 3.0 * CM_TO_PT,
    paddingLeft: 1.5 * CM_TO_PT,
    paddingRight: 1.5 * CM_TO_PT,
    fontSize: 10,
    color: colors.text,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  headerTable: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000000',
    height: 2.5 * CM_TO_PT,
    backgroundColor: '#ffffff',
  },
  headerLogo: {
    width: '15%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  headerTitleContainer: {
    width: '55%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  headerInfo: {
    width: '30%',
    flexDirection: 'column',
  },
  headerInfoRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    height: '33.33%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 10,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48%',
    marginBottom: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#ffffff',
    padding: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 8,
    fontWeight: 'bold',
  },
  imageContainer: {
    height: 120,
    backgroundColor: colors.bgLight,
    borderRadius: 4,
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noImageText: {
    fontSize: 8,
    color: colors.textLight,
  },
  cardFooter: {
    marginTop: 4,
  },
  label: {
    fontSize: 8,
    color: colors.textLight,
    marginBottom: 1,
  },
  value: {
    fontSize: 9,
    color: colors.text,
    marginBottom: 4,
  },
});

const neonColors = {
  green: '#39ff14',
  red: '#ff073a',
  yellow: '#fff01f',
};

const getStatusColor = (status: string) => {
  const s = status?.toUpperCase() || '';
  if (s === 'ATIVO' || s === 'CONCLUÍDO' || s === 'CONCLUIDO' || s === 'BAIXA' || s === 'NORMAL') return neonColors.green;
  if (s === 'ATENÇÃO' || s === 'PENDENTE' || s === 'ALTA' || s === 'URGENTE') return neonColors.red;
  if (s === 'EM MANUTENÇÃO' || s === 'EM ANDAMENTO' || s === 'MÉDIA' || s === 'MEDIA') return neonColors.yellow;
  return colors.border;
};

const StatusBadge = ({ status }: { status: string }) => {
  let bg = colors.bgLight;
  let color = colors.text;
  const s = status?.toUpperCase() || '';
  if (s === 'ATIVO' || s === 'CONCLUÍDO' || s === 'CONCLUIDO' || s === 'BAIXA') { bg = '#dcfce7'; color = '#166534'; }
  else if (s === 'EM MANUTENÇÃO' || s === 'EM ANDAMENTO' || s === 'MÉDIA' || s === 'MEDIA') { bg = '#fef9c3'; color = '#854d0e'; }
  else if (s === 'ATENÇÃO' || s === 'PENDENTE' || s === 'ALTA' || s === 'URGENTE') { bg = '#fee2e2'; color = '#991b1b'; }
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={{ color }}>{status}</Text>
    </View>
  );
};

const CustomHeader = ({ contrato, ronda }: { contrato: ContratoRonda, ronda: Ronda }) => (
  <View style={styles.headerTable} fixed>
    <View style={styles.headerLogo}>
      <PDFImage src="/logo-header.png" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
    </View>
    <View style={styles.headerTitleContainer}>
      <Text style={styles.headerTitleText}>VISITA TÉCNICA</Text>
    </View>
    <View style={styles.headerInfo}>
      <View style={[styles.headerInfoRow, { justifyContent: 'center', backgroundColor: '#ffffff' }]}>
        <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#000000' }}>Condomínio</Text>
      </View>
      <View style={styles.headerInfoRow}>
        <View style={{ flex: 2, paddingLeft: 4, borderRightWidth: 1, borderRightColor: '#000000', height: '100%', justifyContent: 'center' }}>
          <Text style={{ fontSize: 7, fontWeight: 'bold' }}>{contrato.nome}</Text>
        </View>
        <View style={{ flex: 1, paddingLeft: 4, height: '100%', justifyContent: 'center' }}>
          <Text style={{ fontSize: 7 }} render={({ pageNumber, totalPages }) => `Pág: ${pageNumber}/${totalPages}`} />
        </View>
      </View>
      <View style={[styles.headerInfoRow, { borderBottomWidth: 0 }]}>
        <View style={{ flex: 2, paddingLeft: 4, borderRightWidth: 1, borderRightColor: '#000000', height: '100%', justifyContent: 'center' }}>
          <Text style={{ fontSize: 7 }}>Data: {ronda.data ? ronda.data.split('-').reverse().join('/') : ''}</Text>
        </View>
        <View style={{ flex: 1, paddingLeft: 4, height: '100%', justifyContent: 'center' }}>
          <Text style={{ fontSize: 7 }}>Rev: 00</Text>
        </View>
      </View>
    </View>
  </View>
);

const CustomFooter = () => (
  <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 35, justifyContent: 'flex-end' }} fixed>
    <View style={{ height: 25, backgroundColor: '#003366', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingLeft: 20 }}>
      <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#bcaaa4', alignItems: 'center', justifyContent: 'center', position: 'absolute', left: '20%', bottom: 5, borderWidth: 2, borderColor: '#ffffff' }}>
        <PDFIcon name="MousePointer" color="#ffffff" size={16} />
      </View>
      <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: 'bold', marginLeft: 40 }}>
        www.manutencaopredial.net.br
      </Text>
    </View>
  </View>
);

const CardArea: React.FC<{ area: AreaTecnica }> = ({ area }) => {
  const borderColor = getStatusColor(area.status);
  return (
    <View style={[styles.card, { borderColor, borderWidth: 2 }]} wrap={false}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{area.nome}</Text>
        <StatusBadge status={area.status} />
      </View>
      {area.testeStatus !== 'NAO_TESTADO' && (
        <View style={{ marginBottom: 6, padding: 4, borderWidth: 1, borderColor: '#22c55e', borderRadius: 4, alignItems: 'center' }}>
          <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#000000' }}>Feito teste de funcionamento do ativo</Text>
        </View>
      )}
      {area.foto ? (
        <View style={styles.imageContainer}><PDFImage src={area.foto} style={styles.image} /></View>
      ) : (
        <View style={styles.imageContainer}><Text style={styles.noImageText}>Sem imagem</Text></View>
      )}
      {area.observacoes ? (
        <View style={styles.cardFooter}>
          <Text style={styles.label}>Observações:</Text>
          <Text style={styles.value}>{area.observacoes}</Text>
        </View>
      ) : null}
    </View>
  );
};

export type PdfImage = { data: Uint8Array; format: 'jpeg' | 'png' };
export type PdfFotoItem = { id: string; src: PdfImage | string | null; local: string; especialidade: string; pendencia: string; observacoes?: string; responsavel?: string; criticidade?: string };

const CardFoto: React.FC<{ foto: PdfFotoItem }> = ({ foto }) => {
  const borderColor = getStatusColor(foto.criticidade || 'MÉDIA');
  return (
    <View style={[styles.card, { borderColor, borderWidth: 2 }]} wrap={false}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{foto.especialidade}</Text>
        <StatusBadge status={foto.criticidade || 'MÉDIA'} />
      </View>
      {foto.src ? (
        <View style={styles.imageContainer}><PDFImage src={foto.src as any} style={styles.image} /></View>
      ) : (
        <View style={styles.imageContainer}><Text style={styles.noImageText}>Sem imagem</Text></View>
      )}
      <View style={styles.cardFooter}>
        <Text style={styles.label}>Local:</Text>
        <Text style={styles.value}>{foto.local}</Text>
        {foto.pendencia ? (<><Text style={styles.label}>Descrição:</Text><Text style={styles.value}>{foto.pendencia}</Text></>) : null}
        {foto.observacoes ? (<><Text style={styles.label}>Observações:</Text><Text style={styles.value}>{foto.observacoes}</Text></>) : null}
        {foto.responsavel ? (<><Text style={styles.label}>Responsável:</Text><Text style={styles.value}>{foto.responsavel}</Text></>) : null}
      </View>
    </View>
  );
};

export const RelatorioPDF = ({ ronda, contrato, areas }: { ronda: Ronda; contrato: ContratoRonda; areas: AreaTecnica[] }) => {
  const fotosRonda: PdfFotoItem[] = (ronda.fotosRonda || []).map((f) => ({
    id: f.id, src: f.foto, local: f.local, especialidade: f.especialidade,
    pendencia: f.pendencia, observacoes: f.observacoes, responsavel: (f as any).responsavel, criticidade: (f as any).criticidade,
  }));

  const itensChamado: PdfFotoItem[] = (ronda.outrosItensCorrigidos || [])
    .filter((item: any) => item.categoria ? item.categoria === 'CHAMADO' : item.status !== 'CONCLUÍDO' && item.status !== 'CONCLUIDO')
    .flatMap((item: any) => {
      if (item.fotos && item.fotos.length > 0) {
        return item.fotos.map((foto: string, index: number) => ({
          id: `${item.id}-foto-${index}`, src: foto, local: item.local || 'Local não informado',
          especialidade: item.nome || 'Item de chamado', pendencia: item.descricao || 'Sem descrição',
          observacoes: item.observacoes || '', responsavel: item.responsavel || '', criticidade: item.prioridade || 'MÉDIA',
        }));
      }
      return [{ id: item.id, src: item.foto || null, local: item.local || 'Local não informado',
        especialidade: item.nome || 'Item de chamado', pendencia: item.descricao || 'Sem descrição',
        observacoes: item.observacoes || '', responsavel: item.responsavel || '', criticidade: item.prioridade || 'MÉDIA' }];
    });

  const fotosToUse = [...fotosRonda, ...itensChamado];

  const summaryData = (() => {
    const equipamentosAtencao: string[] = [];
    const equipamentosNormais: string[] = [];
    const chamadosAbertos: string[] = [];
    const itensCorrigidos: string[] = [];

    areas.forEach(area => {
      if (area.status === 'ATENÇÃO' || area.status === 'EM MANUTENÇÃO') {
        equipamentosAtencao.push(`${area.nome}: ${area.observacoes || area.status}`);
      } else {
        equipamentosNormais.push(`${area.nome}: Operacional`);
      }
    });

    fotosToUse.forEach(item => {
      const isCorrigido = (ronda.outrosItensCorrigidos || []).some(i =>
        (i.id === item.id || item.id.startsWith(i.id)) && (i.status === 'CONCLUÍDO' || i.categoria === 'CORRIGIDO')
      );
      if (isCorrigido) return;
      const crit = item.criticidade?.toUpperCase();
      const text = `${item.especialidade} (${item.local}): ${item.pendencia}`;
      if (crit === 'ALTA' || crit === 'URGENTE') equipamentosAtencao.push(text);
      else chamadosAbertos.push(text);
    });

    (ronda.outrosItensCorrigidos || []).forEach(item => {
      const s = item.status?.toUpperCase();
      if (s === 'CONCLUÍDO' || s === 'CONCLUIDO' || item.categoria === 'CORRIGIDO') {
        itensCorrigidos.push(`${item.nome} (${item.local}): ${item.observacoes || item.descricao || 'Corrigido'}`);
      }
    });

    return { equipamentosAtencao, equipamentosNormais, chamadosAbertos, itensCorrigidos };
  })();

  const capaPadrao = '/capa-visita.png';
  const numerosRomanos = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];

  return (
    <Document title={`Relatório - ${contrato.nome}`} author="Manut" subject="Relatório Técnico">
      <Page size="A4" style={{ padding: 0, position: 'relative' }}>
        <PDFImage src={capaPadrao} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      </Page>

      <Page size="A4" style={styles.page}>
        <CustomHeader contrato={contrato} ronda={ronda} />

        {(() => {
          const secoes = ronda.secoes && ronda.secoes.length > 0
            ? ronda.secoes.sort((a, b) => a.ordem - b.ordem)
            : [{ id: 'objetivo-default', ordem: 1, titulo: 'Objetivo do Relatório de Status de Equipamentos e Áreas Comuns',
                conteudo: 'O presente relatório tem como finalidade apresentar de forma clara, técnica e organizada o status atual dos equipamentos e das áreas comuns do empreendimento.' }];
          return secoes.map((secao, index) => (
            <View key={secao.id} style={{ marginBottom: 20, marginTop: index === 0 ? 10 : 0 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 }}>
                {numerosRomanos[secao.ordem - 1] || secao.ordem} - {secao.titulo}
              </Text>
              {secao.conteudo.split('\n').map((paragrafo, pIndex) => (
                paragrafo.trim() && (
                  <Text key={pIndex} style={{ fontSize: 10, textAlign: 'justify', marginBottom: 6, lineHeight: 1.5 }}>
                    {paragrafo.trim()}
                  </Text>
                )
              ))}
            </View>
          ));
        })()}

        <View style={styles.sectionTitle}><Text>Áreas Inspecionadas</Text></View>
        <View style={styles.gridContainer}>
          {areas.map((area, index) => <CardArea key={`area-${index}`} area={area} />)}
        </View>

        {fotosToUse.length > 0 && (
          <>
            <View style={[styles.sectionTitle, { marginTop: 20 }]}><Text>Registro Fotográfico</Text></View>
            <View style={styles.gridContainer}>
              {fotosToUse.map((foto, index) => <CardFoto key={`foto-${index}`} foto={foto} />)}
            </View>
          </>
        )}

        <View break />
        <View style={styles.sectionTitle}><Text>Resumo Executivo</Text></View>
        <View style={{ marginTop: 10, borderWidth: 2, borderColor: '#bfdbfe', borderRadius: 4, padding: 10, backgroundColor: '#eff6ff' }}>
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#bfdbfe', paddingBottom: 5, marginBottom: 10 }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1e40af' }}>Resumo Executivo – Pontos Críticos</Text>
          </View>
          <View style={{ flexDirection: 'column', gap: 8 }}>
            {summaryData.equipamentosAtencao.length > 0 && (
              <View style={{ backgroundColor: '#ffedd5', borderLeftWidth: 4, borderLeftColor: '#f97316', padding: 8, borderRadius: 4, marginBottom: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 4 }}>
                  <PDFIcon name="AlertCircle" color="#9a3412" size={12} />
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#9a3412' }}>Equipamentos em Atenção / Em Manutenção</Text>
                </View>
                {summaryData.equipamentosAtencao.map((item, i) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 2 }}>
                    <Text style={{ fontSize: 10, color: '#f97316', marginRight: 4 }}>•</Text>
                    <Text style={{ fontSize: 9, color: '#c2410c', flex: 1 }}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
            {summaryData.equipamentosNormais.length > 0 && (
              <View style={{ backgroundColor: '#dcfce7', borderLeftWidth: 4, borderLeftColor: '#22c55e', padding: 8, borderRadius: 4, marginBottom: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 4 }}>
                  <PDFIcon name="CheckCircle" color="#14532d" size={12} />
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#14532d' }}>Equipamentos Status Normal</Text>
                </View>
                {summaryData.equipamentosNormais.map((item, i) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 2 }}>
                    <Text style={{ fontSize: 10, color: '#22c55e', marginRight: 4 }}>•</Text>
                    <Text style={{ fontSize: 9, color: '#15803d', flex: 1 }}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
            {summaryData.chamadosAbertos.length > 0 && (
              <View style={{ backgroundColor: '#fef9c3', borderLeftWidth: 4, borderLeftColor: '#eab308', padding: 8, borderRadius: 4, marginBottom: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 4 }}>
                  <PDFIcon name="AlertTriangle" color="#854d0e" size={12} />
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#854d0e' }}>Itens para Abertura de Chamado</Text>
                </View>
                {summaryData.chamadosAbertos.map((item, i) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 2 }}>
                    <Text style={{ fontSize: 10, color: '#eab308', marginRight: 4 }}>•</Text>
                    <Text style={{ fontSize: 9, color: '#a16207', flex: 1 }}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
            {summaryData.itensCorrigidos.length > 0 && (
              <View style={{ backgroundColor: '#dbeafe', borderLeftWidth: 4, borderLeftColor: '#3b82f6', padding: 8, borderRadius: 4, marginBottom: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 4 }}>
                  <PDFIcon name="Wrench" color="#1e40af" size={12} />
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#1e40af' }}>Itens Corrigidos</Text>
                </View>
                {summaryData.itensCorrigidos.map((item, i) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 2 }}>
                    <Text style={{ fontSize: 10, color: '#3b82f6', marginRight: 4 }}>•</Text>
                    <Text style={{ fontSize: 9, color: '#1d4ed8', flex: 1 }}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
            {summaryData.equipamentosAtencao.length === 0 && summaryData.equipamentosNormais.length === 0 &&
              summaryData.chamadosAbertos.length === 0 && summaryData.itensCorrigidos.length === 0 && (
              <View style={{ alignItems: 'center', padding: 20 }}>
                <PDFIcon name="Info" color="#93c5fd" size={24} />
                <Text style={{ fontSize: 10, color: '#2563eb', marginTop: 4 }}>Nenhuma informação registrada ainda.</Text>
              </View>
            )}
          </View>
        </View>

        <CustomFooter />
      </Page>
    </Document>
  );
};

async function srcToDataURL(src?: string | null): Promise<string | null> {
  if (!src) return null;
  if (src.startsWith('data:image')) return src;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(src, { mode: 'cors', signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn(`Erro ao carregar imagem para PDF (${src}):`, error);
    return null;
  }
}

export async function preparePdfData(ronda: Ronda, areas: AreaTecnica[]) {
  const areasNormalized = await Promise.all(
    areas.map(async (a) => {
      try { return { ...a, foto: await srcToDataURL(a.foto) }; }
      catch { return { ...a, foto: null }; }
    })
  );

  const fotosRondaNormalized = await Promise.all(
    (ronda.fotosRonda || []).map(async (f) => {
      try { return { ...f, foto: await srcToDataURL(f.foto) }; }
      catch { return { ...f, foto: null }; }
    })
  );

  const outrosItensNormalized = await Promise.all(
    (ronda.outrosItensCorrigidos || []).map(async (item) => {
      try {
        let foto = item.foto ? await srcToDataURL(item.foto) : null;
        let fotos = item.fotos || [];
        if (fotos.length > 0) {
          fotos = (await Promise.all(fotos.map(async (f) => await srcToDataURL(f) || ''))).filter(f => f !== '');
        }
        return { ...item, foto, fotos };
      } catch { return item; }
    })
  );

  return {
    rondaNormalized: { ...ronda, fotosRonda: fotosRondaNormalized as any, outrosItensCorrigidos: outrosItensNormalized },
    areasNormalized,
  };
}

export async function downloadRelatorioPDF(ronda: Ronda, contrato: ContratoRonda, areas: AreaTecnica[]) {
  try {
    const { rondaNormalized, areasNormalized } = await preparePdfData(ronda, areas);
    const blob = await pdf(
      <RelatorioPDF ronda={rondaNormalized} contrato={contrato} areas={areasNormalized} />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const d = new Date();
    const dataFormatada = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
    a.download = `Visita MP - ${ronda.nome} - ${contrato.nome} - ${dataFormatada}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Erro ao gerar PDF. Verifique o console.');
    throw error;
  }
}
