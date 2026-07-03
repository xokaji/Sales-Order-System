const currencyFormatter = new Intl.NumberFormat("en-AU", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const currency = (value) => `Rs ${currencyFormatter.format(value ?? 0)}`;

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export function printSalesOrder(order) {
  const browserWindow = globalThis.window;
  if (!browserWindow) return;

  const printWindow = browserWindow.open("", "_blank", "width=900,height=1200");

  if (!printWindow) return;

  const addressLines = [
    order.address1,
    order.address2,
    order.address3,
    order.suburb,
    order.state,
    order.postCode,
  ]
    .filter(Boolean)
    .map(escapeHtml);

  const lineRows = order.lines
    .filter((line) => line.itemId)
    .map(
      (line) => `
        <tr>
          <td>${escapeHtml(line.itemCode)}</td>
          <td>${escapeHtml(line.description)}</td>
          <td>${escapeHtml(line.note || "")}</td>
          <td class="num">${Number(line.quantity || 0).toFixed(2)}</td>
          <td class="num">${currency(line.price || 0)}</td>
          <td class="num">${
            line.taxRate ? `${(line.taxRate * 100).toFixed(0)}%` : "—"
          }</td>
          <td class="num">${currency(line.exclAmount || 0)}</td>
          <td class="num">${currency(line.taxAmount || 0)}</td>
          <td class="num strong">${currency(line.inclAmount || 0)}</td>
        </tr>
      `,
    )
    .join("");

  const totalExcl = order.lines.reduce(
    (sum, line) => sum + Number(line.exclAmount || 0),
    0,
  );

  const totalTax = order.lines.reduce(
    (sum, line) => sum + Number(line.taxAmount || 0),
    0,
  );

  const totalIncl = order.lines.reduce(
    (sum, line) => sum + Number(line.inclAmount || 0),
    0,
  );

  printWindow.document.open();
  printWindow.document.documentElement.innerHTML = `
    <!doctype html>
    <html lang="en">
    <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Sales Order ${escapeHtml(order.invoiceNo || order.id || "Pending")}</title>

    <style>
    :root {
    color-scheme: light;
    }

    * {
    box-sizing: border-box;
    }

    body {
    margin: 0;
    padding: 32px;
    font-family: Inter, Arial, sans-serif;
    color: #1f2937;
    background: #ffffff;
    }

    .sheet {
    max-width: 1100px;
    margin: 0 auto;
    }

    .header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid #111827;
    }

    h1 {
    margin: 0 0 6px;
    font-size: 28px;
    line-height: 1.1;
    color: #111827;
    }

    .muted {
    color: #6b7280;
    }

    .meta {
    min-width: 280px;
    text-align: right;
    font-size: 14px;
    }

    .meta div {
    margin-bottom: 4px;
    }

    .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 24px;
    }

    .panel {
    border: 1px solid #d1d5db;
    border-radius: 12px;
    padding: 16px;
    }

    .panel h2 {
    margin: 0 0 12px;
    font-size: 16px;
    }

    .kv {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: 8px 12px;
    font-size: 14px;
    }

    .kv dt {
    color: #6b7280;
    }

    .kv dd {
    margin: 0;
    color: #111827;
    }

    .table-wrap {
    border: 1px solid #d1d5db;
    border-radius: 12px;
    overflow: hidden;
    }

    table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    }

    thead th {
    background: #f3f4f6;
    color: #374151;
    text-align: left;
    padding: 10px 12px;
    border-bottom: 1px solid #d1d5db;
    }

    tbody td {
    padding: 10px 12px;
    border-bottom: 1px solid #e5e7eb;
    vertical-align: top;
    }

    tbody tr:last-child td {
    border-bottom: 0;
    }

    .num {
    text-align: right;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    }

    .strong {
    font-weight: 700;
    }

    .totals {
    margin-top: 18px;
    margin-left: auto;
    width: 320px;
    border-top: 2px solid #111827;
    padding-top: 12px;
    }

    .totals-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
    }

    .totals-row.total {
    margin-top: 8px;
    font-size: 16px;
    font-weight: 700;
    }

    @media print {
    body {
        padding: 0;
    }

    .sheet {
        max-width: none;
    }
    }
    </style>
    </head>

    <body>

    <div class="sheet">

    <div class="header">

    <div>
    <h1>Sales Order</h1>
    <div class="muted">
    Invoice ${escapeHtml(order.invoiceNo || "Pending")}
    </div>
    </div>

    <div class="meta">
    <div><strong>Invoice Date:</strong> ${escapeHtml(order.invoiceDate || "")}</div>
    <div><strong>Reference No:</strong> ${escapeHtml(order.referenceNo || "-")}</div>
    <div><strong>Order ID:</strong> ${escapeHtml(order.id)}</div>
    </div>

    </div>

    <div class="grid">

    <div class="panel">

    <h2>Customer</h2>

    <dl class="kv">

    <dt>Name</dt>
    <dd>${escapeHtml(order.customerName || "")}</dd>

    <dt>Address</dt>
    <dd>${addressLines.join("<br />") || "-"}</dd>

    <dt>Note</dt>
    <dd>${escapeHtml(order.note || "-")}</dd>

    </dl>

    </div>

    <div class="panel">

    <h2>Order Details</h2>

    <dl class="kv">

    <dt>Invoice No.</dt>
    <dd>${escapeHtml(order.invoiceNo || "Assigned on save")}</dd>

    <dt>Invoice Date</dt>
    <dd>${escapeHtml(order.invoiceDate || "")}</dd>

    <dt>Reference No.</dt>
    <dd>${escapeHtml(order.referenceNo || "-")}</dd>

    </dl>

    </div>

    </div>

    <div class="table-wrap">

    <table>

    <thead>

    <tr>
    <th>Item Code</th>
    <th>Description</th>
    <th>Note</th>
    <th class="num">Quantity</th>
    <th class="num">Price</th>
    <th class="num">Tax</th>
    <th class="num">Excl Amount</th>
    <th class="num">Tax Amount</th>
    <th class="num">Incl Amount</th>
    </tr>

    </thead>

    <tbody>

    ${lineRows || '<tr><td colspan="9">No line items.</td></tr>'}

    </tbody>

    </table>

    </div>

    <div class="totals">

    <div class="totals-row">
    <span>Total Excl.</span>
    <span>${currency(totalExcl)}</span>
    </div>

    <div class="totals-row">
    <span>Total Tax</span>
    <span>${currency(totalTax)}</span>
    </div>

    <div class="totals-row total">
    <span>Total Incl.</span>
    <span>${currency(totalIncl)}</span>
    </div>

    </div>

    </div>

    <script>
    window.onload = function () {
    window.focus();
    window.print();
    window.onafterprint = function () {
        window.close();
    };
    };
    </script>

    </body>
    </html>
    `;

  printWindow.document.close();
}
