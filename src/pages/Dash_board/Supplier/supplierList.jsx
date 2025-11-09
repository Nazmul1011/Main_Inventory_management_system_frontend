// import { useEffect, useMemo, useState } from "react";
// // TODO: import { getSuppliers } from "../../../services/supplier";

// function ActiveBadge({ active }) {
//   return active ? (
//     <span className="inline-flex items-center rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
//       Active
//     </span>
//   ) : (
//     <span className="inline-flex items-center rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600">
//       Inactive
//     </span>
//   );
// }

// export default function SupplierList() {
//   const [query, setQuery] = useState("");
//   const [suppliers, setSuppliers] = useState([
//     // ---- DUMMY DATA ----
//     { id: 5001, name: "John Supplies", company: "Global Traders", mobile: "555-1234", email: "john@supplies.com", address: "123 Road, City", active: true },
//     { id: 5002, name: "Sarah Lee", company: "Fresh Foods Ltd.", mobile: "555-5678", email: "sarah@freshfoods.com", address: "456 Street, City", active: false },
//     { id: 5003, name: "Mark Tailor", company: "Tailor Tools", mobile: "555-9999", email: "mark@tailortools.com", address: "789 Avenue, City", active: true },
//   ]);

//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState(null);

//   useEffect(() => {
//     // ----------------------------------------------------
//     // setLoading(true);
//     // getSuppliers({ q: query }).then(data => setSuppliers(data.items)).catch(()=>setErr("Failed to load")).finally(()=>setLoading(false));
//     // ----------------------------------------------------
//   }, []); // eslint-disable-line

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     return suppliers.filter(
//       (s) =>
//         q === "" ||
//         String(s.id).includes(q) ||
//         s.name.toLowerCase().includes(q) ||
//         s.company.toLowerCase().includes(q) ||
//         s.mobile.includes(q)
//     );
//   }, [suppliers, query]);

//   return (
//     <div>
//       <div className="mb-4 flex items-center justify-between">
//         <h2 className="text-2xl font-semibold text-gray-900">Suppliers</h2>
//       </div>

//       {/* Search */}
//       <div className="mb-3">
//         <input
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search suppliers by name, company, or mobile…"
//           className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//         />
//       </div>

//       {/* ---------- MOBILE (cards) ---------- */}
//       <div className="mt-3 grid gap-3 md:hidden">
//         {filtered.map((s) => (
//           <div key={s.id} className="rounded-lg border bg-white p-4 shadow-sm">
//             <div className="font-semibold text-gray-900">{s.name}</div>
//             <div className="text-sm text-gray-700">{s.company}</div>
//             <div className="text-sm text-gray-700">{s.mobile}</div>
//             <div className="text-xs text-gray-500">{s.email}</div>
//             <div className="text-xs text-gray-500">{s.address}</div>
//             <div className="mt-2"><ActiveBadge active={s.active} /></div>
//           </div>
//         ))}
//         {filtered.length === 0 && !loading && (
//           <div className="rounded-lg border bg-white p-6 text-center text-gray-500">No suppliers found.</div>
//         )}
//       </div>

//       {/* ---------- DESKTOP (table) ---------- */}
//       <div className="mt-3 overflow-x-auto rounded-lg border bg-white hidden md:block">
//         <table className="min-w-full text-left text-sm">
//           <thead className="bg-gray-50 text-gray-600">
//             <tr>
//               <th className="px-4 py-3 font-medium">ID</th>
//               <th className="px-4 py-3 font-medium">Name</th>
//               <th className="px-4 py-3 font-medium">Company</th>
//               <th className="px-4 py-3 font-medium">Mobile</th>
//               <th className="px-4 py-3 font-medium">Email</th>
//               <th className="px-4 py-3 font-medium">Address</th>
//               <th className="px-4 py-3 font-medium">Active</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y">
//             {filtered.map((s) => (
//               <tr key={s.id} className="hover:bg-gray-50">
//                 <td className="px-4 py-3 text-gray-700">{s.id}</td>
//                 <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
//                 <td className="px-4 py-3 text-gray-700">{s.company}</td>
//                 <td className="px-4 py-3 text-gray-700">{s.mobile}</td>
//                 <td className="px-4 py-3 text-gray-700">{s.email}</td>
//                 <td className="px-4 py-3 text-gray-700">{s.address}</td>
//                 <td className="px-4 py-3"><ActiveBadge active={s.active} /></td>
//               </tr>
//             ))}
//             {filtered.length === 0 && !loading && (
//               <tr>
//                 <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
//                   No suppliers found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {loading && <div className="mt-4 text-sm text-gray-600">Loading suppliers…</div>}
//       {err && <div className="mt-4 text-sm text-rose-600">{err}</div>}
//     </div>
//   );
// }


import { useEffect, useMemo, useState } from "react";
import {
  listSuppliers,
  mapSupplierFromApi,
  updateSupplier,
  deleteSupplier,
  mapSupplierToPayload,
} from "../../../services/supplier";

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

export default function SupplierList() {
  const [query, setQuery] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err,   setErr] = useState(null);
  const [filterActive, setFilterActive] = useState("All"); // All | Active | Inactive

  // Edit modal
  const [editing, setEditing] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editErr, setEditErr] = useState("");

  // Delete confirm
  const [deletingId, setDeletingId] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteErr, setDeleteErr] = useState("");

  const fetchSuppliers = async () => {
    setLoading(true);
    setErr(null);
    try {
      const { data } = await listSuppliers(); // GET /api/suppliers/
      const arr = Array.isArray(data) ? data : data?.results || [];
      setSuppliers(arr.map(mapSupplierFromApi));
    } catch (e) {
      setErr("Failed to load suppliers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await fetchSuppliers();
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return suppliers.filter((s) => {
      const matchesQ =
        q === "" ||
        String(s.id).includes(q) ||
        (s.name || "").toLowerCase().includes(q) ||
        (s.phone || "").toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q) ||
        (s.address || "").toLowerCase().includes(q);

      const matchesActive =
        filterActive === "All" ||
        (filterActive === "Active" ? s.active : !s.active);

      return matchesQ && matchesActive;
    });
  }, [suppliers, query, filterActive]);

  /* ===== Edit ===== */
  const openEdit = (row) => {
    setEditErr("");
    setEditing({
      id: row.id,
      name: row.name || "",
      email: row.email || "",
      phone: row.phone || "",
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
      const payload = mapSupplierToPayload(editing); // sends contact_email, phone, is_active
      await updateSupplier(editing.id, payload);
      await fetchSuppliers();
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

  /* ===== Delete ===== */
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
      await deleteSupplier(deletingId);
      await fetchSuppliers();
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
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Suppliers</h2>
      </div>

      {/* Search + filter */}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, phone, email, or address…"
            className="w-full rounded-md border border-gray-200 bg-gray-100 pl-9 pr-3 py-2 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
          <svg className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none">
            <path d="M21 21l-4.3-4.3M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <div>
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
        <div className="mt-2 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 animate-pulse">
          Loading suppliers…
        </div>
      )}
      {err && (
        <div className="mt-2 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {err}
        </div>
      )}

      {/* MOBILE (cards) */}
      <div className="mt-3 grid gap-3 md:hidden">
        {filtered.map((s) => (
          <div key={s.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-gray-900">{s.name}</div>
                <div className="text-sm text-gray-700">{s.phone || "—"}</div>
                <div className="text-xs text-gray-500">{s.email || "—"}</div>
                <div className="text-xs text-gray-500">{s.address || "—"}</div>
                <div className="mt-2"><ActiveBadge active={s.active} /></div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => openEdit(s)}
                  className="rounded border px-3 py-1 text-xs font-medium text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(s.id)}
                  className="rounded border px-3 py-1 text-xs font-medium text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && !loading && (
          <div className="rounded-lg border bg-white p-6 text-center text-gray-500">No suppliers found.</div>
        )}
      </div>

      {/* DESKTOP (table) */}
      <div className="mt-3 overflow-x-auto rounded-lg border bg-white hidden md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              {/* <th className="px-4 py-3 font-medium">Email</th> */}
              <th className="px-4 py-3 font-medium">Address</th>
              <th className="px-4 py-3 font-medium">Active</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                <td className="px-4 py-3 text-gray-700">{s.phone || "—"}</td>
                {/* <td className="px-4 py-3 text-gray-700">{s.email || "—"}</td> */}
                <td className="px-4 py-3 text-gray-700">{s.address || "—"}</td>
                <td className="px-4 py-3"><ActiveBadge active={s.active} /></td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => openEdit(s)}
                      className="rounded border px-3 py-1 text-xs font-medium text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(s.id)}
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
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">No suppliers found.</td>
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
              <h3 className="text-base font-semibold text-gray-900">Edit Supplier</h3>
            </div>
            <div className="px-5 py-4 space-y-3">
              {editErr && (
                <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {editErr}
                </div>
              )}

              <Field label="Name"   value={editing.name}   onChange={(v) => setEditing((s)=>({...s, name:v}))} />
              <Field label="Email"  value={editing.email}  onChange={(v) => setEditing((s)=>({...s, email:v}))} />
              <Field label="Phone"  value={editing.phone}  onChange={(v) => setEditing((s)=>({...s, phone:v}))} />
              <Field label="Address" value={editing.address} onChange={(v) => setEditing((s)=>({...s, address:v}))} />

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
              <h3 className="text-base font-semibold text-gray-900">Delete Supplier</h3>
            </div>
            <div className="px-5 py-4 space-y-2">
              {deleteErr && (
                <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {deleteErr}
                </div>
              )}
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this supplier? This action cannot be undone.
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

/* Small field for modal */
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
