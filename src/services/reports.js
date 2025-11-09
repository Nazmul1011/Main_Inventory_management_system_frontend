// import client from "./client";

// // SALES
// export async function getSalesReport(params = {}) {
//   // params: { from, to, q, page, pageSize, ... }
//   const { data } = await client.get("/reports/sales", { params });
//   return data; // { items: [...], totals: {...} } (adapt to your API)
// }

// // STOCK
// export async function getStockReport(params = {}) {
//   const { data } = await client.get("/reports/stock", { params });
//   return data; // { items: [...], totals: {...} }
// }

// // optional: server-side CSV export
// export async function exportSalesCSV(params = {}) {
//   const res = await client.get("/reports/sales/export", { params, responseType: "blob" });
//   return res.data;
// }

// first version 


// // src/services/reports.js
// import client from "./client";

// /**
//  * GET /api/v1/reports/sales/?from=YYYY-MM-DD&to=YYYY-MM-DD&search=...
//  * All params are optional.
//  */
// export const getSalesReport = ({ from, to, search } = {}) => {
//   const params = {};
//   if (from) params.from = from;
//   if (to) params.to = to;
//   if (search) params.search = search;
//   return client.get("/v1/reports/sales/", { params });
// };

// /** Map one sale item from API -> UI row for the table */
// export const mapSaleFromApi = (s) => ({
//   id: s.id,
//   date: (s.created_at || "").slice(0, 10),
//   invoice: s.invoice_number || "",
//   customer: s.customer_name || "",
//   items: Number(s.items_count ?? 0),
//   subtotal: Number(s.total_amount ?? 0),  // API field name in your screenshots
//   discount: Number(s.discount ?? 0),
//   vat: Number(s.vat ?? 0),
//   total: Number(s.net_total ?? 0),
// });

// /**
//  * Build a CSV string for client-side export.
//  * Pass in already-mapped rows (mapSaleFromApi).
//  */
// export const toSalesCSV = (rows) => {
//   const header = [
//     "Date","Invoice","Customer","Items","Subtotal","Discount","VAT","Total"
//   ];
//   const body = rows.map(r => ([
//     r.date, r.invoice, r.customer,
//     r.items,
//     r.subtotal.toFixed(2),
//     r.discount.toFixed(2),
//     r.vat.toFixed(2),
//     r.total.toFixed(2),
//   ]));
//   return [header, ...body].map(cols => cols.join(",")).join("\n");
// };



///   Second verison 

// src/services/reports.js
import client from "./client";

/** GET /api/v1/reports/sales/?from=YYYY-MM-DD&to=YYYY-MM-DD&search=... */
export const getSalesReport = (params = {}) =>
  client.get("/v1/reports/sales/", { params });

/** Map a single sale row from reports API into table-friendly shape */
export const mapReportRow = (s) => ({
  date: (s.created_at || "").slice(0, 10),
  invoice: s.invoice_number || "",
  customer: s.customer_name || "Walk-in",
  items: Number(s.items_count ?? 0),
  subtotal: Number(s.total_amount ?? 0),
  discount: Number(s.discount ?? 0),
  vat: Number(s.vat ?? 0),
  total: Number(s.net_total ?? 0),
});


export const getStockReport = (params = {}) =>
  client.get("/v1/reports/stock/", { params });

/** Map an API product row to the UI row your table expects */
export const mapStockProduct = (p = {}) => ({
  id: p.product_id || p.id,
  name: p.name || "",
  sku: p.sku || "",
  category: p.category_name || "",
  unit: p.unit || "",
  purchasePrice: Number(p.purchase_price ?? 0),
  sellPrice: Number(p.sell_price ?? 0),
  reorder: Number(p.reorder_level ?? 0),
  stock: Number(p.current_stock ?? 0),
  status: p.status || "",
  stockValueCost: Number(p.stock_value_cost ?? 0),
  stockValueRetail: Number(p.stock_value_retail ?? 0),
});

/** Map summary safely with fallbacks */
export const mapStockSummary = (s = {}) => ({
  stock_value_cost: Number(s.stock_value_cost ?? 0),
  stock_value_retail: Number(s.stock_value_retail ?? 0),
  low_stock_items: Number(s.low_stock_items ?? 0),
  out_of_stock_items: Number(s.out_of_stock_items ?? 0),
});
