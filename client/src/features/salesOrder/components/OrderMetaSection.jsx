import { useDispatch, useSelector } from "react-redux";
import { setHeaderField } from "../salesOrderSlice";
import Input from "../../../components/common/Input";

export default function OrderMetaSection() {
  const dispatch = useDispatch();
  const { order } = useSelector((state) => state.salesOrder);
  const set = (field) => (e) => dispatch(setHeaderField({ field, value: e.target.value }));

  return (
    <div className="flex flex-col gap-3">
      <Input label="Invoice No." value={order.invoiceNo || "Assigned on save"} disabled />
      <Input label="Invoice Date" type="date" value={order.invoiceDate} onChange={set("invoiceDate")} />
      <Input label="Reference No" value={order.referenceNo || ""} onChange={set("referenceNo")} />
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-ink-700">Note</span>
        <textarea
          className="min-h-[104px] rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink-900
            shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          value={order.note || ""}
          onChange={set("note")}
        />
      </label>
    </div>
  );
}
