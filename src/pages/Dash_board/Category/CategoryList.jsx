// src/pages/Dash_board/Category/CategoryList.jsx
import { useEffect, useMemo, useState } from "react";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  mapCategoryFromApi,
  mapFormToCategoryPayload,
} from "../../../services/categories";
import { Link } from "react-router-dom";

function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export default function CategoryList() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");

  // modal state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // category row or null
  const [form, setForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const { data } = await listCategories();
      const items = (Array.isArray(data) ? data : data?.results || []).map(
        mapCategoryFromApi
      );
      setCategories(items);
    } catch (e) {
      setErr(
        e?.response?.data?.detail ||
          e?.response?.data?.message ||
          "Failed to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q) ||
        (c.id || "").toLowerCase().includes(q)
    );
  }, [categories, query]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "" });
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({ name: row.name, description: row.description || "" });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSaving(false);
    setErr("");
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const payload = mapFormToCategoryPayload(form);
      if (editing) {
        await updateCategory(editing.id, payload);
      } else {
        await createCategory(payload);
      }
      closeModal();
      await load();
    } catch (e2) {
      setErr(
        e2?.response?.data?.detail ||
          e2?.response?.data?.message ||
          "Could not save category."
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id) => setConfirmDeleteId(id);
  const cancelDelete = () => setConfirmDeleteId(null);

  const doDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleting(true);
    setErr("");
    try {
      await deleteCategory(confirmDeleteId);
      setConfirmDeleteId(null);
      await load();
    } catch (e3) {
      setErr(
        e3?.response?.data?.detail ||
          e3?.response?.data?.message ||
          "Delete failed."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Categories</h2>
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/product"
            className="hidden sm:inline rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Go to Products
          </Link>
          <button
            onClick={openCreate}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, description, or ID…"
            className="w-full rounded-md border border-gray-200 bg-gray-100 pl-9 pr-3 py-2 text-sm outline-none placeholder:text-gray-500 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />
          <svg
            className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21 21l-4.3-4.3M10 18a8 8 0 100-16 8 8 0 000 16z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* feedback */}
      {loading && (
        <div className="mt-4 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 animate-pulse">
          Loading categories…
        </div>
      )}
      {err && (
        <div className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {err}
        </div>
      )}

      {/* table */}
      <div className="mt-4 overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {/* <th className="px-4 py-3 font-medium">ID</th> */}
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                {/* <td className="px-4 py-3 text-gray-700">{c.id}</td> */}
                <td className="px-4 py-3 text-gray-900 font-medium">
                  {c.name}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {c.description || "—"}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {c.createdAt
                    ? new Date(c.createdAt).toLocaleString()
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(c)}
                      className="rounded border px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(c.id)}
                      className="rounded border border-rose-200 bg-rose-50 px-2 py-1 text-xs text-rose-700 hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && !loading && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={5}>
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={open}
        title={editing ? "Edit Category" : "Add Category"}
        onClose={closeModal}
      >
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800">
              Name
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              placeholder="e.g., Beverages"
              required
              className="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((s) => ({ ...s, description: e.target.value }))
              }
              rows={3}
              placeholder="All kinds of soft drinks, juices, and water."
              className="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!confirmDeleteId}
        title="Delete Category"
        onClose={cancelDelete}
      >
        <p className="text-sm text-gray-700">
          Are you sure you want to delete this category? This action cannot be
          undone.
        </p>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={cancelDelete}
            className="rounded border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={doDelete}
            disabled={deleting}
            className="rounded bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
}



