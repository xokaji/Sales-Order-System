import { useDispatch, useSelector } from "react-redux";
import {
  addLine,
  removeLine,
  setLineItemByCode,
  updateLineField,
} from "../salesOrderSlice";
import Button from "../../../components/common/Button";

const currency = (value) =>
  `Rs ${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0)}`;

export default function LineItemsGrid() {
  const dispatch = useDispatch();
  const { order, items } = useSelector((state) => state.salesOrder);
  const itemCodes = items.map((i) => i.itemCode);

  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-surface shadow-card">
      <datalist id="item-code-options">
        {itemCodes.map((code) => (
          <option key={code} value={code} />
        ))}
      </datalist>

      <table className="w-full min-w-[860px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-paper text-left text-ink-700">
            <th className="px-3 py-2 font-semibold">Item Code</th>
            <th className="px-3 py-2 font-semibold">Description</th>
            <th className="px-3 py-2 font-semibold">Note</th>
            <th className="px-3 py-2 text-right font-semibold">Quantity</th>
            <th className="px-3 py-2 text-right font-semibold">Price</th>
            <th className="px-3 py-2 text-right font-semibold">Tax</th>
            <th className="px-3 py-2 text-right font-semibold">Excl Amount</th>
            <th className="px-3 py-2 text-right font-semibold">Tax Amount</th>
            <th className="px-3 py-2 text-right font-semibold">Incl Amount</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {order.lines.map((line) => (
            <tr
              key={line.clientId}
              className="border-b border-line last:border-0"
            >
              <td className="px-3 py-2">
                <input
                  list="item-code-options"
                  value={line.itemCode}
                  onChange={(e) =>
                    dispatch(
                      setLineItemByCode({
                        clientId: line.clientId,
                        itemCode: e.target.value,
                      }),
                    )
                  }
                  placeholder="ITM-001"
                  className="w-28 rounded border border-line px-2 py-1 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </td>
              <td className="px-3 py-2 text-ink-700">
                {line.description || "—"}
              </td>
              <td className="px-3 py-2">
                <input
                  value={line.note || ""}
                  onChange={(e) =>
                    dispatch(
                      updateLineField({
                        clientId: line.clientId,
                        field: "note",
                        value: e.target.value,
                      }),
                    )
                  }
                  className="w-full min-w-[100px] rounded border border-line px-2 py-1 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={line.quantity}
                  onChange={(e) =>
                    dispatch(
                      updateLineField({
                        clientId: line.clientId,
                        field: "quantity",
                        value: e.target.value,
                      }),
                    )
                  }
                  className="num w-20 rounded border border-line px-2 py-1 text-right focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </td>
              <td className="num px-3 py-2 text-right text-ink-700">
                {currency(line.price)}
              </td>
              <td className="num px-3 py-2 text-right text-ink-700">
                {line.taxRate ? `${(line.taxRate * 100).toFixed(0)}%` : "—"}
              </td>
              <td className="num px-3 py-2 text-right text-ink-900">
                {currency(line.exclAmount)}
              </td>
              <td className="num px-3 py-2 text-right text-ink-900">
                {currency(line.taxAmount)}
              </td>
              <td className="num px-3 py-2 text-right font-semibold text-ink-900">
                {currency(line.inclAmount)}
              </td>
              <td className="px-3 py-2 text-center">
                <button
                  onClick={() => dispatch(removeLine(line.clientId))}
                  className="text-ink-500 hover:text-danger"
                  aria-label="Remove line"
                  title="Remove line"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-line px-3 py-2">
        <Button variant="secondary" onClick={() => dispatch(addLine())}>
          + Add Line
        </Button>
      </div>
    </div>
  );
}
