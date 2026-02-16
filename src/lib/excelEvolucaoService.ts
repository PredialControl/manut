import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

interface ItemCompilado {
  id: string;
  relatorio_id: string;
  relatorio_titulo: string;
  secao_titulo: string;
  item_numero: number;
  local: string;
  descricao: string;
  situacao: 'PENDENTE' | 'RECEBIDO' | 'NAO_FARA';
  data_recebido: string | null;
  construtora: string;
  sindico: string;
}

interface EvolucaoData {
  data: string;
  quantidade: number;
  acumulado: number;
}

export async function exportarEvolucaoParaExcel(
  itens: ItemCompilado[],
  evolucaoData: EvolucaoData[],
  contratoNome: string
) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Manut';
  workbook.created = new Date();

  // ABA 1: RESUMO
  const resumoSheet = workbook.addWorksheet('Resumo', { views: [{ showGridLines: true }] });

  resumoSheet.mergeCells('A1:F1');
  const titleCell = resumoSheet.getCell('A1');
  titleCell.value = `Evolução dos Recebimentos - ${contratoNome}`;
  titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  resumoSheet.getRow(1).height = 30;

  resumoSheet.mergeCells('A2:F2');
  const dateCell = resumoSheet.getCell('A2');
  dateCell.value = `Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`;
  dateCell.font = { size: 10, italic: true };
  dateCell.alignment = { horizontal: 'center' };

  resumoSheet.getRow(3).height = 10;

  const itensApontados = itens.length;
  const itensRecebidos = itens.filter(i => i.situacao === 'RECEBIDO').length;
  const naoFarao = itens.filter(i => i.situacao === 'NAO_FARA').length;
  const itensPendentes = itens.filter(i => i.situacao === 'PENDENTE').length;

  const pRecebidos = itensApontados > 0 ? Math.round((itensRecebidos / itensApontados) * 100) : 0;
  const pPendentes = itensApontados > 0 ? Math.round((itensPendentes / itensApontados) * 100) : 0;
  const pNaoFarao = itensApontados > 0 ? Math.round((naoFarao / itensApontados) * 100) : 0;

  resumoSheet.addTable({
    name: 'TabelaResumo',
    ref: 'A4',
    headerRow: true,
    style: { theme: 'TableStyleMedium2', showRowStripes: true },
    columns: [
      { name: 'Métrica', filterButton: false },
      { name: 'Quantidade', filterButton: false },
      { name: 'Percentual', filterButton: false },
    ],
    rows: [
      ['Itens Apontados', itensApontados, '100%'],
      ['Itens Recebidos', itensRecebidos, `${pRecebidos}%`],
      ['Não Farão', naoFarao, `${pNaoFarao}%`],
      ['Itens Pendentes', itensPendentes, `${pPendentes}%`],
    ],
  });

  resumoSheet.getColumn('A').width = 30;
  resumoSheet.getColumn('B').width = 15;
  resumoSheet.getColumn('C').width = 15;

  for (let i = 5; i <= 8; i++) {
    const row = resumoSheet.getRow(i);
    row.getCell(2).alignment = { horizontal: 'center' };
    row.getCell(3).alignment = { horizontal: 'center' };
    if (i === 6) { row.getCell(2).font = { bold: true, color: { argb: 'FF22C55E' } }; row.getCell(3).font = { bold: true, color: { argb: 'FF22C55E' } }; }
    else if (i === 7) { row.getCell(2).font = { bold: true, color: { argb: 'FFEF4444' } }; row.getCell(3).font = { bold: true, color: { argb: 'FFEF4444' } }; }
    else if (i === 8) { row.getCell(2).font = { bold: true, color: { argb: 'FFF97316' } }; row.getCell(3).font = { bold: true, color: { argb: 'FFF97316' } }; }
  }

  if (itensApontados > 0) {
    resumoSheet.getCell('E4').value = 'Distribuição Visual';
    resumoSheet.getCell('E4').font = { size: 12, bold: true };
    const barraVisual = (p: number) => '█'.repeat(Math.round(p / 5));
    resumoSheet.getCell('E6').value = `Recebidos (${pRecebidos}%)`;
    resumoSheet.getCell('F6').value = barraVisual(pRecebidos);
    resumoSheet.getCell('F6').font = { color: { argb: 'FF22C55E' }, size: 14 };
    resumoSheet.getCell('E7').value = `Pendentes (${pPendentes}%)`;
    resumoSheet.getCell('F7').value = barraVisual(pPendentes);
    resumoSheet.getCell('F7').font = { color: { argb: 'FFF97316' }, size: 14 };
    resumoSheet.getCell('E8').value = `Não Farão (${pNaoFarao}%)`;
    resumoSheet.getCell('F8').value = barraVisual(pNaoFarao);
    resumoSheet.getCell('F8').font = { color: { argb: 'FFEF4444' }, size: 14 };
    resumoSheet.getColumn('E').width = 25;
    resumoSheet.getColumn('F').width = 30;
  }

  // ABA 2: EVOLUÇÃO POR DATA
  if (evolucaoData.length > 0) {
    const evolucaoSheet = workbook.addWorksheet('Evolução por Data');
    evolucaoSheet.mergeCells('A1:D1');
    const evTitle = evolucaoSheet.getCell('A1');
    evTitle.value = 'Recebimentos por Data';
    evTitle.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    evTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
    evTitle.alignment = { vertical: 'middle', horizontal: 'center' };
    evolucaoSheet.getRow(1).height = 25;

    evolucaoSheet.addTable({
      name: 'TabelaEvolucao',
      ref: 'A3',
      headerRow: true,
      style: { theme: 'TableStyleLight9', showRowStripes: true },
      columns: [
        { name: 'Data', filterButton: true },
        { name: 'Quantidade Recebida', filterButton: true },
        { name: 'Total Acumulado', filterButton: true },
        { name: 'Progresso', filterButton: false },
      ],
      rows: evolucaoData.map(item => [
        new Date(item.data + 'T00:00:00').toLocaleDateString('pt-BR'),
        item.quantidade, item.acumulado, '',
      ]),
    });

    evolucaoSheet.getColumn('A').width = 15;
    evolucaoSheet.getColumn('B').width = 20;
    evolucaoSheet.getColumn('C').width = 20;
    evolucaoSheet.getColumn('D').width = 35;

    const maxAcumulado = evolucaoData[evolucaoData.length - 1].acumulado;
    for (let i = 4; i < 4 + evolucaoData.length; i++) {
      const row = evolucaoSheet.getRow(i);
      row.getCell(2).alignment = { horizontal: 'center' };
      row.getCell(3).alignment = { horizontal: 'center' };
      row.getCell(2).font = { bold: true, color: { argb: 'FF22C55E' } };
      row.getCell(3).font = { bold: true, color: { argb: 'FF2563EB' } };
      const p = Math.round((evolucaoData[i - 4].acumulado / maxAcumulado) * 100);
      row.getCell(4).value = '█'.repeat(Math.round(p / 5)) + ` ${p}%`;
      row.getCell(4).font = { color: { argb: 'FF22C55E' }, size: 10 };
    }
  }

  // ABA 3: DETALHAMENTO
  const detSheet = workbook.addWorksheet('Detalhamento');
  detSheet.mergeCells('A1:G1');
  const detTitle = detSheet.getCell('A1');
  detTitle.value = 'Detalhamento de Todas as Pendências';
  detTitle.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  detTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
  detTitle.alignment = { vertical: 'middle', horizontal: 'center' };
  detSheet.getRow(1).height = 25;

  detSheet.addTable({
    name: 'TabelaDetalhamento',
    ref: 'A3',
    headerRow: true,
    style: { theme: 'TableStyleMedium9', showRowStripes: true },
    columns: [
      { name: 'Item', filterButton: true },
      { name: 'Local', filterButton: true },
      { name: 'Descrição', filterButton: true },
      { name: 'Situação', filterButton: true },
      { name: 'Data Recebido', filterButton: true },
      { name: 'Construtora', filterButton: true },
      { name: 'Síndico', filterButton: true },
    ],
    rows: itens.map(item => [
      item.item_numero, item.local, item.descricao,
      item.situacao === 'RECEBIDO' ? 'RECEBIDO' : item.situacao === 'NAO_FARA' ? 'NÃO FARÁ' : 'PENDENTE',
      item.data_recebido ? new Date(item.data_recebido + 'T00:00:00').toLocaleDateString('pt-BR') : '-',
      item.construtora || '-', item.sindico || '-',
    ]),
  });

  detSheet.getColumn('A').width = 8;
  detSheet.getColumn('B').width = 25;
  detSheet.getColumn('C').width = 40;
  detSheet.getColumn('D').width = 15;
  detSheet.getColumn('E').width = 15;
  detSheet.getColumn('F').width = 20;
  detSheet.getColumn('G').width = 20;

  for (let i = 4; i < 4 + itens.length; i++) {
    const row = detSheet.getRow(i);
    const sitCell = row.getCell(4);
    sitCell.alignment = { horizontal: 'center' };
    sitCell.font = { bold: true };
    const sit = itens[i - 4].situacao;
    if (sit === 'RECEBIDO') { sitCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF22C55E' } }; sitCell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; }
    else if (sit === 'NAO_FARA') { sitCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEF4444' } }; sitCell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; }
    else { sitCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF97316' } }; sitCell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; }
    row.getCell(1).alignment = { horizontal: 'center' };
    row.getCell(5).alignment = { horizontal: 'center' };
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `Evolucao_Recebimentos_${contratoNome.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
}
