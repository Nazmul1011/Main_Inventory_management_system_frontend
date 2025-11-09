// import { useEffect, useMemo, useState } from "react";
// // TODO: plug your API later
// // import { getSalesReport, exportSalesCSV } from "../../../services/reports";

// function toCSV(rows) {
//   const header = [
//     "Date","Invoice","Customer","Items","Subtotal","Discount","VAT","Total"
//   ];
//   const body = rows.map(r => [
//     r.date, r.invoice, r.customer, r.items, r.subtotal, r.discount, r.vat, r.total
//   ]);
//   return [header, ...body].map(r => r.join(",")).join("\n");
// }

// export default function SalesReport() {
//   // filters
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");
//   const [q, setQ] = useState("");

//   const [rows, setRows] = useState([
//     // ---- DUMMY DATA (replace with API) ----
//     { date: "2025-09-27", invoice: "INV-10021", customer: "Alice Johnson", items: 3, subtotal: 60, discount: 5, vat: 4, total: 59 },
//     { date: "2025-09-28", invoice: "INV-10022", customer: "Brian Kim",     items: 2, subtotal: 40, discount: 0, vat: 4, total: 44 },
//     { date: "2025-09-29", invoice: "INV-10023", customer: "Walk-in",       items: 1, subtotal: 25, discount: 2, vat: 0, total: 23 },
//     { date: "2025-09-29", invoice: "INV-10024", customer: "Carla Mendes",  items: 5, subtotal: 120, discount: 10, vat: 8, total: 118 },
//   ]);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState(null);

//   useEffect(() => {
//     // On mount or when filters change, fetch (if server-side filtering)
//     // For now we keep dummy data.
//     // ------------------------------------------------------------
//     // setLoading(true);
//     // getSalesReport({ from, to, q }).then(data => setRows(data.items)).catch(() => setErr("Failed to load")).finally(()=>setLoading(false));
//     // ------------------------------------------------------------
//   }, []); // eslint-disable-line

//   const filtered = useMemo(() => {
//     const f = (r) => {
//       const inFrom = !from || r.date >= from;
//       const inTo = !to || r.date <= to;
//       const qq = q.trim().toLowerCase();
//       const inQ = !qq || r.invoice.toLowerCase().includes(qq) || r.customer.toLowerCase().includes(qq);
//       return inFrom && inTo && inQ;
//     };
//     return rows.filter(f);
//   }, [rows, from, to, q]);

//   const totals = useMemo(() => {
//     const sum = (k) => filtered.reduce((s,r)=>s+Number(r[k]||0),0);
//     return {
//       invoices: filtered.length,
//       items: filtered.reduce((s,r)=>s+Number(r.items||0),0),
//       subtotal: sum("subtotal"),
//       discount: sum("discount"),
//       vat: sum("vat"),
//       total: sum("total"),
//     };
//   }, [filtered]);

//   const onExport = () => {
//     // TODO: use your backend export if available
//     const csv = toCSV(filtered);
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url; a.download = `sales_${from || "all"}_${to || "all"}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div>
//       <div className="mb-4 flex items-center justify-between">
//         <h2 className="text-2xl font-semibold text-gray-900">Sales Report</h2>
//         <button onClick={onExport} className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
//           Export CSV
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="grid gap-3 sm:grid-cols-4">
//         <div className="sm:col-span-1">
//           <label className="text-sm text-gray-700">From</label>
//           <input type="date" value={from} onChange={e=>setFrom(e.target.value)}
//                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"/>
//         </div>
//         <div className="sm:col-span-1">
//           <label className="text-sm text-gray-700">To</label>
//           <input type="date" value={to} onChange={e=>setTo(e.target.value)}
//                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"/>
//         </div>
//         <div className="sm:col-span-2">
//           <label className="text-sm text-gray-700">Search</label>
//           <input placeholder="Invoice or customer…" value={q} onChange={e=>setQ(e.target.value)}
//                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"/>
//         </div>
//       </div>

//       {/* Stat cards */}
//       <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <div className="rounded bg-white p-4 shadow"><div className="text-sm text-gray-500">Invoices</div><div className="text-xl font-bold">{totals.invoices}</div></div>
//         <div className="rounded bg-white p-4 shadow"><div className="text-sm text-gray-500">Items Sold</div><div className="text-xl font-bold">{totals.items}</div></div>
//         <div className="rounded bg-white p-4 shadow"><div className="text-sm text-gray-500">Revenue</div><div className="text-xl font-bold">${totals.total.toFixed(2)}</div></div>
//         <div className="rounded bg-white p-4 shadow"><div className="text-sm text-gray-500">Discounts</div><div className="text-xl font-bold">${totals.discount.toFixed(2)}</div></div>
//       </div>

//       {/* Table */}
//       <div className="mt-4 overflow-x-auto rounded border bg-white">
//         <table className="min-w-full text-left text-sm">
//           <thead className="bg-gray-50 text-gray-600">
//             <tr>
//               <th className="px-4 py-3 font-medium">Date</th>
//               <th className="px-4 py-3 font-medium">Invoice</th>
//               <th className="px-4 py-3 font-medium">Customer</th>
//               <th className="px-4 py-3 font-medium">Items</th>
//               <th className="px-4 py-3 font-medium">Subtotal</th>
//               <th className="px-4 py-3 font-medium">Discount</th>
//               <th className="px-4 py-3 font-medium">VAT</th>
//               <th className="px-4 py-3 font-medium">Total</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y">
//             {filtered.map((r) => (
//               <tr key={r.invoice} className="hover:bg-gray-50">
//                 <td className="px-4 py-3 text-gray-700">{r.date}</td>
//                 <td className="px-4 py-3 text-blue-600">{r.invoice}</td>
//                 <td className="px-4 py-3 text-gray-900 font-medium">{r.customer}</td>
//                 <td className="px-4 py-3 text-gray-700">{r.items}</td>
//                 <td className="px-4 py-3 text-gray-700">${r.subtotal.toFixed(2)}</td>
//                 <td className="px-4 py-3 text-gray-700">-${r.discount.toFixed(2)}</td>
//                 <td className="px-4 py-3 text-gray-700">${r.vat.toFixed(2)}</td>
//                 <td className="px-4 py-3 text-gray-900 font-semibold">${r.total.toFixed(2)}</td>
//               </tr>
//             ))}
//             {filtered.length === 0 && !loading && (
//               <tr><td className="px-4 py-6 text-center text-gray-500" colSpan={8}>No data.</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {loading && <div className="mt-3 text-sm text-gray-600">Loading…</div>}
//       {err && <div className="mt-3 text-sm text-rose-600">{err}</div>}
//     </div>
//   );
// }

// second version 


// src/pages/Dash_board/Reports/SalesReport.jsx
// import { useEffect, useMemo, useState } from "react";
// import { getSalesReport, mapSaleFromApi, toSalesCSV } from "../../../services/report";

// export default function SalesReport() {
//   // Filters
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");
//   const [q, setQ] = useState("");

//   // Data
//   const [rows, setRows] = useState([]);
//   const [summary, setSummary] = useState({
//     invoices: 0,
//     items_sold: 0,
//     revenue: 0,
//     discounts: 0,
//   });

//   // UI state
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");

//   // Fetch with current filters
//   const fetchData = async () => {
//     setLoading(true);
//     setErr("");
//     try {
//       const { data } = await getSalesReport({ from, to, search: q });
//       const list = Array.isArray(data?.sales) ? data.sales : [];
//       setRows(list.map(mapSaleFromApi));
//       setSummary({
//         invoices: Number(data?.summary?.invoices ?? 0),
//         items_sold: Number(data?.summary?.items_sold ?? 0),
//         revenue: Number(data?.summary?.revenue ?? 0),
//         discounts: Number(data?.summary?.discounts ?? 0),
//       });
//     } catch (e) {
//       setErr("Failed to load sales report.");
//       setRows([]);
//       setSummary({ invoices: 0, items_sold: 0, revenue: 0, discounts: 0 });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Compute totals from the currently shown table (client-side)
//   const tableTotals = useMemo(() => {
//     const sum = (k) => rows.reduce((s, r) => s + Number(r[k] || 0), 0);
//     return {
//       invoices: rows.length,
//       items: sum("items"),
//       subtotal: sum("subtotal"),
//       discount: sum("discount"),
//       vat: sum("vat"),
//       total: sum("total"),
//     };
//   }, [rows]);

//   const onExport = () => {
//     const csv = toSalesCSV(rows);
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     const tag = `${from || "all"}_${to || "all"}${q ? `_q-${q.replace(/\s+/g, "_")}` : ""}`;
//     a.download = `sales_${tag}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const onReset = () => {
//     setFrom("");
//     setTo("");
//     setQ("");
//   };

//   return (
//     <div>
//       <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <h2 className="text-2xl font-semibold text-gray-900">Sales Report</h2>
//         <div className="flex gap-2">
//           <button
//             onClick={onExport}
//             className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
//           >
//             Export CSV
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="grid gap-3 sm:grid-cols-5">
//         <div className="sm:col-span-1">
//           <label className="text-sm text-gray-700">From</label>
//           <input
//             type="date"
//             value={from}
//             onChange={(e) => setFrom(e.target.value)}
//             className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
//           />
//         </div>
//         <div className="sm:col-span-1">
//           <label className="text-sm text-gray-700">To</label>
//           <input
//             type="date"
//             value={to}
//             onChange={(e) => setTo(e.target.value)}
//             className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
//           />
//         </div>
//         <div className="sm:col-span-2">
//           <label className="text-sm text-gray-700">Search</label>
//           <input
//             placeholder="Invoice or customer…"
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//             className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
//           />
//         </div>
//         <div className="sm:col-span-1 flex items-end gap-2">
//           <button
//             onClick={fetchData}
//             className="w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
//           >
//             Apply
//           </button>
//           <button
//             onClick={() => { onReset(); setTimeout(fetchData, 0); }}
//             className="w-full rounded border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//           >
//             Reset
//           </button>
//         </div>
//       </div>

//       {/* API Summary cards */}
//       <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <StatCard label="Invoices" value={summary.invoices} />
//         <StatCard label="Items Sold" value={summary.items_sold} />
//         <StatCard label="Revenue" value={formatMoney(summary.revenue)} />
//         <StatCard label="Discounts" value={formatMoney(summary.discounts)} negative />
//       </div>

//       {/* Table */}
//       <div className="mt-4 overflow-x-auto rounded border bg-white">
//         <table className="min-w-full text-left text-sm">
//           <thead className="bg-gray-50 text-gray-600">
//             <tr>
//               <th className="px-4 py-3 font-medium">Date</th>
//               <th className="px-4 py-3 font-medium">Invoice</th>
//               <th className="px-4 py-3 font-medium">Customer</th>
//               <th className="px-4 py-3 font-medium">Items</th>
//               <th className="px-4 py-3 font-medium">Subtotal</th>
//               <th className="px-4 py-3 font-medium">Discount</th>
//               <th className="px-4 py-3 font-medium">VAT</th>
//               <th className="px-4 py-3 font-medium">Total</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y">
//             {rows.map((r) => (
//               <tr key={r.id || r.invoice} className="hover:bg-gray-50">
//                 <td className="px-4 py-3 text-gray-700">{r.date}</td>
//                 <td className="px-4 py-3 text-blue-600">{r.invoice}</td>
//                 <td className="px-4 py-3 text-gray-900 font-medium">{r.customer}</td>
//                 <td className="px-4 py-3 text-gray-700">{r.items}</td>
//                 <td className="px-4 py-3 text-gray-700">{formatMoney(r.subtotal)}</td>
//                 <td className="px-4 py-3 text-gray-700">-{formatMoney(r.discount)}</td>
//                 <td className="px-4 py-3 text-gray-700">{formatMoney(r.vat)}</td>
//                 <td className="px-4 py-3 text-gray-900 font-semibold">{formatMoney(r.total)}</td>
//               </tr>
//             ))}
//             {!rows.length && !loading && (
//               <tr>
//                 <td className="px-4 py-6 text-center text-gray-500" colSpan={8}>
//                   No data.
//                 </td>
//               </tr>
//             )}
//           </tbody>

//           {/* Table footer totals (client-side sum of current rows) */}
//           {!!rows.length && (
//             <tfoot>
//               <tr className="bg-gray-50">
//                 <td className="px-4 py-3 font-medium text-gray-800" colSpan={3}>Totals (table)</td>
//                 <td className="px-4 py-3 font-medium text-gray-800">{tableTotals.items}</td>
//                 <td className="px-4 py-3 font-medium text-gray-800">{formatMoney(tableTotals.subtotal)}</td>
//                 <td className="px-4 py-3 font-medium text-gray-800">-{formatMoney(tableTotals.discount)}</td>
//                 <td className="px-4 py-3 font-medium text-gray-800">{formatMoney(tableTotals.vat)}</td>
//                 <td className="px-4 py-3 font-semibold text-gray-900">{formatMoney(tableTotals.total)}</td>
//               </tr>
//             </tfoot>
//           )}
//         </table>
//       </div>

//       {loading && <div className="mt-3 text-sm text-gray-600">Loading…</div>}
//       {err && <div className="mt-3 text-sm text-rose-600">{err}</div>}
//     </div>
//   );
// }

// /* ------- tiny UI bits ------- */
// function StatCard({ label, value, negative = false }) {
//   return (
//     <div className="rounded bg-white p-4 shadow">
//       <div className="text-sm text-gray-500">{label}</div>
//       <div className={`text-xl font-bold ${negative ? "text-rose-600" : "text-gray-900"}`}>
//         {value}
//       </div>
//     </div>
//   );
// }

// function formatMoney(n) {
//   const v = Number(n || 0);
//   return v.toLocaleString(undefined, { style: "currency", currency: "USD", minimumFractionDigits: 2 });
// }




/// third version 


import { useEffect, useMemo, useState } from "react";
import { getSalesReport, mapReportRow } from "../../../services/reports";

function toCSV(rows) {
  const header = ["Date","Invoice","Customer","Items","Subtotal","Discount","VAT","Total"];
  const body = rows.map(r => [
    r.date, r.invoice, r.customer, r.items,
    r.subtotal, r.discount, r.vat, r.total
  ]);
  return [header, ...body].map(r => r.join(",")).join("\n");
}

export default function SalesReport() {
  // filters
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [q, setQ] = useState("");

  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({
    invoices: 0, items_sold: 0, revenue: 0, discounts: 0,
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;
      if (q.trim()) params.search = q.trim();
      const { data } = await getSalesReport(params);
      const sales = Array.isArray(data?.sales) ? data.sales : [];
      setRows(sales.map(mapReportRow));
      setSummary({
        invoices: Number(data?.summary?.invoices ?? sales.length),
        items_sold: Number(data?.summary?.items_sold ?? sales.reduce((s,r)=>s+Number(r.items_count||0),0)),
        revenue: Number(data?.summary?.revenue ?? sales.reduce((s,r)=>s+Number(r.net_total||0),0)),
        discounts: Number(data?.summary?.discounts ?? sales.reduce((s,r)=>s+Number(r.discount||0),0)),
      });
    } catch {
      setErr("Failed to load sales report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []); // initial
  // Reload when filters change
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [from, to, q]);

  const totals = useMemo(() => {
    const sum = (k) => rows.reduce((s,r)=>s+Number(r[k]||0),0);
    return {
      invoices: rows.length,
      items: sum("items"),
      subtotal: sum("subtotal"),
      discount: sum("discount"),
      vat: sum("vat"),
      total: sum("total"),
    };
  }, [rows]);

  const onExport = () => {
    const csv = toCSV(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `sales_${from || "all"}_${to || "all"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Sales Report</h2>
        <button onClick={onExport} className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-4">
        <div>
          <label className="text-sm text-gray-700">From</label>
          <input type="date" value={from} onChange={e=>setFrom(e.target.value)}
                 className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"/>
        </div>
        <div>
          <label className="text-sm text-gray-700">To</label>
          <input type="date" value={to} onChange={e=>setTo(e.target.value)}
                 className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"/>
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm text-gray-700">Search</label>
          <input placeholder="Invoice or customer…" value={q} onChange={e=>setQ(e.target.value)}
                 className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"/>
        </div>
      </div>

      {/* Stat cards (API summary on top, then exact table totals) */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded bg-white p-4 shadow">
          <div className="text-sm text-gray-500">Invoices</div>
          <div className="text-xl font-bold">{summary.invoices}</div>
        </div>
        <div className="rounded bg-white p-4 shadow">
          <div className="text-sm text-gray-500">Items Sold</div>
          <div className="text-xl font-bold">{summary.items_sold}</div>
        </div>
        <div className="rounded bg-white p-4 shadow">
          <div className="text-sm text-gray-500">Revenue</div>
          <div className="text-xl font-bold">${Number(summary.revenue).toFixed(2)}</div>
        </div>
        <div className="rounded bg-white p-4 shadow">
          <div className="text-sm text-gray-500">Discounts</div>
          <div className="text-xl font-bold">${Number(summary.discounts).toFixed(2)}</div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Invoice</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Subtotal</th>
              <th className="px-4 py-3 font-medium">Discount</th>
              <th className="px-4 py-3 font-medium">VAT</th>
              <th className="px-4 py-3 font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((r) => (
              <tr key={`${r.invoice}-${r.date}`} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-700">{r.date}</td>
                <td className="px-4 py-3 text-blue-600">{r.invoice}</td>
                <td className="px-4 py-3 text-gray-900 font-medium">{r.customer}</td>
                <td className="px-4 py-3 text-gray-700">{r.items}</td>
                <td className="px-4 py-3 text-gray-700">${r.subtotal.toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-700">-${r.discount.toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-700">${r.vat.toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-900 font-semibold">${r.total.toFixed(2)}</td>
              </tr>
            ))}
            {rows.length === 0 && !loading && (
              <tr><td className="px-4 py-6 text-center text-gray-500" colSpan={8}>No data.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && <div className="mt-3 text-sm text-gray-600">Loading…</div>}
      {err && <div className="mt-3 text-sm text-rose-600">{err}</div>}
    </div>
  );
}
