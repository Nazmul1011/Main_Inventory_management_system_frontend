

// second version 

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listSales, deleteSale, sortByCreatedDesc } from "../../services/pos";

export default function InvoicesList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const { data } = await listSales();
      const arr = Array.isArray(data) ? data : data?.results || [];
      setRows(sortByCreatedDesc(arr));
    } catch (e) {
      setErr("Failed to load invoices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    if (!confirm("Delete this invoice?")) return;
    try {
      await deleteSale(id);
      setRows((r) => r.filter((x) => x.id !== id));
    } catch {
      alert("Delete failed.");
    }
  };

  const filtered = rows.filter((r) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return (
      (r.invoice_number || "").toLowerCase().includes(s) ||
      (r.payment_status || "").toLowerCase().includes(s)
    );
  });

  const money = (v) => Number(v || 0).toFixed(2);

  return (
    <div className="rounded-lg bg-white p-4 sm:p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Invoices</h2>
        <Link to="/dashboard/pos" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          New Sale
        </Link>
      </div>

      <div className="mb-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by invoice number or status…"
          className="w-full sm:max-w-xs rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {loading && <div className="rounded bg-gray-50 px-3 py-2 text-sm text-gray-700">Loading…</div>}
      {err && <div className="rounded bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</div>}

      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Invoice #</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900 font-medium">{r.invoice_number}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${
                    (r.payment_status || "").toLowerCase() === "paid"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}>
                    {r.payment_status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">${money(r.net_total ?? r.total_amount)}</td>
                <td className="px-4 py-3 text-gray-700">{new Date(r.created_at).toLocaleString()}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link to={`/dashboard/invoice/${r.id}`} className="rounded border px-2 py-1 text-xs text-gray-700 hover:bg-gray-100">View</Link>
                  <Link to={`/dashboard/invoice/${r.id}/edit`} className="rounded border px-2 py-1 text-xs text-gray-700 hover:bg-gray-100">Edit</Link>
                  <button onClick={() => onDelete(r.id)} className="rounded border px-2 py-1 text-xs text-rose-600 hover:bg-rose-50">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr><td className="px-4 py-6 text-center text-gray-500" colSpan={5}>No invoices found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
