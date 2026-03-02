export function formatCurrencySV(amount: number, showDollarSign: boolean = false) {
  if (amount === null || amount === undefined || isNaN(amount)) return '';
  
  // Use Intl.NumberFormat for currency formatting
  const formatted = new Intl.NumberFormat('es-SV', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  if (showDollarSign) {
    return formatted;
  } else {
    return formatted.replace('USD', '');
  }
}



