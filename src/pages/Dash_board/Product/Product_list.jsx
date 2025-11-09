import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  listProducts,
  listCategories,
  mapProductFromApi,
} from "../../../services/product";

function StatusBadge({ status, current, reorder }) {
  let label = "In Stock";
  let cls = "bg-emerald-50 text-emerald-700";

  if (status) {
    if (status === "out_of_stock") { label = "Out of Stock"; cls = "bg-rose-50 text-rose-700"; }
    else if (status === "low_stock") { label = "Low Stock"; cls = "bg-amber-50 text-amber-700"; }
    else if (status === "inactive" || status === "archived") { label = status; cls = "bg-gray-100 text-gray-700"; }
    else { label = "In Stock"; }
  } else {
    if (Number(current) <= 0) { label = "Out of Stock"; cls = "bg-rose-50 text-rose-700"; }
    else if (Number(current) <= Number(reorder)) { label = "Low Stock"; cls = "bg-amber-50 text-amber-700"; }
  }

  return (
    <span className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

export default function ProductList() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("All");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // [{id,name,...}]

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const [{ data: pData }, { data: cData }] = await Promise.all([
          listProducts(),   // GET /api/products/
          listCategories(), // GET /api/categories/
        ]);
        const rows = (Array.isArray(pData) ? pData : pData?.results || []).map(mapProductFromApi);
        const cats = Array.isArray(cData) ? cData : cData?.results || [];

        if (!mounted) return;
        setProducts(rows);
        setCategories(cats);
      } catch (e) {
        if (mounted) setErr("Failed to load products.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCat = catFilter === "All" || p.category === catFilter;
      const matchesQ =
        q === "" ||
        (p.productId || "").toLowerCase().includes(q) ||
        (p.name || "").toLowerCase().includes(q) ||
        (p.sku || "").toLowerCase().includes(q) ||
        (p.barcode || "").toLowerCase().includes(q);
      return matchesCat && matchesQ;
    });
  }, [products, query, catFilter]);

  return (
    <div>
      {/* header row */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Products</h2>
        <Link
          to="/dashboard/product"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Product
        </Link>
      </div>

      {/* actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* search */}
        <div className="relative w-full sm:max-w-md">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Product ID, name, SKU, barcode…"
            className="w-full rounded-md border border-gray-200 bg-gray-100 pl-9 pr-3 py-2 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
          <svg className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none">
            <path d="M21 21l-4.3-4.3M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        {/* category filter */}
        <div>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* feedback */}
      {loading && (
        <div className="mt-4 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 animate-pulse">
          Loading products…
        </div>
      )}
      {err && (
        <div className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {err}
        </div>
      )}

      {/* table */}
      <div className="mt-4 overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Product ID</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Unit</th>
              <th className="px-4 py-3 font-medium">Purchase</th>
              <th className="px-4 py-3 font-medium">Sell</th>
              <th className="px-4 py-3 font-medium">Reorder</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Barcode</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-700">{p.productId}</td>
                <td className="px-4 py-3 text-gray-900 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-gray-700">{p.sku}</td>
                <td className="px-4 py-3 text-gray-700">
                  {categories.find((c) => c.id === p.category)?.name || "—"}
                </td>
                <td className="px-4 py-3 text-gray-700">{p.unit}</td>
                <td className="px-4 py-3 text-gray-700">${Number(p.purchasePrice).toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-700">${Number(p.sellPrice).toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-700">{p.reorder}</td>
                <td className="px-4 py-3 text-gray-700">{p.stock}</td>
                <td className="px-4 py-3 text-blue-600 hover:underline">{p.barcode || "—"}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={p.status} current={p.stock} reorder={p.reorder} />
                </td>
              </tr>
            ))}

            {filtered.length === 0 && !loading && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={11}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
