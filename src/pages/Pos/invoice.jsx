// // src/pages/Pos/invoice.jsx
// import { useEffect, useMemo, useState } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import { getSale } from "../../services/pos";
// import { FiPrinter, FiDownload } from "react-icons/fi";

// const Money = ({ value }) => <span>${Number(value || 0).toFixed(2)}</span>;

// export default function InvoicePage() {
//   const { id } = useParams();                // present for /invoice/:id
//   const { state } = useLocation();           // present for /invoice/preview or navigation with state
//   const [loading, setLoading] = useState(!state && !!id);
//   const [err, setErr] = useState(null);
//   const [data, setData] = useState(
//     state || null
//   );

//   useEffect(() => {
//     if (state || !id) return;
//     let mounted = true;
//     (async () => {
//       setLoading(true);
//       setErr(null);
//       try {
//         const { data } = await getSale(id);
//         if (!mounted) return;
//         setData({
//           id: data.invoice_number || id,
//           date: data.created_at,
//           status: data.payment_status || "paid",
//           customer: { name: "Walk-in Customer", phone: "—" }, // name/phone were in notes; show simple fallback
//           items: (data.items || []).map((it, idx) => ({
//             id: idx + 1,
//             name: it.product, // UUID; keep as-is (or do a lookup if you want)
//             price: Number(it.unit_price),
//             qty: Number(it.quantity),
//           })),
//           discount: Number(data.discount || 0),
//           vat: Number(data.vat || 0),
//           totals: {
//             subTotal: Number(data.total_amount || 0),
//             grand: Number(data.net_total || 0),
//           },
//           note: data.notes || "",
//         });
//       } catch (e) {
//         if (mounted) setErr("Failed to load invoice.");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => { mounted = false; };
//   }, [id, state]);

//   const subTotal = useMemo(
//     () => (data?.totals?.subTotal ??
//       (data?.items || []).reduce((s, it) => s + Number(it.price) * Number(it.qty), 0)),
//     [data]
//   );
//   const grandTotal = useMemo(
//     () => (data?.totals?.grand ??
//       Math.max(0, subTotal - Number(data?.discount || 0) + Number(data?.vat || 0))),
//     [data, subTotal]
//   );

//   const handlePrint = () => window.print();
//   const handleDownload = () => alert("Download PDF (coming soon)");

//   if (loading) return <div className="rounded bg-white p-4 shadow">Loading…</div>;
//   if (err) return <div className="rounded bg-white p-4 shadow text-rose-700">{err}</div>;
//   if (!data) return null;

//   return (
//     <div className="flex justify-center">
//       <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 sm:p-8 mt-6 mb-10 print:shadow-none print:p-0">
//         {/* Header */}
//         <div className="flex items-start justify-between border-b pb-4">
//           <div>
//             <h1 className="text-xl font-bold text-gray-900">Invoice</h1>
//             <p className="text-sm text-gray-500 mt-1">#{data.id}</p>
//             <p className="text-sm text-gray-500">{new Date(data.date || Date.now()).toLocaleString()}</p>
//           </div>
//           <div className="text-right">
//             <span
//               className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
//                 String(data.status).toLowerCase() === "paid"
//                   ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
//                   : "bg-amber-50 text-amber-700 border border-amber-200"
//               }`}
//             >
//               {data.status || "Unpaid"}
//             </span>
//           </div>
//         </div>

//         {/* Customer (minimal) */}
//         <div className="mt-4 rounded-lg bg-gray-50 p-4 border">
//           <div className="text-sm">
//             <div><b>Customer:</b> {data.customer?.name || "Walk-in Customer"}</div>
//             <div><b>Mobile:</b> {data.customer?.phone || "—"}</div>
//           </div>
//         </div>

//         {/* Items */}
//         <div className="mt-6 overflow-x-auto">
//           <table className="min-w-full text-sm border rounded-md overflow-hidden">
//             <thead className="bg-indigo-50 text-indigo-700">
//               <tr>
//                 <th className="px-4 py-2 text-left font-medium">Item</th>
//                 <th className="px-4 py-2 text-left font-medium">Price</th>
//                 <th className="px-4 py-2 text-left font-medium">Qty</th>
//                 <th className="px-4 py-2 text-left font-medium">Total</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y">
//               {(data.items || []).map((it) => (
//                 <tr key={it.id}>
//                   <td className="px-4 py-2 text-gray-900">{it.name}</td>
//                   <td className="px-4 py-2 text-gray-700"><Money value={it.price} /></td>
//                   <td className="px-4 py-2 text-gray-700">{it.qty}</td>
//                   <td className="px-4 py-2 text-gray-900 font-medium">
//                     <Money value={Number(it.price) * Number(it.qty)} />
//                   </td>
//                 </tr>
//               ))}
//               {(!data.items || data.items.length === 0) && (
//                 <tr><td className="px-4 py-6 text-center text-gray-500" colSpan={4}>No items found.</td></tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Totals */}
//         <div className="mt-6 rounded-lg bg-gray-50 border p-4">
//           <div className="flex justify-between text-sm">
//             <span>Subtotal</span>
//             <span><Money value={subTotal} /></span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span>Discount</span>
//             <span>-<Money value={data.discount} /></span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span>VAT</span>
//             <span><Money value={data.vat} /></span>
//           </div>
//           <div className="mt-2 border-t pt-2 flex justify-between font-semibold text-gray-900">
//             <span>Grand Total</span>
//             <span><Money value={grandTotal} /></span>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="mt-6 flex justify-end gap-3 print:hidden">
//           <button
//             onClick={handlePrint}
//             className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
//           >
//             <FiPrinter /> Print
//           </button>
//           <button
//             onClick={handleDownload}
//             className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
//           >
//             <FiDownload /> Download PDF
//           </button>
//         </div>

//         <style>{`
//           @media print {
//             @page { size: A4; margin: 16mm; }
//             .print\\:hidden { display: none !important; }
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// }


// src/pages/Pos/invoice.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getSale } from "../../services/pos";
import { listProducts } from "../../services/product";
import { FiPrinter, FiDownload } from "react-icons/fi";

const Money = ({ value }) => <span>${Number(value || 0).toFixed(2)}</span>;

// Parse "Customer: X | Mobile: Y | other notes..." into {name, phone}
function parseCustomerFromNotes(notes = "") {
  const res = { name: "Walk-in Customer", phone: "—" };
  const parts = String(notes).split("|").map(s => s.trim());
  for (const p of parts) {
    const [k, ...rest] = p.split(":");
    if (!k || !rest.length) continue;
    const key = k.trim().toLowerCase();
    const val = rest.join(":").trim();
    if (key === "customer" && val) res.name = val;
    if (key === "mobile" && val) res.phone = val;
  }
  return res;
}

export default function InvoicePage() {
  const { id } = useParams();          // /dashboard/invoice/:id
  const { state } = useLocation();     // optional preview state (not used here)
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [sale, setSale] = useState(null);
  const [productMap, setProductMap] = useState({}); // { uuid: name }

  // Build a local product map (uuid -> name) one time
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await listProducts();
        const arr = Array.isArray(data) ? data : data?.results || [];
        const map = {};
        for (const p of arr) map[p.id] = p.name || p.product_id || p.id;
        if (mounted) setProductMap(map);
      } catch {
        // ignore; we'll fallback to UUID if we can't fetch names
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Fetch the sale
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setErr(null);
        setLoading(true);
        const { data } = await getSale(id);
        if (!mounted) return;
        setSale(data);
      } catch (e) {
        if (mounted) setErr("Failed to load invoice.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  // Build a presentational model
  const view = useMemo(() => {
    if (!sale) return null;

    const customer = parseCustomerFromNotes(sale.notes);
    const items = (sale.items || []).map((it, idx) => ({
      id: idx + 1,
      // Prefer product name from map; fallback to product UUID
      name: productMap[it.product] || it.product,
      price: Number(it.unit_price || 0),
      qty: Number(it.quantity || 0),
      subtotal: Number(it.subtotal || (Number(it.unit_price || 0) * Number(it.quantity || 0))),
    }));

    // Back-end already gives totals; still compute a safe fallback
    const subTotal = Number(sale.total_amount ?? items.reduce((s, i) => s + i.subtotal, 0));
    const discount = Number(sale.discount || 0);
    const vat = Number(sale.vat || 0);
    const grand = Number(sale.net_total ?? Math.max(0, subTotal - discount + vat));

    return {
      number: sale.invoice_number || id,
      date: sale.created_at || new Date().toISOString(),
      status: sale.payment_status || "paid",
      customer,
      items,
      subTotal,
      discount,
      vat,
      grand,
    };
  }, [sale, productMap, id]);

  const handlePrint = () => window.print();
  const handleDownload = () => alert("Download PDF (coming soon)");

  if (loading) return <div className="rounded bg-white p-4 shadow">Loading…</div>;
  if (err) return <div className="rounded bg-white p-4 shadow text-rose-700">{err}</div>;
  if (!view) return null;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 sm:p-8 mt-6 mb-10 print:shadow-none print:p-0">
        {/* Header */}
        <div className="flex items-start justify-between border-b pb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Invoice</h1>
            <p className="text-sm text-gray-500 mt-1">#{view.number}</p>
            <p className="text-sm text-gray-500">
              {new Date(view.date || Date.now()).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                String(view.status).toLowerCase() === "paid"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              {view.status || "Unpaid"}
            </span>
          </div>
        </div>

        {/* Customer */}
        <div className="mt-4 rounded-lg bg-gray-50 p-4 border">
          <div className="text-sm">
            <div><b>Customer:</b> {view.customer.name}</div>
            <div><b>Mobile:</b> {view.customer.phone}</div>
          </div>
        </div>

        {/* Items */}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm border rounded-md overflow-hidden">
            <thead className="bg-indigo-50 text-indigo-700">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Item</th>
                <th className="px-4 py-2 text-left font-medium">Price</th>
                <th className="px-4 py-2 text-left font-medium">Qty</th>
                <th className="px-4 py-2 text-left font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {view.items.map((it) => (
                <tr key={it.id}>
                  <td className="px-4 py-2 text-gray-900">{it.name}</td>
                  <td className="px-4 py-2 text-gray-700"><Money value={it.price} /></td>
                  <td className="px-4 py-2 text-gray-700">{it.qty}</td>
                  <td className="px-4 py-2 text-gray-900 font-medium">
                    <Money value={it.subtotal} />
                  </td>
                </tr>
              ))}
              {view.items.length === 0 && (
                <tr><td className="px-4 py-6 text-center text-gray-500" colSpan={4}>No items found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-6 rounded-lg bg-gray-50 border p-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span><Money value={view.subTotal} /></span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Discount</span>
            <span>-<Money value={view.discount} /></span>
          </div>
          <div className="flex justify-between text-sm">
            <span>VAT</span>
            <span><Money value={view.vat} /></span>
          </div>
          <div className="mt-2 border-t pt-2 flex justify-between font-semibold text-gray-900">
            <span>Grand Total</span>
            <span><Money value={view.grand} /></span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <FiPrinter /> Print
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <FiDownload /> Download PDF
          </button>
        </div>

        <style>{`
          @media print {
            @page { size: A4; margin: 16mm; }
            .print\\:hidden { display: none !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
