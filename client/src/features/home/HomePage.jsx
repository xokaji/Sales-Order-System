import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchOrders } from "./homeSlice";
import OrdersTable from "./components/OrdersTable";
import Button from "../../components/common/Button";
import StatusBanner from "../../components/common/StatusBanner";

export default function HomePage() {
  const dispatch = useDispatch();
  const { items, totalCount, pageNumber, pageSize, sortBy, descending, status, error } =
    useSelector((state) => state.home);

  useEffect(() => {
    dispatch(fetchOrders({ pageNumber, pageSize, sortBy, descending }));
  }, [dispatch, pageNumber, pageSize, sortBy, descending]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        {/* <div>
          <h1 className="text-2xl font-semibold">Sales Orders</h1>
          <p className="mt-1 text-sm text-ink-500">
            {totalCount} order{totalCount === 1 ? "" : "s"} on file
          </p>
        </div> */}
        <Link to="/sales-order/new">
          <Button variant="primary">+ Add New</Button>
        </Link>
      </div>

      {status === "failed" && <div className="mb-4"><StatusBanner>{error}</StatusBanner></div>}

      <OrdersTable orders={items} sortBy={sortBy} descending={descending} status={status} />
    </div>
  );
}
