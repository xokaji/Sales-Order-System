import { useSelector } from "react-redux";
import { selectOrderTotals } from "../salesOrderSlice";

const currency = (value) =>
  `Rs ${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0)}`;

export default function TotalsSection() {
  const totals = useSelector(selectOrderTotals);

  const rows = [
    { label: "Total Excl.", value: totals.totalExcl },
    { label: "Total Tax", value: totals.totalTax },
  ];

  return (
    <div className="ml-auto w-full max-w-xs">
      <dl className="flex flex-col gap-2 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <dt className="text-ink-500">{row.label}</dt>
            <dd className="num text-ink-900">{currency(row.value)}</dd>
          </div>
        ))}
        {/* Double rule above the grand total -- the ledger's closing line. */}
        <div className="mt-1 border-t-2 border-ink-900 pt-2">
          <div className="flex items-center justify-between">
            <dt className="font-semibold text-ink-900">Total Incl.</dt>
            <dd className="num text-base font-semibold text-ink-900">
              {currency(totals.totalIncl)}
            </dd>
          </div>
        </div>
      </dl>
    </div>
  );
}
