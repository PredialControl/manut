import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  TableOfContents, PageNumber, NumberFormat, Footer, Header, PageBreak,
  LevelFormat, BorderStyle, Table, TableRow, TableCell, WidthType, ImageRun, VerticalAlign,
} from 'docx';
// @ts-ignore
import { saveAs } from 'file-saver';
import type { ParecerTecnico, ContratoRonda } from '@/types/ronda';

const cmToTwip = (cm: number) => Math.round(cm * 567);

const ABNT_CONFIG = {
  margins: { top: cmToTwip(2.5), right: cmToTwip(2.5), bottom: cmToTwip(2.5), left: cmToTwip(2.5) },
  font: 'Arial',
  fontSize: 24,
  lineSpacing: 360,
};

function toRoman(num: number): string {
  const romanNumerals: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let result = '';
  for (const [value, numeral] of romanNumerals) {
    while (num >= value) { result += numeral; num -= value; }
  }
  return result;
}

async function loadImage(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  return await response.arrayBuffer();
}

async function createHeader(contrato: ContratoRonda, parecer: ParecerTecnico): Promise<Header> {
  let logoImage: ArrayBuffer | null = null;
  try { logoImage = await loadImage('/logo-header.png'); } catch { /* noop */ }

  const pageWidthTwips = 11906;
  const docMarginTwips = cmToTwip(2.5);
  const desiredMarginTwips = cmToTwip(0.5);
  const tableWidthTwips = pageWidthTwips - (desiredMarginTwips * 2);
  const indentTwips = -(docMarginTwips - desiredMarginTwips);

  const table = new Table({
    width: { size: tableWidthTwips, type: WidthType.DXA },
    indent: { size: indentTwips, type: WidthType.DXA },
    layout: 'fixed',
    rows: [
      new TableRow({
        height: { value: cmToTwip(2.5), rule: 'exact' },
        children: [
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: logoImage ? [new ImageRun({ data: logoImage, transformation: { width: 58, height: 58 }, type: 'png' })] : [new TextRun("Logo")] })],
            borders: { top: { style: BorderStyle.SINGLE, size: 6, color: "000000" }, bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.SINGLE, size: 6, color: "000000" } },
          }),
          new TableCell({
            width: { size: 55, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: parecer.titulo || "Relatório de Constatação", bold: true, size: 24, font: ABNT_CONFIG.font })] })],
            borders: { top: { style: BorderStyle.SINGLE, size: 6, color: "000000" }, bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.SINGLE, size: 6, color: "000000" } },
          }),
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
            children: [new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              layout: 'fixed',
              rows: [
                new TableRow({ height: { value: cmToTwip(0.8), rule: 'atLeast' }, children: [
                  new TableCell({ columnSpan: 2, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Condomínio", size: 16, bold: true })] })], borders: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, top: { style: BorderStyle.NONE } } }),
                ]}),
                new TableRow({ height: { value: cmToTwip(0.8), rule: 'atLeast' }, children: [
                  new TableCell({ width: { size: 60, type: WidthType.PERCENTAGE }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: contrato.nome, size: 14 })] })], borders: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" }, right: { style: BorderStyle.SINGLE, size: 6, color: "000000" }, left: { style: BorderStyle.NONE }, top: { style: BorderStyle.NONE } } }),
                  new TableCell({ width: { size: 40, type: WidthType.PERCENTAGE }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: "Pág: ", size: 14 }), new TextRun({ children: [PageNumber.CURRENT, "/", PageNumber.TOTAL_PAGES], size: 14 })] })], borders: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, top: { style: BorderStyle.NONE } } }),
                ]}),
                new TableRow({ height: { value: cmToTwip(0.8), rule: 'atLeast' }, children: [
                  new TableCell({ width: { size: 60, type: WidthType.PERCENTAGE }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: `Data: ${new Date(parecer.created_at).toLocaleDateString('pt-BR')}`, size: 14 })] })], borders: { right: { style: BorderStyle.SINGLE, size: 6, color: "000000" }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, top: { style: BorderStyle.NONE } } }),
                  new TableCell({ width: { size: 40, type: WidthType.PERCENTAGE }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: "Rev: 00", size: 14 })] })], borders: { bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, top: { style: BorderStyle.NONE } } }),
                ]}),
              ],
            })],
            borders: { top: { style: BorderStyle.SINGLE, size: 6, color: "000000" }, bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          }),
        ],
      }),
    ],
  });

  return new Header({ children: [table, new Paragraph({ spacing: { after: 200 } })] });
}

async function createFooter(): Promise<Footer> {
  let footerImage: ArrayBuffer | null = null;
  try { footerImage = await loadImage('/rodape-padrao.png'); } catch { /* noop */ }
  const marginTwips = cmToTwip(2.5);
  return new Footer({
    children: [new Paragraph({
      children: footerImage ? [new ImageRun({ data: footerImage, transformation: { width: 794, height: 75 }, type: 'png' })] : [],
      alignment: AlignmentType.CENTER,
      indent: { left: -marginTwips, right: -marginTwips },
    })],
  });
}

export async function generateParecerTecnicoDOCX(parecer: ParecerTecnico, contrato: ContratoRonda): Promise<void> {
  try {
    const header = await createHeader(contrato, parecer);
    const footer = await createFooter();
    const sections: any[] = [];

    // Capa
    sections.push({
      properties: { page: { margin: { ...ABNT_CONFIG.margins, header: 0, footer: 0 } } },
      children: [
        new Paragraph({ text: '', spacing: { before: cmToTwip(7) } }),
        new Paragraph({ children: [new TextRun({ text: 'PARECER', font: ABNT_CONFIG.font, size: 48, bold: true })], alignment: AlignmentType.CENTER, spacing: { after: cmToTwip(0.1) } }),
        new Paragraph({ children: [new TextRun({ text: 'TÉCNICO DE', font: ABNT_CONFIG.font, size: 48, bold: true })], alignment: AlignmentType.CENTER, spacing: { after: cmToTwip(0.1) } }),
        new Paragraph({ children: [new TextRun({ text: 'ENGENHARIA', font: ABNT_CONFIG.font, size: 48, bold: true })], alignment: AlignmentType.CENTER, spacing: { after: cmToTwip(4) } }),
        new Paragraph({ children: [new TextRun({ text: parecer.titulo.toUpperCase(), font: ABNT_CONFIG.font, size: 32, bold: true })], alignment: AlignmentType.CENTER, spacing: { after: cmToTwip(0.5) } }),
        new Paragraph({ children: [new TextRun({ text: contrato.nome.toUpperCase(), font: ABNT_CONFIG.font, size: 32, bold: true })], alignment: AlignmentType.CENTER, spacing: { after: cmToTwip(2) } }),
        new Paragraph({ children: [new PageBreak()] }),
      ],
    });

    // Conteúdo
    const contentChildren: (Paragraph | TableOfContents)[] = [];

    contentChildren.push(
      new Paragraph({ children: [new TextRun({ text: "Sumário", bold: true, size: 24, font: ABNT_CONFIG.font })], alignment: AlignmentType.CENTER, spacing: { before: cmToTwip(0.5), after: cmToTwip(0.5) } }),
      new TableOfContents("Sumário", { headingStyleRange: "1-5" }),
      new Paragraph({ children: [new PageBreak()] }),
    );

    // I – Finalidade
    contentChildren.push(new Paragraph({ text: `${toRoman(1)} – FINALIDADE DO RELATÓRIO`, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.LEFT, spacing: { before: cmToTwip(0.5), after: cmToTwip(0.3), line: ABNT_CONFIG.lineSpacing } }));
    parecer.finalidade.split('\n').filter(p => p.trim()).forEach(parag => {
      contentChildren.push(new Paragraph({ children: [new TextRun({ text: parag, font: ABNT_CONFIG.font, size: ABNT_CONFIG.fontSize })], alignment: AlignmentType.JUSTIFIED, spacing: { after: cmToTwip(0.3), line: ABNT_CONFIG.lineSpacing }, indent: { firstLine: cmToTwip(1.25) } }));
    });

    // II – Narrativa
    contentChildren.push(new Paragraph({ text: `${toRoman(2)} – NARRATIVA DO CENÁRIO`, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.LEFT, spacing: { before: cmToTwip(0.5), after: cmToTwip(0.3), line: ABNT_CONFIG.lineSpacing } }));
    parecer.narrativa_cenario.split('\n').filter(p => p.trim()).forEach(parag => {
      contentChildren.push(new Paragraph({ children: [new TextRun({ text: parag, font: ABNT_CONFIG.font, size: ABNT_CONFIG.fontSize })], alignment: AlignmentType.JUSTIFIED, spacing: { after: cmToTwip(0.3), line: ABNT_CONFIG.lineSpacing }, indent: { firstLine: cmToTwip(1.25) } }));
    });

    // Tópicos Dinâmicos
    if (parecer.topicos && parecer.topicos.length > 0) {
      const sortedTopicos = [...parecer.topicos].sort((a, b) => a.ordem - b.ordem);
      let imageCounter = 1;

      for (let i = 0; i < sortedTopicos.length; i++) {
        const topico = sortedTopicos[i];
        const topicoNumber = i + 3;

        contentChildren.push(new Paragraph({ text: `${toRoman(topicoNumber)} – ${topico.titulo.toUpperCase()}`, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.LEFT, spacing: { before: cmToTwip(0.5), after: cmToTwip(0.3), line: ABNT_CONFIG.lineSpacing } }));

        topico.descricao.split('\n').filter(p => p.trim()).forEach(parag => {
          contentChildren.push(new Paragraph({ children: [new TextRun({ text: parag, font: ABNT_CONFIG.font, size: ABNT_CONFIG.fontSize })], alignment: AlignmentType.JUSTIFIED, spacing: { after: cmToTwip(0.3), line: ABNT_CONFIG.lineSpacing }, indent: { firstLine: cmToTwip(1.25) } }));
        });

        if (topico.imagens && topico.imagens.length > 0) {
          const sortedImages = [...topico.imagens].sort((a, b) => a.ordem - b.ordem);
          for (const imagem of sortedImages) {
            const imageNumberFormatted = String(imageCounter).padStart(2, '0');
            try {
              const imageBuffer = await loadImage(imagem.url);
              contentChildren.push(new Paragraph({ children: [new ImageRun({ data: imageBuffer, transformation: { width: 400, height: 300 }, type: 'png' })], alignment: AlignmentType.CENTER, spacing: { before: cmToTwip(0.3), after: cmToTwip(0.1) } }));
              contentChildren.push(new Paragraph({ children: [new TextRun({ text: `Imagem ${imageNumberFormatted} – ${imagem.descricao}`, font: ABNT_CONFIG.font, size: 20, italics: true })], alignment: AlignmentType.CENTER, spacing: { after: cmToTwip(0.5) } }));
            } catch {
              contentChildren.push(new Paragraph({ children: [new TextRun({ text: `[Erro ao carregar Imagem ${imageNumberFormatted}]`, font: ABNT_CONFIG.font, size: 22, color: "FF0000", italics: true })], alignment: AlignmentType.CENTER, spacing: { before: cmToTwip(0.3), after: cmToTwip(0.5) } }));
            }
            imageCounter++;
          }
        }
      }
    }

    // Assinatura
    contentChildren.push(new Paragraph({ text: '', spacing: { before: cmToTwip(1), after: cmToTwip(0.3) } }));
    contentChildren.push(new Paragraph({ children: [new TextRun({ text: '_'.repeat(29), font: ABNT_CONFIG.font, size: ABNT_CONFIG.fontSize })], alignment: AlignmentType.LEFT, spacing: { after: cmToTwip(0.1) } }));
    contentChildren.push(new Paragraph({ children: [new TextRun({ text: 'Supervisor Ricardo Oliveira', font: ABNT_CONFIG.font, size: ABNT_CONFIG.fontSize, bold: true })], alignment: AlignmentType.LEFT, spacing: { after: cmToTwip(0.5) } }));

    sections.push({
      properties: { page: { margin: { ...ABNT_CONFIG.margins, header: cmToTwip(0.4), footer: 0 }, pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } } },
      headers: { default: header },
      footers: { default: footer },
      children: contentChildren,
    });

    const doc = new Document({
      sections,
      numbering: { config: [{ reference: 'parecer-numbering', levels: [{ level: 0, format: LevelFormat.UPPER_ROMAN, text: '%1', alignment: AlignmentType.LEFT }] }] },
      styles: {
        default: {
          document: { run: { font: ABNT_CONFIG.font, size: ABNT_CONFIG.fontSize }, paragraph: { spacing: { line: ABNT_CONFIG.lineSpacing } } },
          heading1: { run: { font: ABNT_CONFIG.font, size: ABNT_CONFIG.fontSize, bold: true }, paragraph: { spacing: { before: cmToTwip(0.5), after: cmToTwip(0.3), line: ABNT_CONFIG.lineSpacing } } },
        },
      },
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Parecer_Tecnico_${contrato.nome.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`);
  } catch (error) {
    console.error('Erro ao gerar DOCX:', error);
    throw error;
  }
}
