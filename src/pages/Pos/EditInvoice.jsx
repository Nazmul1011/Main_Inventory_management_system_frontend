// second version 

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getSale, patchSale } from "../../services/pos";

export default function EditInvoice() {
  const { id } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [discount, setDiscount] = useState(0);
  const [vat, setVat] = useState(0);
  const [paid, setPaid] = useState(0);
  const [status, setStatus] = useState("paid");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const { data } = await getSale(id);
        if (!mounted) return;
        setDiscount(Number(data.discount || 0));
        setVat(Number(data.vat || 0));
        setPaid(Number(data.paid_amount ?? data.net_total ?? 0));
        setStatus(String(data.payment_status || "paid"));
        setNotes(data.notes || "");
      } catch (e) {
        if (mounted) setErr("Failed to load invoice.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const onSave = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      await patchSale(id, {
        discount: Number(discount || 0),
        vat: Number(vat || 0),
        paid_amount: Number(paid || 0),
        payment_status: status,
        notes,
      });
      nav(`/dashboard/invoice/${id}`, { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.detail || e?.response?.data?.message || "Update failed.");
    }
  };

  if (loading) return <div className="rounded bg-white p-4 shadow">Loading…</div>;
  if (err) return <div className="rounded bg-white p-4 shadow text-rose-700">{err}</div>;

  return (
    <div className="rounded-lg bg-white p-4 sm:p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Edit Invoice</h2>
        <Link to={`/dashboard/invoice/${id}`} className="text-sm text-blue-600 hover:underline">Back to Invoice</Link>
      </div>

      <form onSubmit={onSave} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Discount ($)</label>
          <input type="number" step="0.01" min="0" value={discount} onChange={(e) => setDiscount(e.target.value)}
                 className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"/>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">VAT ($)</label>
          <input type="number" step="0.01" min="0" value={vat} onChange={(e) => setVat(e.target.value)}
                 className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"/>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Paid Amount ($)</label>
          <input type="number" step="0.01" min="0" value={paid} onChange={(e) => setPaid(e.target.value)}
                 className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"/>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Payment Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option value="paid">paid</option>
            <option value="partial">partial</option>
            <option value="due">due</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
          <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"/>
        </div>
        <div className="sm:col-span-2 flex justify-end gap-3">
          <Link to={`/dashboard/invoice/${id}`} className="rounded border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</Link>
          <button className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Save Changes</button>
        </div>
      </form>
    </div>
  );
}
