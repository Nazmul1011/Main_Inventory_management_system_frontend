
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiPhone, FiMail, FiHome, FiBriefcase } from "react-icons/fi";
import { createSupplier, mapSupplierToPayload } from "../../../services/supplier";

export default function AddSupplier() {
  const navigate = useNavigate();

  // Minimal fields, like customers
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    active: true,
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({}); // DRF per-field errors

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setFieldErrors({});

    try {
      const payload = mapSupplierToPayload(form);
      await createSupplier(payload);                 // POST /api/suppliers/
      navigate("/dashboard/supplierlist");
    } catch (error) {
      const data = error?.response?.data;
      setErr(data?.detail || data?.message || "Failed to add supplier");

      // collect per-field errors if present
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

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 transition-all duration-300 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
          <FiBriefcase size={22} />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Add Supplier</h2>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="grid gap-5">
          <InputField
            label="Name"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Supplier Name"
            icon={<FiUser size={16} />}
            required
            error={fieldErrors.name}
          />

          {/* <InputField
            type="email"
            label="Email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="contact@company.com"
            icon={<FiMail size={16} />}
            error={fieldErrors.contact_email || fieldErrors.email}
          /> */}

          <InputField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="123-456-7890"
            icon={<FiPhone size={16} />}
            error={fieldErrors.phone}
          />

          <TextAreaField
            label="Address"
            name="address"
            value={form.address}
            onChange={onChange}
            placeholder="Full address"
            icon={<FiHome size={16} />}
            error={fieldErrors.address}
          />

          <div className="flex items-center gap-3 mt-2">
            <input
              id="active"
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={onChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">
              Active Supplier
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-indigo-600 text-white text-sm font-medium py-2.5 hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Adding…" : "Add Supplier"}
          </button>

          {err && (
            <div className="mt-2 rounded bg-red-50 px-3 py-2 text-sm text-red-600">
              {err}
            </div>
          )}
        </div>

        {/* Right-side Info Box */}
        <div className="hidden lg:flex flex-col items-center justify-center border-l pl-8 text-gray-600">
          <FiBriefcase size={30} className="text-indigo-400 mb-3" />
          <h3 className="font-semibold text-lg mb-2">Supplier Guidelines</h3>
          <ul className="text-sm list-disc list-inside space-y-1 text-gray-500">
            <li>Name is required</li>
            <li>Provide a valid phone or email</li>
            <li>Use “Active” for ongoing partners</li>
          </ul>
        </div>
      </form>
    </div>
  );
}

/* ---------- Reusable Input Components ---------- */
function InputField({ label, icon, error, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-2.5 text-gray-400">{icon}</span>}
        <input
          {...props}
          className={`w-full rounded-lg border px-3 py-2 text-sm 
            ${icon ? "pl-9" : ""} 
            ${error ? "border-rose-400" : "border-gray-300"}
            focus:ring-2 focus:ring-indigo-400 outline-none transition`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

function TextAreaField({ label, icon, error, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-3 text-gray-400">{icon}</span>}
        <textarea
          {...props}
          rows="3"
          className={`w-full rounded-lg border px-3 py-2 text-sm 
            ${icon ? "pl-9" : ""} 
            ${error ? "border-rose-400" : "border-gray-300"}
            focus:ring-2 focus:ring-indigo-400 outline-none transition`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
