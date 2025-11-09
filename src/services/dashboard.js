// import client from "./client";

// /**
//  * Get dashboard summary KPIs
//  * Example response (adjust to your backend):
//  * {
//  *   totalStockValue: 250000,
//  *   todaySales: 5000,
//  *   monthSales: 75000,
//  *   lowStockCount: 15,
//  *   deltas: { total:"+10%", today:"+5%", month:"+12%", low:"-3%" }
//  * }
//  */
// export async function getDashboardSummary() {
//   // TODO: update endpoint when backend gives you the route
//   const { data } = await client.get("/dashboard/summary");
//   return data;
// }

// /**
//  * Get sales by day (e.g. last 30 days)
//  * Expected shape: [{ day: 1, value: 1200 }, { day: 2, value: 900 }, ...]
//  */
// export async function getSalesByDay(params = { lastDays: 30 }) {
//   const { data } = await client.get("/dashboard/sales-by-day", { params });
//   return data;
// }

// /**
//  * Get top products by sales
//  * Expected shape: [{ label:"Product A", value: 100 }, ...]
//  */
// export async function getTopProducts(params = { limit: 5 }) {
//   const { data } = await client.get("/dashboard/top-products", { params });
//   return data;
// }




///second new version : 

// // src/services/dashboard.js
// import client from "./client";

// // profile (already in auth.js, but duplicate here if you prefer)
// export const getProfile = () => client.get("/user-profile/");

// // KPIs summary (backend should return totals)
// export const getKpis = () => client.get("/dashboard/summary/");
// // expected: { total_products, total_customers, total_suppliers, today_sales, month_sales }

// // recent sales/orders
// export const getRecentSales = (limit = 10) =>
//   client.get(`/sales/recent/?limit=${limit}`);

// // low stock items
// export const getLowStock = (threshold = 5, limit = 10) =>
//   client.get(`/products/low-stock/?threshold=${threshold}&limit=${limit}`);

// // top products by sales (for chart/table)
// export const getTopProducts = (limit = 5) =>
//   client.get(`/reports/top-products/?limit=${limit}`);

// // stock report snapshot
// export const getStockSnapshot = () =>
//   client.get("/reports/stock-snapshot/"); // { in_stock, out_of_stock, low_stock }

// src/services/dashboard.js
















// import client from "./client";

// /**
//  * SUMMARY
//  * GET /api/dashboard/summary/
//  * Expected:
//  * { total_products, total_stock_value, total_suppliers, low_stock_items }
//  */
// export const getKpis = () => client.get("/dashboard/summary/");

// /**
//  * RECENT SALES / ORDERS (for 7-day trend or latest invoices)
//  * GET /api/sales/recent/?limit=7
//  * Expected item fields (any that exist will be used):
//  * { date|created_at, total|amount }
//  */
// export const getRecentSales = (limit = 7) =>
//   client.get(`/sales/recent/`, { params: { limit } });

// /**
//  * LOW STOCK
//  * GET /api/products/low-stock/?threshold=5&limit=10
//  * Expected item fields:
//  * { name, sku, stock_qty|quantity }
//  */
// export const getLowStock = (threshold = 5, limit = 10) =>
//   client.get(`/products/low-stock/`, { params: { threshold, limit } });

// /**
//  * TOP PRODUCTS
//  * GET /api/reports/top-products/?limit=5
//  * Expected item fields:
//  * { name|product_name, category|category_name, units|qty, revenue }
//  */
// export const getTopProducts = (limit = 5) =>
//   client.get(`/reports/top-products/`, { params: { limit } });

// /**
//  * (Optional) MONTHLY STOCK VALUE
//  * If you have it:
//  * GET /api/reports/stock-value-monthly/
//  * Expected:
//  * { labels: [...], values: [...] }
//  */
// export const getMonthlyStockValue = () =>
//   client.get(`/reports/stock-value-monthly/`);



// uses your existing axios client (same one used by customer.js)
import client from "./client";

// GET {{local}}/api/v1/dashboard/inventory/
export const getInventoryDashboard = () =>
  client.get("/v1/dashboard/inventory/");
