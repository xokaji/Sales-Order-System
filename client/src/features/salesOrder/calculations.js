export const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

export function calculateLineAmounts({ quantity, price, taxRate }) {
  const qty = Number(quantity) || 0;
  const unitPrice = Number(price) || 0;
  const rate = Number(taxRate) || 0;

  const exclAmount = round2(qty * unitPrice);
  const taxAmount = round2(exclAmount * rate);
  const inclAmount = round2(exclAmount + taxAmount);

  return { exclAmount, taxAmount, inclAmount };
}

export function calculateOrderTotals(lines) {
  return lines.reduce(
    (totals, line) => ({
      totalExcl: round2(totals.totalExcl + (line.exclAmount || 0)),
      totalTax: round2(totals.totalTax + (line.taxAmount || 0)),
      totalIncl: round2(totals.totalIncl + (line.inclAmount || 0)),
    }),
    { totalExcl: 0, totalTax: 0, totalIncl: 0 }
  );
}
