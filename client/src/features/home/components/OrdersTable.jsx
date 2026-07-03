import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setSort } from "../homeSlice";

const columns = [
  { key: "invoiceno", label: "Invoice No." },
  { key: "invoicedate", label: "Invoice Date" },
  { key: "customername", label: "Customer" },
  { key: "referenceno", label: "Reference No." },
  { key: "totalexcl", label: "Total Excl." },
  { key: "totaltax", label: "Total Tax" },
  { key: "totalincl", label: "Total Incl." },
];

const currency = (value) =>
  `Rs ${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value ?? 0)}`;

const dateFmt = (value) =>
  value
    ? new Intl.DateTimeFormat("en-AU", { dateStyle: "medium" }).format(
        new Date(value),
      )
    : "";

export default function OrdersTable({ orders, sortBy, descending, status }) {
  const dispatch = useDispatch();

  if (status === "loading") {
    return (
      <div className="p-8 text-center text-sm text-ink-500">
        Loading orders…
      </div>
    );
  }

  if (status === "succeeded" && orders.length === 0) {
    return (
      <div className="p-10 text-center text-sm text-ink-500">
        No sales orders yet. Click{" "}
        <span className="font-medium text-ink-700">Add New</span> to create the
        first one.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-surface shadow-card">
      <table className="w-full min-w-[900px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-paper text-left text-ink-700">
            {columns.map((col) => {
              const active = sortBy === col.key;
              const isNumeric = col.key.startsWith("total");
              return (
                <th
                  key={col.key}
                  className={`px-4 py-3 font-semibold ${isNumeric ? "text-right" : ""}`}
                >
                  <button
                    onClick={() => dispatch(setSort(col.key))}
                    className="inline-flex items-center gap-1 hover:text-accent"
                  >
                    {col.label}
                    <span className="text-xs text-ink-500">
                      {active ? (descending ? "▼" : "▲") : "▾"}
                    </span>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr
              key={order.id}
              className={`border-b border-line last:border-0 ${idx % 2 === 1 ? "bg-paper/60" : "bg-surface"}`}
            >
              <td className="px-4 py-3">
                <Link
                  to={`/sales-order/${order.id}`}
                  className="font-medium text-accent hover:underline"
                >
                  {order.invoiceNo}
                </Link>
              </td>
              <td className="px-4 py-3 text-ink-700">
                {dateFmt(order.invoiceDate)}
              </td>
              <td className="px-4 py-3 text-ink-700">{order.customerName}</td>
              <td className="px-4 py-3 text-ink-700">
                {order.referenceNo || "—"}
              </td>
              <td className="num px-4 py-3 text-right text-ink-900">
                {currency(order.totalExcl)}
              </td>
              <td className="num px-4 py-3 text-right text-ink-900">
                {currency(order.totalTax)}
              </td>
              <td className="num px-4 py-3 text-right font-semibold text-ink-900">
                {currency(order.totalIncl)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
