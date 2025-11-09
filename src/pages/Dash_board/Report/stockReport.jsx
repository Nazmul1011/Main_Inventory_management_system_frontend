import { useEffect, useMemo, useState } from "react";
import {
  getStockReport,
  mapStockProduct,
  mapStockSummary,
} from "../../../services/reports";

function StatusBadge({ stock, reorder }) {
  let label = "In Stock";
  let cls = "bg-emerald-50 text-emerald-700";
  if (Number(stock) <= 0) {
    label = "Out of Stock";
    cls = "bg-rose-50 text-rose-700";
  } else if (Number(stock) <= Number(reorder)) {
    label = "Low Stock";
    cls = "bg-amber-50 text-amber-700";
  }
  return (
    <span className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

export default function StockReport() {
  // API-backed state
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({
    stock_value_cost: 0,
    stock_value_retail: 0,
    low_stock_items: 0,
    out_of_stock_items: 0,
  });

  // UI state
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // categories from data
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(rows.map((r) => r.category).filter(Boolean)))],
    [rows]
  );

  // fetch from API (runs on mount and when q changes)
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        // backend supports `?search=...`
        const params = q.trim() ? { search: q.trim() } : undefined;
        const { data } = await getStockReport(params);
        if (!active) return;

        const products = Array.isArray(data?.products) ? data.products : [];
        setRows(products.map(mapStockProduct));
        setSummary(mapStockSummary(data?.summary));
      } catch (e) {
        if (active) setErr("Failed to load stock report.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [q]);

  // local category filter (API doesn’t filter by category)
  const filtered = useMemo(() => {
    if (category === "All") return rows;
    return rows.filter((r) => r.category === category);
  }, [rows, category]);

  // if API summary is for full dataset, keep it.
  // But when filtering by category, recompute card totals to reflect current view.
  const viewTotals = useMemo(() => {
    const byCat = category === "All" ? null : filtered;
    if (!byCat) {
      return {
        cost: summary.stock_value_cost,
        retail: summary.stock_value_retail,
        low: summary.low_stock_items,
        oos: summary.out_of_stock_items,
      };
    }
    const cost = filtered.reduce((s, r) => s + r.stockValueCost, 0);
    const retail = filtered.reduce((s, r) => s + r.stockValueRetail, 0);
    const low = filtered.filter((r) => r.stock > 0 && r.stock <= r.reorder).length;
    const oos = filtered.filter((r) => r.stock <= 0).length;
    return { cost, retail, low, oos };
  }, [summary, filtered, category]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Stock Report</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by product name or SKU…"
            className="w-full rounded-md border border-gray-200 bg-gray-100 pl-9 pr-3 py-2 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
          <svg
            className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21 21l-4.3-4.3M10 18a8 8 0 100-16 8 8 0 000 16z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded bg-white p-4 shadow">
          <div className="text-sm text-gray-500">Stock Value (Cost)</div>
          <div className="text-xl font-bold">${viewTotals.cost.toFixed(2)}</div>
        </div>
        <div className="rounded bg-white p-4 shadow">
          <div className="text-sm text-gray-500">Stock Value (Retail)</div>
          <div className="text-xl font-bold">${viewTotals.retail.toFixed(2)}</div>
        </div>
        <div className="rounded bg-white p-4 shadow">
          <div className="text-sm text-gray-500">Low Stock Items</div>
          <div className="text-xl font-bold">{viewTotals.low}</div>
        </div>
        <div className="rounded bg-white p-4 shadow">
          <div className="text-sm text-gray-500">Out of Stock</div>
          <div className="text-xl font-bold">{viewTotals.oos}</div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Product ID</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Unit</th>
              <th className="px-4 py-3 font-medium">Purchase Price</th>
              <th className="px-4 py-3 font-medium">Sell Price</th>
              <th className="px-4 py-3 font-medium">Reorder</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-700">{r.id}</td>
                <td className="px-4 py-3 text-gray-900 font-medium">{r.name}</td>
                <td className="px-4 py-3 text-gray-700">{r.sku}</td>
                <td className="px-4 py-3 text-gray-700">{r.category}</td>
                <td className="px-4 py-3 text-gray-700">{r.unit}</td>
                <td className="px-4 py-3 text-gray-700">${r.purchasePrice.toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-700">${r.sellPrice.toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-700">{r.reorder}</td>
                <td className="px-4 py-3 text-gray-700">{r.stock}</td>
                <td className="px-4 py-3">
                  <StatusBadge stock={r.stock} reorder={r.reorder} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={10}>
                  No data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && <div className="mt-3 text-sm text-gray-600">Loading…</div>}
      {err && <div className="mt-3 text-sm text-rose-600">{err}</div>}
    </div>
  );
}
