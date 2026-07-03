import { useDispatch, useSelector } from "react-redux";
import { setCustomer, setHeaderField } from "../salesOrderSlice";
import Select from "../../../components/common/Select";
import Input from "../../../components/common/Input";

const addressField = (field, label) => ({ field, label });
const addressFields = [
  addressField("address1", "Address 1"),
  addressField("address2", "Address 2"),
  addressField("address3", "Address 3"),
  addressField("suburb", "Suburb"),
  addressField("state", "State"),
  addressField("postCode", "Post Code"),
];

export default function CustomerSection() {
  const dispatch = useDispatch();
  const { customers, order } = useSelector((state) => state.salesOrder);

  return (
    <div className="flex flex-col gap-3">
      <Select
        label="Customer Name"
        value={order.customerId ?? ""}
        onChange={(e) => dispatch(setCustomer(Number(e.target.value)))}
      >
        <option value="" disabled>
          Select a customer…
        </option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>

      {addressFields.map(({ field, label }) => (
        <Input
          key={field}
          label={label}
          value={order[field] || ""}
          onChange={(e) => dispatch(setHeaderField({ field, value: e.target.value }))}
          placeholder="Auto Filling Fields"
        />
      ))}
    </div>
  );
}
