import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  loadLookups,
  loadOrder,
  resetOrder,
  saveOrder,
} from "./salesOrderSlice";
import CustomerSection from "./components/CustomerSection";
import OrderMetaSection from "./components/OrderMetaSection";
import LineItemsGrid from "./components/LineItemsGrid";
import TotalsSection from "./components/TotalsSection";
import { printSalesOrder } from "./utils/printSalesOrder";
import { printPdf } from "./utils/printPdf";
import Button from "../../components/common/Button";
import StatusBanner from "../../components/common/StatusBanner";

export default function SalesOrderPage() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order, saveStatus, loadStatus, error } = useSelector(
    (state) => state.salesOrder,
  );

  useEffect(() => {
    dispatch(loadLookups());
    if (isNew) {
      dispatch(resetOrder());
    } else {
      dispatch(loadOrder(id));
    }
  }, [dispatch, id, isNew]);

  const handleSave = () => {
    dispatch(saveOrder()).then((result) => {
      if (saveOrder.fulfilled.match(result)) {
        navigate(`/sales-order/${result.payload.id}`, { replace: true });
      }
    });
  };

  const handlePrint = () => {
    printPdf(order);
    printSalesOrder(order);
  };

  if (!isNew && loadStatus === "loading") {
    return (
      <div className="p-10 text-center text-sm text-ink-500">
        Loading order…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        {/* <div>
          <h1 className="text-2xl font-semibold">Sales Order</h1>
          <p className="mt-1 text-sm text-ink-500">
            {isNew ? "Create a new order" : "Edit order"}
          </p>
        </div> */}
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={saveStatus === "saving"}
        >
          {saveStatus === "saving" ? "Saving…" : "✓ Save Order"}
        </Button>
      </div>

      {error && (
        <div className="mb-4">
          <StatusBanner>{error}</StatusBanner>
        </div>
      )}
      {saveStatus === "succeeded" && (
        <div className="mb-4">
          <StatusBanner tone="success">Order saved.</StatusBanner>
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-8 rounded-lg border border-line bg-surface p-6 shadow-card md:grid-cols-2">
        <CustomerSection />
        <OrderMetaSection />
      </div>

      <div className="mb-6">
        <LineItemsGrid />
      </div>

      <div className="mb-6 flex justify-start">
        <Button variant="secondary" onClick={handlePrint}>
          Print Order
        </Button>
      </div>

      <TotalsSection />
    </div>
  );
}
