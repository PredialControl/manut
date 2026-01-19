const periodicityOrder: { [key: string]: number } = {
    'Diária': 1,
    'Semanal': 2,
    'Quinzenal': 3,
    'Mensal': 4,
    'Trimestral': 5,
    'Semestral': 6,
    'Anual': 7,
  };
  
  export function getMostFrequentPeriodicity(periodicities: string[]): string {
    if (!periodicities || periodicities.length === 0) {
      return 'N/A';
    }
  
    return periodicities.sort((a, b) => {
      const orderA = periodicityOrder[a] ?? Infinity;
      const orderB = periodicityOrder[b] ?? Infinity;
      return orderA - orderB;
    })[0];
  } 