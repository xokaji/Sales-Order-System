import { Route, Routes } from "react-router-dom";
import HomePage from "../features/home/HomePage";
import SalesOrderPage from "../features/salesOrder/SalesOrderPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sales-order/new" element={<SalesOrderPage />} />
      <Route path="/sales-order/:id" element={<SalesOrderPage />} />
    </Routes>
  );
}
