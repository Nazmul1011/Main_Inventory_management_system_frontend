
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  listCustomers,
  mapCustomerFromApi,
  updateCustomer,
  deleteCustomer,
  mapCustomerToPayload,
} from "../../../services/customer";

function PaymentBadge({ paid }) {
  const cls = paid ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700";
  return (
    <span className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${cls}`}>
      {paid ? "Paid" : "Unpaid"}
    </span>
  );
}

function ActiveBadge({ active }) {
  return active ? (
    <span className="inline-flex items-center rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
      Active
    </span>
  ) : (
    <span className="inline-flex items-center rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600">
      Inactive
    </span>
  );
}

export default function CustomerList() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const [query, setQuery] = useState("");
  const [filterActive, setFilterActive] = useState("All"); // All | Active | Inactive

  const [customers, setCustomers] = useState([]);

  // Edit modal state
  const [editing, setEditing] = useState(null); // customer row (mapped)
  const [editSaving, setEditSaving] = useState(false);
  const [editErr, setEditErr] = useState("");

  // Delete confirm state
  const [deletingId, setDeletingId] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteErr, setDeleteErr] = useState("");

  const fetchCustomers = async () => {
    setLoading(true);
    setErr(null);
    try {
      const { data } = await listCustomers(); // GET /api/customers/
      const arr = Array.isArray(data) ? data : data?.results || [];
      const rows = arr.map(mapCustomerFromApi);
      setCustomers(rows);
    } catch (e) {
      setErr("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await fetchCustomers();
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => {
      const matchesQ =
        q === "" ||
        String(c.id).includes(q) ||
        (c.name || "").toLowerCase().includes(q) ||
        (c.mobile || "").toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q);

      const matchesActive =
        filterActive === "All" ||
        (filterActive === "Active" ? c.active : !c.active);

      return matchesQ && matchesActive;
    });
  }, [customers, query, filterActive]);

  /* =========================
     Edit
     ========================= */
  const openEdit = (row) => {
    setEditErr("");
    setEditing({
      id: row.id,
      name: row.name || "",
      mobile: row.mobile || "",
      email: row.email || "",
      address: row.address || "",
      active: !!row.active,
    });
  };

  const closeEdit = () => setEditing(null);

  const saveEdit = async () => {
    if (!editing) return;
    setEditErr("");
    setEditSaving(true);
    try {
      // Build payload (sends both phone & mobile; includes is_active)
      const payload = mapCustomerToPayload({
        name: editing.name,
        mobile: editing.mobile,
        email: editing.email,
        address: editing.address,
        active: editing.active,
      });
      await updateCustomer(editing.id, payload);
      await fetchCustomers();
      closeEdit();
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        "Update failed.";
      setEditErr(msg);
    } finally {
      setEditSaving(false);
    }
  };

  /* =========================
     Delete
     ========================= */
  const confirmDelete = (id) => {
    setDeleteErr("");
    setDeletingId(id);
  };
  const cancelDelete = () => setDeletingId(null);

  const doDelete = async () => {
    if (!deletingId) return;
    setDeleteBusy(true);
    setDeleteErr("");
    try {
      await deleteCustomer(deletingId);
      await fetchCustomers();
      setDeletingId(null);
    } catch (e) {
      setDeleteErr(
        e?.response?.data?.detail ||
          e?.response?.data?.message ||
          "Delete failed."
      );
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Customers</h2>
        <Link
          to="/dashboard/customeradd"
          className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Customer
        </Link>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* search */}
        <div className="relative w-full sm:max-w-md">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, mobile, email, or ID…"
            className="w-full rounded-md border border-gray-200 bg-gray-100 pl-9 pr-3 py-2 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
          <svg className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none">
            <path d="M21 21l-4.3-4.3M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        {/* filters */}
        <div className="flex gap-2">
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          >
            {["All", "Active", "Inactive"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* feedback */}
      {loading && (
        <div className="mt-4 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 animate-pulse">
          Loading customers…
        </div>
      )}
      {err && (
        <div className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {err}
        </div>
      )}

      {/* totals */}
      <div className="mt-4 text-sm text-gray-600">
        Showing <span className="font-medium">{filtered.length}</span> customers.
      </div>

      {/* MOBILE cards */}
      <div className="mt-3 grid gap-3 md:hidden">
        {filtered.map((c) => (
          <div key={c.id} className="rounded-lg border bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm text-gray-500">#{c.id}</div>
                <div className="text-base font-semibold text-gray-900">{c.name}</div>
                <div className="text-sm text-gray-800">{c.mobile || "—"}</div>
                <div className="text-xs text-gray-500">{c.email || "—"}</div>
                <div className="text-xs text-gray-500">{c.address || "—"}</div>
                <div className="mt-1"><ActiveBadge active={c.active} /></div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => openEdit(c)}
                  className="rounded border px-3 py-1 text-xs font-medium text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(c.id)}
                  className="rounded border px-3 py-1 text-xs font-medium text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && !loading && (
          <div className="rounded-lg border bg-white p-6 text-center text-gray-500">
            No customers found.
          </div>
        )}
      </div>

      {/* DESKTOP table */}
      <div className="mt-3 overflow-x-auto rounded-lg border bg-white hidden md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Mobile</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Address</th>
              <th className="px-4 py-3 font-medium">Active</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                <td className="px-4 py-3 text-gray-900">{c.mobile || "—"}</td>
                <td className="px-4 py-3 text-gray-700">{c.email || "—"}</td>
                <td className="px-4 py-3 text-gray-700">{c.address || "—"}</td>
                <td className="px-4 py-3"><ActiveBadge active={c.active} /></td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => openEdit(c)}
                      className="rounded border px-3 py-1 text-xs font-medium text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(c.id)}
                      className="rounded border px-3 py-1 text-xs font-medium text-rose-600 border-rose-200 hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={8}>
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===== Edit Modal ===== */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-lg">
            <div className="border-b px-5 py-3">
              <h3 className="text-base font-semibold text-gray-900">Edit Customer</h3>
            </div>
            <div className="px-5 py-4 space-y-3">
              {editErr && (
                <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {editErr}
                </div>
              )}

              <Field
                label="Full Name"
                value={editing.name}
                onChange={(v) => setEditing((s) => ({ ...s, name: v }))}
              />
              <Field
                label="Mobile"
                value={editing.mobile}
                onChange={(v) => setEditing((s) => ({ ...s, mobile: v }))}
              />
              <Field
                label="Email"
                value={editing.email}
                onChange={(v) => setEditing((s) => ({ ...s, email: v }))}
              />
              <Field
                label="Address"
                value={editing.address}
                onChange={(v) => setEditing((s) => ({ ...s, address: v }))}
              />
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="active"
                  type="checkbox"
                  checked={!!editing.active}
                  onChange={(e) => setEditing((s) => ({ ...s, active: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="active" className="text-sm text-gray-700">Active</label>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t px-5 py-3">
              <button
                onClick={closeEdit}
                className="rounded border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                disabled={editSaving}
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                disabled={editSaving}
              >
                {editSaving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Delete Confirm ===== */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
            <div className="border-b px-5 py-3">
              <h3 className="text-base font-semibold text-gray-900">Delete Customer</h3>
            </div>
            <div className="px-5 py-4 space-y-2">
              {deleteErr && (
                <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {deleteErr}
                </div>
              )}
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this customer? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 border-t px-5 py-3">
              <button
                onClick={cancelDelete}
                className="rounded border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                disabled={deleteBusy}
              >
                Cancel
              </button>
              <button
                onClick={doDelete}
                className="rounded bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
                disabled={deleteBusy}
              >
                {deleteBusy ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Small field component for the modal ===== */
function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}