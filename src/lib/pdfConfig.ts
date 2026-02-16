export const CM_TO_PT = 28.3465;

export const pdfConfig = {
  margin: [5, 5, 5, 5],
  filename: 'relatorio.pdf',
  image: { type: 'jpeg', quality: 0.95 },
  html2canvas: {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    removeContainer: true,
    windowWidth: 1920,
  },
  jsPDF: {
    unit: 'mm',
    format: 'a4',
    orientation: 'landscape',
    compress: true,
    precision: 16,
  },
  pagebreak: {
    mode: ['css', 'avoid-all', 'legacy'],
    avoid: ['.no-break'],
  },
};
