/// Third version 

// src/pages/Pos/Pos_system.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listProducts as apiListProducts } from "../../services/product";
import { createSale, buildSalePayload, mapProductToPOS } from "../../services/pos";

export default function PointOfSale() {
  const navigate = useNavigate();

  // LEFT: products
  const [query, setQuery] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [products, setProducts] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingProducts(true);
      setErr(null);
      try {
        const { data } = await apiListProducts(); // GET /api/products/
        const arr = Array.isArray(data) ? data : data?.results || [];
        const rows = arr.map(mapProductToPOS);
        if (mounted) setProducts(rows);
      } catch {
        if (mounted) setErr("Failed to load products.");
      } finally {
        if (mounted) setLoadingProducts(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        String(p.price).includes(q) ||
        String(p.id).includes(q)
    );
  }, [products, query]);

  // RIGHT: order
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discount, setDiscount] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("paid");
  const [notes, setNotes] = useState("");

  const [cart, setCart] = useState([]); // [{id,name,price,qty}]
  const [paying, setPaying] = useState(false);
  const [payErr, setPayErr] = useState(null);

  const addToCart = (product) => {
    setCart((c) => {
      const idx = c.findIndex((i) => i.id === product.id);
      if (idx > -1) {
        const next = [...c];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...c, { ...product, qty: 1 }];
    });
  };
  const updateQty = (id, qty) => {
    const q = Math.max(1, Number(qty) || 1);
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: q } : i)));
  };
  const removeLine = (id) => setCart((c) => c.filter((i) => i.id !== id));

  // totals
  const subTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const vat = Number(vatAmount || 0);
  const total = Math.max(0, subTotal - Number(discount || 0) + vat);

  const onClear = () => {
    setCart([]);
    setCustomerName("");
    setCustomerPhone("");
    setDiscount(0);
    setVatAmount(0);
    setPaymentStatus("paid");
    setNotes("");
  };

  const onPay = async () => {
    setPayErr(null);
    if (cart.length === 0) return;
    if (!customerName.trim()) { setPayErr("Please enter customer name."); return; }
    if (!customerPhone.trim()) { setPayErr("Please enter mobile number."); return; }

    setPaying(true);
    try {
      const invoiceNumber = `Invoice${Math.floor(Math.random() * 90000 + 10000)}`;

      const payload = buildSalePayload({
        invoiceNumber,
        discount,
        vat: vatAmount,
        paidAmount: total,
        paymentStatus,
        notes,
        cart,
        customerName,
        customerPhone,
      });

      const { data } = await createSale(payload);
      const saleId = data?.id;

      // Minimal state for the invoice page (fast render)
      const invoiceState = {
        id: data?.invoice_number || saleId || invoiceNumber,
        date: data?.created_at || new Date().toISOString(),
        status: data?.payment_status || paymentStatus,
        customer: { name: customerName, phone: customerPhone },
        items: (data?.items || cart).map((it, idx) => ({
          id: idx + 1,
          name: it.name ?? it.product,              // backend may return product UUID
          price: Number(it.unit_price ?? it.price),
          qty: Number(it.quantity ?? it.qty ?? 1),
        })),
        discount: Number(data?.discount ?? discount ?? 0),
        vat: Number(data?.vat ?? vatAmount ?? 0),
        totals: {
          subTotal:
            Number(data?.total_amount ??
              cart.reduce((s, i) => s + i.price * i.qty, 0)),
          grand:
            Number(data?.net_total ??
              Math.max(0, cart.reduce((s, i) => s + i.price * i.qty, 0) - Number(discount || 0) + Number(vatAmount || 0))),
        },
        note: data?.notes ?? notes ?? "",
      };

      if (saleId) {
        navigate(`/dashboard/invoice/${saleId}`, { replace: true, state: invoiceState });
      } else {
        navigate(`/dashboard/invoice/preview`,    { replace: true, state: invoiceState });
      }
    } catch (e) {
      setPayErr(
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        "Payment failed."
      );
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl rounded-lg bg-white p-4 sm:p-6 shadow">
      <h2 className="text-xl font-semibold text-gray-900">Point of Sale</h2>

      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        {/* LEFT */}
        <div className="rounded-lg border">
          <div className="flex items-center justify-between border-b p-3">
            <div className="text-sm font-medium text-gray-700">Products</div>
            <div className="relative w-1/2 min-w-[180px]">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-md border border-gray-200 bg-gray-100 pl-9 pr-3 py-2 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              <svg className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none">
                <path d="M21 21l-4.3-4.3M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {err && (
            <div className="m-3 rounded bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {err}
            </div>
          )}

          <div className="max-h-[420px] overflow-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="sticky top-0 bg-gray-50">
                <tr>
                  <th className="px-4 py-2 font-medium text-gray-600">Name</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loadingProducts ? (
                  <tr><td className="px-4 py-6 text-gray-500" colSpan={2}>Loading…</td></tr>
                ) : filteredProducts.length ? (
                  filteredProducts.map((p) => (
                    <tr
                      key={p.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => addToCart(p)}
                      title="Click to add to cart"
                    >
                      <td className="px-4 py-2 text-gray-900 font-medium">{p.name}</td>
                      <td className="px-4 py-2 text-gray-700">${p.price.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-6 text-center text-gray-500" colSpan={2}>
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT */}
        <div className="rounded-lg border p-4">
          {/* Customer */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Customer Name</label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Walk-in Customer"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Mobile Number</label>
              <input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Cart */}
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 font-medium text-gray-600">Product</th>
                  <th className="px-3 py-2 font-medium text-gray-600">Price</th>
                  <th className="px-3 py-2 font-medium text-gray-600">Qty</th>
                  <th className="px-3 py-2 font-medium text-gray-600">Line Total</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {cart.map((line) => (
                  <tr key={line.id}>
                    <td className="px-3 py-2 text-gray-900">{line.name}</td>
                    <td className="px-3 py-2 text-gray-700">${line.price.toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="1"
                        value={line.qty}
                        onChange={(e) => updateQty(line.id, e.target.value)}
                        className="w-16 rounded border border-gray-300 px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-3 py-2 text-gray-900">
                      ${(line.qty * line.price).toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => removeLine(line.id)}
                        className="rounded border px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {cart.length === 0 && (
                  <tr>
                    <td className="px-3 py-6 text-center text-gray-500" colSpan={5}>
                      No items in cart. Click a product on the left to add.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Discount, VAT, Status */}
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Discount ($)</label>
              <input
                type="number" min="0" step="0.01"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">VAT ($)</label>
              <input
                type="number" min="0" step="0.01"
                value={vatAmount}
                onChange={(e) => setVatAmount(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="paid">paid</option>
                <option value="partial">partial</option>
                <option value="due">due</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-3">
            <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="if have any comment"
            />
          </div>

          {/* Summary */}
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${subTotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Discount</span><span>-${Number(discount || 0).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>VAT</span><span>${vat.toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold text-gray-900"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>

          {payErr && (
            <div className="mt-3 rounded bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {payErr}
            </div>
          )}

          {/* Actions */}
          <div className="mt-5 flex justify-end gap-3">
            <button onClick={onClear} className="rounded border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
              Clear
            </button>
            <button
              disabled={cart.length === 0 || paying}
              onClick={onPay}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {paying ? "Processing…" : "Process Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
