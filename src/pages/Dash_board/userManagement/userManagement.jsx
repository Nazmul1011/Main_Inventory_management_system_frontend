
// src/pages/Dash_board/User/UserManagement.jsx
import { useEffect, useMemo, useState } from "react";
import {
  listUsers,
  createUser,
  deleteUser,
  getUserDetails,
  mapUserFromApi,
  mapUserToCreatePayload,
} from "../../../services/users";
import { FiMail, FiPhone, FiShield, FiTrash2, FiPlus, FiUser } from "react-icons/fi";

/* ---- Small UI helpers ---- */
function RoleBadge({ role }) {
  const r = String(role || "").toLowerCase();
  const map = {
    admin: "bg-gray-100 text-gray-800",
    manager: "bg-blue-50 text-blue-700",
    operator: "bg-emerald-50 text-emerald-700",
  };
  const label = r ? r[0].toUpperCase() + r.slice(1) : "Member";
  return (
    <span className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${map[r] || "bg-gray-50 text-gray-700"}`}>
      {label}
    </span>
  );
}
function StateDot({ ok }) {
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${ok ? "bg-emerald-500" : "bg-gray-300"}`} />;
}

/* ---- Page ---- */
export default function UserManagement() {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Add modal
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "operator",
    password: "",
  });
  const [formErr, setFormErr] = useState({});

  // Optional avatar
  const [picFile, setPicFile] = useState(null);
  const [picPreview, setPicPreview] = useState("");

  // Details drawer
  const [detailId, setDetailId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailErr, setDetailErr] = useState("");

  // Delete confirm
  const [deletingId, setDeletingId] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteErr, setDeleteErr] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setErr("");
    try {
      const { data } = await listUsers();
      const arr = Array.isArray(data) ? data : data?.results || [];
      setRows(arr.map(mapUserFromApi));
    } catch (e) {
      setErr("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((u) =>
      [u.name, u.email, u.phone, u.role, u.organization_name]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [rows, query]);

  /* -------- Add user -------- */
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onPickPic = (e) => {
    const file = e.target.files?.[0] || null;
    setPicFile(file);
    setPicPreview((prevUrl) => {
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return file ? URL.createObjectURL(file) : "";
    });
  };

  const clearPic = () => {
    if (picPreview) URL.revokeObjectURL(picPreview);
    setPicFile(null);
    setPicPreview("");
  };

  useEffect(() => {
    return () => {
      if (picPreview) URL.revokeObjectURL(picPreview);
    };
  }, [picPreview]);

  const submitAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormErr({});
    try {
      const base = mapUserToCreatePayload(form);

      if (picFile) {
        const fd = new FormData();
        Object.entries(base).forEach(([k, v]) => fd.append(k, v));
        fd.append("profile_picture", picFile); // backend field name
        await createUser(fd);
      } else {
        await createUser(base);
      }

      setShowAdd(false);
      setForm({ first_name: "", last_name: "", email: "", phone: "", role: "operator", password: "" });
      clearPic();
      await fetchUsers();
    } catch (e2) {
      const data = e2?.response?.data;
      if (data && typeof data === "object") {
        const fe = {};
        Object.entries(data).forEach(([k, v]) => {
          if (Array.isArray(v) && v[0]) fe[k] = v[0];
          // non-field error handling (optional)
          if (typeof v === "string" && k === "detail") fe._ = v;
        });
        setFormErr(fe);
      }
    } finally {
      setSaving(false);
    }
  };

  /* -------- Details -------- */
  const openDetails = async (id) => {
    setDetailErr("");
    setDetail(null);
    setDetailId(id);
    try {
      const { data } = await getUserDetails(id);
      setDetail(mapUserFromApi(data));
    } catch {
      setDetailErr("Failed to load details.");
    }
  };
  const closeDetails = () => {
    setDetailId(null);
    setDetail(null);
  };

  /* -------- Delete -------- */
  const confirmDelete = (id) => {
    setDeleteErr("");
    setDeletingId(id);
  };
  const doDelete = async () => {
    if (!deletingId) return;
    setDeleteBusy(true);
    try {
      await deleteUser(deletingId);
      await fetchUsers();
      setDeletingId(null);
    } catch (e) {
      setDeleteErr(e?.response?.data?.detail || "Delete failed.");
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">User Management</h2>
        <div className="flex gap-2">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, phone, role…"
              className="w-full sm:w-80 rounded-md border border-gray-200 bg-gray-100 pl-9 pr-3 py-2 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            <svg className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-4.3-4.3M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <FiPlus /> Add User
          </button>
        </div>
      </div>

      {err && <div className="mb-3 rounded bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</div>}

      {/* Table */}
      <div className="hidden md:block overflow-x-auto rounded border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Org</th>
              <th className="px-4 py-3 font-medium">State</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-500">Loading…</td></tr>
            ) : filtered.length ? (
              filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {u.profile_picture ? (
                        <img src={u.profile_picture} alt={u.name} className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                          <FiUser />
                        </div>
                      )}
                      <div className="font-medium text-gray-900">{u.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <div className="flex items-center gap-2"><FiMail className="text-gray-400" /> {u.email}</div>
                    <div className="flex items-center gap-2"><FiPhone className="text-gray-400" /> {u.phone}</div>
                  </td>
                  <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                  <td className="px-4 py-3 text-gray-700">{u.organization_name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 flex items-center gap-1"><StateDot ok={u.is_verified} /> Verified</span>
                      <span className="text-xs text-gray-600 flex items-center gap-1"><StateDot ok={u.is_active} /> Active</span>
                      <span className="text-xs text-gray-600 flex items-center gap-1"><StateDot ok={!u.is_block} /> Not Blocked</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => openDetails(u.id)}
                        className="rounded border px-3 py-1 text-xs font-medium text-gray-700 border-gray-200 hover:bg-gray-50"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => confirmDelete(u.id)}
                        className="inline-flex items-center gap-1 rounded border px-3 py-1 text-xs font-medium text-rose-600 border-rose-200 hover:bg-rose-50"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-500">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden grid gap-3">
        {filtered.map((u) => (
          <div key={u.id} className="rounded border bg-white p-4">
            <div className="flex items-center gap-3">
              {u.profile_picture ? (
                <img src={u.profile_picture} alt={u.name} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                  <FiUser />
                </div>
              )}
              <div className="font-semibold text-gray-900">{u.name}</div>
            </div>
            <div className="mt-2 text-sm text-gray-700">{u.email}</div>
            <div className="text-sm text-gray-700">{u.phone}</div>
            <div className="mt-2"><RoleBadge role={u.role} /></div>
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => openDetails(u.id)} className="rounded border px-3 py-1 text-xs text-gray-700">Details</button>
              <button onClick={() => confirmDelete(u.id)} className="rounded border px-3 py-1 text-xs text-rose-600 border-rose-200">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Add User</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <form onSubmit={submitAdd} className="mt-4 grid gap-4 sm:grid-cols-2">
              {/* Avatar (optional) */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Profile picture (optional)</label>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                    {picPreview ? (
                      <img src={picPreview} alt="preview" className="h-full w-full object-cover" />
                    ) : (
                      <FiUser className="text-gray-400" />
                    )}
                  </div>
                  <label className="cursor-pointer rounded border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm hover:bg-gray-100">
                    Choose image…
                    <input type="file" accept="image/*" onChange={onPickPic} className="hidden" />
                  </label>
                  {picFile && (
                    <button type="button" onClick={clearPic} className="text-xs text-gray-600 hover:underline">
                      Remove
                    </button>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">PNG/JPG, a few MB is fine.</p>
              </div>

              <Field label="First name" name="first_name" value={form.first_name} onChange={onChange} error={formErr.first_name} />
              <Field label="Last name" name="last_name" value={form.last_name} onChange={onChange} error={formErr.last_name} />
              <Field label="Email" name="email" type="email" value={form.email} onChange={onChange} error={formErr.email} className="sm:col-span-2" />
              <Field label="Phone" name="phone" value={form.phone} onChange={onChange} error={formErr.phone} />
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={onChange}
                  className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                >
                  <option value="operator">Operator</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
                {formErr.role && <p className="mt-1 text-xs text-rose-600">{formErr.role}</p>}
              </div>
              <Field label="Password" name="password" type="password" value={form.password} onChange={onChange} error={formErr.password} />
              {Object.keys(formErr).length > 0 && (
                <div className="sm:col-span-2 rounded bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  Please fix the highlighted fields.
                </div>
              )}
              <div className="sm:col-span-2 mt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAdd(false)} className="rounded border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
                  {saving ? "Saving…" : "Save User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Drawer */}
      {detailId && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/30">
          <div className="h-full w-full max-w-md bg-white shadow-xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
              <button onClick={closeDetails} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            {detailErr && <div className="mt-3 rounded bg-rose-50 px-3 py-2 text-sm text-rose-700">{detailErr}</div>}
            {!detail && !detailErr && <div className="mt-4 text-sm text-gray-600">Loading…</div>}
            {detail && (
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  {detail.profile_picture ? (
                    <img src={detail.profile_picture} alt={detail.name} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                      <FiUser />
                    </div>
                  )}
                  <div className="text-gray-900 text-base font-semibold">{detail.name}</div>
                </div>
                <div className="flex items-center gap-2 text-gray-700"><FiMail className="text-gray-400" /> {detail.email}</div>
                <div className="flex items-center gap-2 text-gray-700"><FiPhone className="text-gray-400" /> {detail.phone}</div>
                <div className="flex items-center gap-2 text-gray-700"><FiShield className="text-gray-400" /> <RoleBadge role={detail.role} /></div>
                <div className="text-gray-700">Organization: <span className="font-medium">{detail.organization_name}</span></div>
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs text-gray-600 flex items-center gap-1"><StateDot ok={detail.is_verified} /> Verified</span>
                  <span className="text-xs text-gray-600 flex items-center gap-1"><StateDot ok={detail.is_active} /> Active</span>
                  <span className="text-xs text-gray-600 flex items-center gap-1"><StateDot ok={!detail.is_block} /> Not Blocked</span>
                  <span className="text-xs text-gray-600 flex items-center gap-1"><StateDot ok={!detail.is_terminated} /> Not Terminated</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
            <div className="border-b px-5 py-3">
              <h3 className="text-base font-semibold text-gray-900">Delete User</h3>
            </div>
            <div className="px-5 py-4 space-y-2">
              {deleteErr && <div className="rounded bg-rose-50 px-3 py-2 text-sm text-rose-700">{deleteErr}</div>}
              <p className="text-sm text-gray-700">Are you sure? This performs a soft delete.</p>
            </div>
            <div className="flex items-center justify-end gap-2 border-t px-5 py-3">
              <button onClick={() => setDeletingId(null)} className="rounded border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" disabled={deleteBusy}>Cancel</button>
              <button onClick={doDelete} className="rounded bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60" disabled={deleteBusy}>
                {deleteBusy ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Reusable field */
function Field({ label, name, value, onChange, type = "text", className = "", error }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${error ? "border-rose-400" : "border-gray-300"}`}
      />
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

