
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { createCustomer, mapCustomerToPayload } from "../../../services/customer";

export default function CustomerAdd() {
  const navigate = useNavigate();

  // Reduced fields + NEW: active
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    active: true,             // <--- NEW default
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

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
      const payload = mapCustomerToPayload(form); // includes is_active + phone
      await createCustomer(payload);
      navigate("/dashboard/customerlist");
    } catch (error) {
      const data = error?.response?.data;
      setErr(data?.detail || data?.message || "Failed to add customer");

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
          <FiUser size={22} />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Add New Customer</h2>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="grid gap-5">
          <InputField
            label="Full Name"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="John Doe"
            icon={<FiUser size={16} />}
            required
            error={fieldErrors.name}
          />

          <InputField
            label="Mobile"
            name="mobile"
            value={form.mobile}
            onChange={onChange}
            placeholder="01XXXXXXXXX"
            icon={<FiPhone size={16} />}
            error={fieldErrors.mobile}
          />

          <InputField
            type="email"
            label="Email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="name@example.com"
            icon={<FiMail size={16} />}
            error={fieldErrors.email}
          />

          <InputField
            label="Address"
            name="address"
            value={form.address}
            onChange={onChange}
            placeholder="456 Customer Lane"
            icon={<FiMapPin size={16} />}
            error={fieldErrors.address}
          />

          {/* NEW: Active toggle */}
          <div className="flex items-center gap-3">
            <input
              id="active"
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={onChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">
              Active Customer
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-indigo-600 text-white text-sm font-medium py-2.5 hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Adding…" : "Add Customer"}
          </button>

          {err && (
            <div className="mt-2 rounded bg-red-50 px-3 py-2 text-sm text-red-600">
              {err}
            </div>
          )}
        </div>

        {/* Right: Tips */}
        <div className="hidden lg:flex flex-col items-center justify-center border-l pl-8 text-gray-600">
          <FiUser size={30} className="text-indigo-400 mb-3" />
          <h3 className="font-semibold text-lg mb-2">Customer Guidelines</h3>
          <ul className="text-sm list-disc list-inside space-y-1 text-gray-500">
            <li>Name is required</li>
            <li>One of mobile/email is recommended</li>
            <li>Address is optional</li>
            <li>Use “Active” to mark current customers</li>
          </ul>
        </div>
      </form>
    </div>
  );
}

/* ---------- Reusable Field ---------- */
function InputField({ label, icon, error, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-2.5 text-gray-400">{icon}</span>}
        <input
          {...props}
          className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 outline-none transition ${
            error ? "border-rose-400" : "border-gray-300"
          } ${icon ? "pl-9" : ""}`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
