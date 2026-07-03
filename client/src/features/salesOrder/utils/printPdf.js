import html2pdf from "html2pdf.js";

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

export function printPdf(order) {
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
        <td style="text-align:right">${Number(line.quantity || 0).toFixed(2)}</td>
        <td style="text-align:right">${currency(line.price || 0)}</td>
        <td style="text-align:right">${
          line.taxRate ? `${(line.taxRate * 100).toFixed(0)}%` : "-"
        }</td>
        <td style="text-align:right">${currency(line.exclAmount || 0)}</td>
        <td style="text-align:right">${currency(line.taxAmount || 0)}</td>
        <td style="text-align:right">${currency(line.inclAmount || 0)}</td>
      </tr>
    `
    )
    .join("");

  const totalExcl = order.lines.reduce(
    (sum, line) => sum + Number(line.exclAmount || 0),
    0
  );

  const totalTax = order.lines.reduce(
    (sum, line) => sum + Number(line.taxAmount || 0),
    0
  );

  const totalIncl = order.lines.reduce(
    (sum, line) => sum + Number(line.inclAmount || 0),
    0
  );

  const element = document.createElement("div");

  element.innerHTML = `
  <div style="padding:30px;font-family:Arial,sans-serif;color:#222;">
    <h1>Sales Order</h1>

    <table style="width:100%;margin-bottom:20px;">
      <tr>
        <td>
          <strong>Customer</strong><br>
          ${escapeHtml(order.customerName || "")}<br><br>
          ${addressLines.join("<br>")}
        </td>

        <td style="text-align:right">
          <strong>Invoice No:</strong> ${escapeHtml(order.invoiceNo || "")}<br>
          <strong>Date:</strong> ${escapeHtml(order.invoiceDate || "")}<br>
          <strong>Reference:</strong> ${escapeHtml(order.referenceNo || "-")}
        </td>
      </tr>
    </table>

    <table
      border="1"
      cellspacing="0"
      cellpadding="8"
      style="width:100%;border-collapse:collapse;font-size:12px;"
    >
      <thead style="background:#f3f4f6;">
        <tr>
          <th>Item</th>
          <th>Description</th>
          <th>Note</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Tax</th>
          <th>Excl</th>
          <th>Tax</th>
          <th>Total</th>
        </tr>
      </thead>

      <tbody>
        ${lineRows}
      </tbody>
    </table>

    <div style="margin-top:25px;width:320px;margin-left:auto;">
      <table style="width:100%;">
        <tr>
          <td>Total Excl.</td>
          <td style="text-align:right">${currency(totalExcl)}</td>
        </tr>

        <tr>
          <td>Total Tax</td>
          <td style="text-align:right">${currency(totalTax)}</td>
        </tr>

        <tr style="font-weight:bold;font-size:18px;">
          <td>Total Incl.</td>
          <td style="text-align:right">${currency(totalIncl)}</td>
        </tr>
      </table>
    </div>
  </div>
  `;

  html2pdf()
    .set({
      margin: 0.5,
      filename: `SalesOrder-${order.invoiceNo || order.id}.pdf`,
      image: {
        type: "jpeg",
        quality: 1,
      },
      html2canvas: {
        scale: 2,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
    })
    .from(element)
    .save();
}