import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function AppShell() {
  const location = useLocation();
  const pageLabel = location.pathname.startsWith("/sales-order")
    ? "Sales Orders"
    : "Home";

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-ink-900">
        <div className="mx-auto flex max-w-7xl justify-center px-6 py-4 text-white">
          <span className="font-display text-lg font-semibold text-white">
            {pageLabel}
          </span>
        </div>
      </header>
      <main>
        <AppRoutes />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
