

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
