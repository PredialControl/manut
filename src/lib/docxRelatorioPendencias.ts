import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
  VerticalAlign, AlignmentType, ImageRun, PageBreak, Header, Footer, PageNumber,
  BorderStyle, HeightRule, TableLayoutType,
} from 'docx';
import { saveAs } from 'file-saver';
import type { RelatorioPendencias, ContratoRonda } from '@/types/ronda';

const cmToTwip = (cm: number) => Math.round(cm * 567);

async function loadImage(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  return await response.arrayBuffer();
}

const imageCache = new Map<string, ArrayBuffer>();

async function convertImageToPNG(imageUrl: string, maxWidth: number = 1200): Promise<ArrayBuffer> {
  const cacheKey = `${imageUrl}_${maxWidth}`;
  if (imageCache.has(cacheKey)) return imageCache.get(cacheKey)!;
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) { height = (height / width) * maxWidth; width = maxWidth; }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas error')); return; }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error('Blob error')); return; }
        blob.arrayBuffer().then((buffer) => { imageCache.set(cacheKey, buffer); resolve(buffer); }).catch(reject);
      }, 'image/png', 0.92);
    };
    img.onerror = () => reject(new Error('Image load error'));
    img.src = imageUrl;
  });
}

async function createHeader(relatorio: RelatorioPendencias, contrato: ContratoRonda): Promise<Header> {
  let logoImage: ArrayBuffer | null = null;
  try { logoImage = await loadImage('/logo-header.png'); } catch { /* noop */ }

  const pageWidthTwips = 11906;
  const docMarginLeftTwips = cmToTwip(3.0);
  const desiredMarginTwips = cmToTwip(0.5);
  const tableWidthTwips = pageWidthTwips - (desiredMarginTwips * 2);
  const indentTwips = -(docMarginLeftTwips - desiredMarginTwips);

  const col1 = cmToTwip(2.5);
  const col2 = cmToTwip(11.0);
  const col3 = cmToTwip(5.0);
  const col4 = cmToTwip(2.0);

  const borderSingle = { style: BorderStyle.SINGLE, size: 6, color: "000000" } as const;
  const borderNone = { style: BorderStyle.NONE } as const;

  const table = new Table({
    width: { size: tableWidthTwips, type: WidthType.DXA },
    indent: { size: indentTwips, type: WidthType.DXA },
    layout: 'fixed',
    rows: [
      new TableRow({ height: { value: cmToTwip(0.7), rule: 'atLeast' }, children: [
        new TableCell({ width: { size: col1, type: WidthType.DXA }, rowSpan: 3, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: logoImage ? [new ImageRun({ data: logoImage, transformation: { width: 70, height: 70 }, type: 'png' })] : [new TextRun("Logo")] })], borders: { top: borderSingle, bottom: borderSingle, left: borderNone, right: borderSingle } }),
        new TableCell({ width: { size: col2, type: WidthType.DXA }, rowSpan: 3, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: relatorio.titulo || "Relatório de Pendências", bold: true, size: 24, font: 'Century Gothic' })] })], borders: { top: borderSingle, bottom: borderSingle, left: borderNone, right: borderSingle } }),
        new TableCell({ width: { size: col3 + col4, type: WidthType.DXA }, columnSpan: 2, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Condomínio", size: 16, bold: true })] })], borders: { top: borderSingle, bottom: borderSingle, left: borderNone, right: borderNone } }),
      ]}),
      new TableRow({ height: { value: cmToTwip(0.7), rule: 'atLeast' }, children: [
        new TableCell({ width: { size: col3, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: contrato.nome, size: 14 })] })], borders: { bottom: borderSingle, right: borderSingle, left: borderNone, top: borderNone } }),
        new TableCell({ width: { size: col4, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: "Pág: ", size: 14 }), new TextRun({ children: [PageNumber.CURRENT, "/", PageNumber.TOTAL_PAGES], size: 14 })] })], borders: { bottom: borderSingle, left: borderNone, right: borderNone, top: borderNone } }),
      ]}),
      new TableRow({ height: { value: cmToTwip(0.7), rule: 'atLeast' }, children: [
        new TableCell({ width: { size: col3, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: `Data: ${new Date().toLocaleDateString('pt-BR')}`, size: 14 })] })], borders: { right: borderSingle, bottom: borderNone, left: borderNone, top: borderNone } }),
        new TableCell({ width: { size: col4, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: "Rev: 00", size: 14 })] })], borders: { bottom: borderNone, left: borderNone, right: borderNone, top: borderNone } }),
      ]}),
    ],
  });

  return new Header({ children: [table, new Paragraph({ spacing: { after: 20 } })] });
}

async function createFooter(): Promise<Footer> {
  let footerImage: ArrayBuffer | null = null;
  try { footerImage = await loadImage('/rodape-padrao.png'); } catch { /* noop */ }
  return new Footer({
    children: [new Paragraph({
      children: footerImage ? [new ImageRun({ data: footerImage, transformation: { width: 794, height: 75 }, type: 'png' })] : [],
      alignment: AlignmentType.CENTER,
      indent: { left: -cmToTwip(3.0), right: -cmToTwip(2.0) },
    })],
  });
}

export async function generateRelatorioPendenciasDOCX(
  relatorio: RelatorioPendencias,
  contrato: ContratoRonda,
  onProgress?: (message: string, current: number, total: number) => void
) {
  imageCache.clear();
  const sections: any[] = [];
  const children: (Paragraph | Table)[] = [];

  // Sumário
  children.push(new Paragraph({ children: [new TextRun({ text: 'SUMÁRIO', bold: true, size: 24, font: 'Century Gothic' })], alignment: AlignmentType.CENTER, spacing: { before: 400, after: 400, line: 360 } }));

  const sumarioItems = ['I – APRESENTAÇÃO', 'II – OBJETIVO DO RELATÓRIO', 'III – REFERÊNCIA NORMATIVA', 'IV – PRINCÍPIOS E RESSALVAS', 'V – EMPREENDIMENTO', 'VI – HISTÓRICO DAS VISITAS E ATIVIDADES', 'VII – SITUAÇÃO ATUAL DAS VISTORIAS', 'VIII – ITENS QUE PRECISAM SER CORRIGIDOS'];

  if (relatorio.secoes && relatorio.secoes.length > 0) {
    relatorio.secoes.forEach((secao, i) => {
      if (secao.titulo_principal) sumarioItems.push(`    ${secao.titulo_principal}`);
    });
  }
  sumarioItems.push('IX – DOCUMENTAÇÃO TÉCNICA', 'X – CONSIDERAÇÕES FINAIS');

  sumarioItems.forEach(item => {
    children.push(new Paragraph({ children: [new TextRun({ text: item, bold: !item.startsWith('    '), size: 24, font: 'Century Gothic' })], spacing: { before: 200, after: 100, line: 360 }, indent: { left: item.startsWith('    ') ? 800 : 400 } }));
  });

  children.push(new Paragraph({ children: [new PageBreak()] }));

  // I – APRESENTAÇÃO
  children.push(new Paragraph({ children: [new TextRun({ text: 'I – APRESENTAÇÃO', bold: true, size: 24, font: 'Century Gothic' })], spacing: { before: 400, after: 300, line: 360 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: 'A etapa de Entrega/Recebimento da edificação é um momento crucial para a vida do condomínio.', size: 24, font: 'Century Gothic' })], spacing: { after: 200, line: 360 }, alignment: AlignmentType.JUSTIFIED }));

  // II – OBJETIVO
  children.push(new Paragraph({ children: [new TextRun({ text: 'II – OBJETIVO DO RELATÓRIO', bold: true, size: 28 })], spacing: { before: 400, after: 300 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: 'Este relatório tem como finalidade registrar todos os itens encontrados em vistoria, que precisam ser corrigidos no ', size: 24 }), new TextRun({ text: contrato.nome, size: 24, bold: true }), new TextRun({ text: '.', size: 24 })], spacing: { after: 400 } }));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // VIII – ITENS QUE PRECISAM SER CORRIGIDOS
  children.push(new Paragraph({ children: [new TextRun({ text: 'VIII – ITENS QUE PRECISAM SER CORRIGIDOS', bold: true, size: 24, font: 'Century Gothic' })], spacing: { before: 400, after: 300, line: 360 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: `Com base nas vistorias realizadas${relatorio.data_situacao_atual ? ` no dia ${relatorio.data_situacao_atual}` : ''} foram levantados os seguintes itens:`, size: 24, font: 'Century Gothic' })], spacing: { after: 400, line: 360 }, alignment: AlignmentType.JUSTIFIED }));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // Processar seções e pendências
  const pageWidthTwips = 11906;
  const pendTableMargin = cmToTwip(0.5);
  const pendTableWidth = pageWidthTwips - (pendTableMargin * 2);
  const pendTableIndent = -(cmToTwip(3.0) - pendTableMargin);
  const colNumWidth = cmToTwip(1.5);
  const colRestWidth = pendTableWidth - colNumWidth;

  let numeroPendenciaGlobal = 0;
  const totalPendencias = (relatorio.secoes || []).reduce((total, secao) => {
    return total + (secao.pendencias || []).length + (secao.subsecoes || []).reduce((st, sub) => st + (sub.pendencias || []).length, 0);
  }, 0);

  onProgress?.('Montando estrutura do documento...', 5, 100);

  for (let secaoIndex = 0; secaoIndex < (relatorio.secoes || []).length; secaoIndex++) {
    const secao = relatorio.secoes![secaoIndex];
    const temPendencias = (secao.pendencias || []).length > 0 || (secao.subsecoes || []).some(sub => (sub.pendencias || []).length > 0);

    if (secaoIndex > 0 && temPendencias) children.push(new Paragraph({ children: [new PageBreak()] }));

    if (secao.titulo_principal?.trim()) {
      children.push(new Paragraph({ children: [new TextRun({ text: secao.titulo_principal, bold: true, size: 28 })], spacing: { before: 400, after: 100 } }));
    }

    const borderStyle = { style: BorderStyle.SINGLE, size: 1, color: '999999' } as const;
    const cellBorders = { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle };

    const processarPendencia = async (pendencia: any) => {
      numeroPendenciaGlobal++;
      const progress = 10 + Math.floor((numeroPendenciaGlobal / totalPendencias) * 80);
      onProgress?.(`Processando pendência ${numeroPendenciaGlobal} de ${totalPendencias}...`, progress, 100);

      const tableRows: TableRow[] = [];
      const halfWidth = Math.floor(colRestWidth / 2);

      tableRows.push(new TableRow({ height: { value: cmToTwip(0.6), rule: HeightRule.ATLEAST }, children: [
        new TableCell({ width: { size: colNumWidth, type: WidthType.DXA }, rowSpan: 2, verticalAlign: VerticalAlign.CENTER, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: numeroPendenciaGlobal.toString(), bold: true, size: 44 })], alignment: AlignmentType.CENTER })], margins: { top: 40, bottom: 40, left: 50, right: 50 } }),
        new TableCell({ width: { size: colRestWidth, type: WidthType.DXA }, columnSpan: 2, verticalAlign: VerticalAlign.CENTER, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'Local: ', bold: true, size: 24 }), new TextRun({ text: pendencia.local, size: 24 })] })], margins: { top: 40, bottom: 40, left: 150, right: 150 } }),
      ]}));

      tableRows.push(new TableRow({ height: { value: cmToTwip(0.6), rule: HeightRule.ATLEAST }, children: [
        new TableCell({ width: { size: colRestWidth, type: WidthType.DXA }, columnSpan: 2, verticalAlign: VerticalAlign.CENTER, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'Pendência: ', bold: true, size: 24 }), new TextRun({ text: pendencia.descricao, size: 24 })] })], margins: { top: 40, bottom: 40, left: 150, right: 150 } }),
      ]}));

      // Fotos
      const row3Cells: TableCell[] = [];
      let photoParagraph: Paragraph;
      if (pendencia.foto_url) {
        try {
          const imageBuffer = await convertImageToPNG(pendencia.foto_url, 800);
          photoParagraph = new Paragraph({ children: [new ImageRun({ data: imageBuffer, transformation: { width: 350, height: 263 }, type: "png" })], alignment: AlignmentType.CENTER });
        } catch { photoParagraph = new Paragraph({ children: [new TextRun({ text: '[Erro imagem]', italics: true, color: 'FF0000' })] }); }
      } else { photoParagraph = new Paragraph({ text: '' }); }

      row3Cells.push(new TableCell({ width: { size: colNumWidth + halfWidth, type: WidthType.DXA }, columnSpan: 2, children: [photoParagraph], verticalAlign: VerticalAlign.CENTER, borders: cellBorders, margins: { top: 80, bottom: 80, left: 80, right: 80 } }));

      let photoDepoisParagraph: Paragraph;
      if (pendencia.foto_depois_url) {
        try {
          const imageBuffer = await convertImageToPNG(pendencia.foto_depois_url, 800);
          photoDepoisParagraph = new Paragraph({ children: [new ImageRun({ data: imageBuffer, transformation: { width: 350, height: 263 }, type: "png" })], alignment: AlignmentType.CENTER });
        } catch { photoDepoisParagraph = new Paragraph({ children: [new TextRun({ text: '[Erro imagem]', italics: true, color: 'FF0000' })] }); }
      } else { photoDepoisParagraph = new Paragraph({ text: '' }); }

      row3Cells.push(new TableCell({ width: { size: colRestWidth - halfWidth, type: WidthType.DXA }, children: [photoDepoisParagraph], verticalAlign: VerticalAlign.CENTER, borders: cellBorders, margins: { top: 80, bottom: 80, left: 80, right: 80 } }));

      tableRows.push(new TableRow({ children: row3Cells }));

      children.push(new Table({ width: { size: pendTableWidth, type: WidthType.DXA }, layout: TableLayoutType.FIXED, rows: tableRows, indent: { size: pendTableIndent, type: WidthType.DXA } }));
      children.push(new Paragraph({ text: '', spacing: { after: 150 } }));
    };

    // Pendências diretas
    let directCount = 0;
    for (const pendencia of (secao.pendencias || [])) {
      directCount++;
      await processarPendencia(pendencia);
      if (directCount % 2 === 0 && directCount < (secao.pendencias || []).length) children.push(new Paragraph({ children: [new PageBreak()] }));
    }

    // Subseções
    for (let j = 0; j < (secao.subsecoes || []).length; j++) {
      const subsecao = secao.subsecoes![j];
      children.push(new Paragraph({ children: [new TextRun({ text: `VIII.${secaoIndex + 1}${String.fromCharCode(65 + j)} – ${subsecao.titulo.replace(/^[A-Z]\s*-\s*/, '')}`, bold: true, size: 24 })], spacing: { before: 200, after: 200 } }));

      let subCount = 0;
      for (const pendencia of (subsecao.pendencias || [])) {
        subCount++;
        await processarPendencia(pendencia);
        if (subCount % 2 === 0 && subCount < (subsecao.pendencias || []).length) children.push(new Paragraph({ children: [new PageBreak()] }));
      }
    }
  }

  // X – CONSIDERAÇÕES FINAIS
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(new Paragraph({ children: [new TextRun({ text: 'X – CONSIDERAÇÕES FINAIS', bold: true, size: 24, font: 'Century Gothic' })], spacing: { before: 400, after: 300, line: 360 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: `Este Relatório foi desenvolvido para registrar as pendências do ${contrato.nome}.`, size: 24, font: 'Century Gothic' })], spacing: { after: 600, line: 360 }, alignment: AlignmentType.JUSTIFIED }));

  // Assinatura
  children.push(new Paragraph({ children: [new TextRun({ text: '_____________________________', size: 24, font: 'Century Gothic' })], spacing: { before: 400, after: 0 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: 'Supervisor Ricardo Oliveira', size: 24, font: 'Century Gothic' })], spacing: { after: 400 } }));

  const header = await createHeader(relatorio, contrato);
  const footer = await createFooter();

  sections.push({
    properties: { page: { margin: { top: cmToTwip(2.5), right: cmToTwip(2.0), bottom: cmToTwip(1.2), left: cmToTwip(3.0), header: cmToTwip(0.3), footer: cmToTwip(0.05) } } },
    headers: { default: header },
    footers: { default: footer },
    children,
  });

  const doc = new Document({
    styles: { default: { document: { run: { font: 'Century Gothic', size: 24 }, paragraph: { spacing: { line: 360, before: 0, after: 0 } } } } },
    sections,
  });

  onProgress?.('Empacotando documento final...', 95, 100);
  const blob = await Packer.toBlob(doc);
  onProgress?.('Download iniciado!', 100, 100);
  saveAs(blob, `${relatorio.titulo.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.docx`);
}
