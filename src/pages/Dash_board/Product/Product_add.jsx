import { useEffect, useState } from "react";
import { FiBox, FiTag } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  createProduct,
  deriveStatus,
  listCategories,
  mapFormToProductPayload,
} from "../../../services/product";

// Static unit options (match backend enum)
const UNIT_OPTS = ["kg", "litre", "loaf", "gram", "piece", "box", "set"];
// Backend status enums (snake_case)
const STATUS_OPTS = ["in_stock", "low_stock", "out_of_stock", "active", "inactive", "archived"];

export default function ProductAdd() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]); // [{id,name,description,...}]
  const [form, setForm] = useState({
    productId: "",     // ← backend: product_id
    name: "",
    sku: "",
    category: "",      // UUID
    unit: "",
    purchasePrice: "",
    sellPrice: "",
    reorder: "",
    stock: "",
    barcode: "",
    status: "",        // empty → we’ll show auto helper; backend still accepts snake_case
    description: "",
    supplier: "",      // optional UUID (keep for later)
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Load categories from API
  useEffect(() => {
    (async () => {
      try {
        const { data } = await listCategories();
        // API returns array
        const arr = Array.isArray(data) ? data : data?.results || [];
        setCategories(arr);
        // default category if empty
        if (!form.category && arr.length) {
          setForm((s) => ({ ...s, category: arr[0].id }));
        }
      } catch (_) {
        // keep empty; user can’t submit without category
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setFieldErrors({});

    // Build backend payload
    const payload = mapFormToProductPayload({
      ...form,
      // if empty string, let backend accept explicit chosen or we let helper display "auto"
      status: form.status || deriveStatus(form.stock, form.reorder),
    });

    try {
      await createProduct(payload);
      navigate("/dashboard/productlist");
    } catch (error) {
      const data = error?.response?.data;
      setErr(data?.detail || data?.message || "Failed to add product");
      if (data && typeof data === "object") {
        const fe = {};
        for (const [k, v] of Object.entries(data)) {
          if (Array.isArray(v) && v.length && typeof v[0] === "string") fe[k] = v[0];
        }
        setFieldErrors(fe);
      }
    } finally {
      setLoading(false);
    }
  };

  const autoHelper =
    !form.status || form.status === ""
      ? `Auto: ${deriveStatus(form.stock, form.reorder)}`
      : undefined;

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 transition-all duration-300 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
          <FiBox size={22} />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Add New Product</h2>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side */}
        <div className="grid gap-5">
          {/* Product ID + Name */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Product ID"
              name="productId"
              value={form.productId}
              onChange={onChange}
              placeholder="P001"
              error={fieldErrors.product_id}
              required
            />
            <InputField
              label="Product Name"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Smartphone"
              required
              error={fieldErrors.name}
            />
          </div>

          {/* SKU + Barcode */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="SKU"
              name="sku"
              value={form.sku}
              onChange={onChange}
              placeholder="sku"
              required
              error={fieldErrors.sku}
            />
            <InputField
              label="Barcode"
              name="barcode"
              value={form.barcode}
              onChange={onChange}
              placeholder="abc0009"
              required
              error={fieldErrors.barcode}
            />
          </div>

          {/* Category + Unit */}
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Category"
              name="category"
              value={form.category}
              onChange={onChange}
              options={categories.map((c) => ({ label: c.name, value: c.id }))}
              error={fieldErrors.category}
              required
            />
            <SelectField
              label="Unit"
              name="unit"
              value={form.unit}
              onChange={onChange}
              options={UNIT_OPTS.map((u) => ({ label: u, value: u }))}
              error={fieldErrors.unit}
              required
            />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              type="number"
              step="0.01"
              label="Purchase Price"
              name="purchasePrice"
              value={form.purchasePrice}
              onChange={onChange}
              required
              error={fieldErrors.purchase_price}
            />
            <InputField
              type="number"
              step="0.01"
              label="Sell Price"
              name="sellPrice"
              value={form.sellPrice}
              onChange={onChange}
              required
              error={fieldErrors.sell_price}
            />
          </div>

          {/* Reorder + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              type="number"
              label="Reorder Level"
              name="reorder"
              value={form.reorder}
              onChange={onChange}
              required
              error={fieldErrors.reorder_level}
            />
            <InputField
              type="number"
              label="Current Stock"
              name="stock"
              value={form.stock}
              onChange={onChange}
              required
              error={fieldErrors.current_stock}
            />
          </div>

          {/* Status */}
          <SelectField
            label="Status"
            name="status"
            value={form.status}
            onChange={onChange}
            options={STATUS_OPTS.map((s) => ({ label: s, value: s }))}
            helper={autoHelper}
            // optional; if left empty, we still send derived
          />

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows="3"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
            {fieldErrors.description && (
              <p className="mt-1 text-xs text-rose-600">{fieldErrors.description}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-indigo-600 text-white text-sm font-medium py-2.5 hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>

          {err && (
            <div className="mt-2 rounded bg-red-50 px-3 py-2 text-sm text-red-600">
              {err}
            </div>
          )}
        </div>

        {/* Right Side Info Panel */}
        <div className="hidden lg:flex flex-col items-center justify-center border-l pl-8 text-gray-600">
          <FiTag size={30} className="text-indigo-400 mb-3" />
          <h3 className="font-semibold text-lg mb-2">Product Guidelines</h3>
          <ul className="text-sm list-disc list-inside space-y-1 text-gray-500">
            <li>Fill all mandatory fields</li>
            <li>SKU should be unique</li>
            <li>Use valid barcode format</li>
            <li>Status can be left empty to auto-derive</li>
          </ul>
        </div>
      </form>
    </div>
  );
}

/* ---------- Reusable Input Components ---------- */
function InputField({ label, error, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
      <input
        {...props}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 outline-none transition ${
          error ? "border-rose-400" : "border-gray-300"
        }`}
      />
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, error, helper, required }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 outline-none transition ${
          error ? "border-rose-400" : "border-gray-300"
        }`}
      >
        <option value="">{`Select ${label}`}</option>
        {options.map((o) =>
          typeof o === "string" ? (
            <option key={o} value={o}>{o}</option>
          ) : (
            <option key={o.value} value={o.value}>{o.label}</option>
          )
        )}
      </select>
      {helper && <p className="mt-1 text-xs text-gray-500">{helper}</p>}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
