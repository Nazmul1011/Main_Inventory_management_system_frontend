// src/services/supplier.js
import client from "./client";

/* =========================
   SUPPLIERS (DRF endpoints)
   Base: /api
   ========================= */

// List suppliers
export const listSuppliers = (params = {}) =>
  client.get("/suppliers/", { params }); // GET {{local}}/api/suppliers/

// Retrieve single
export const getSupplier = (id) =>
  client.get(`/suppliers/${id}/`);        // GET {{local}}/api/suppliers/:id/

// Create supplier
export const createSupplier = (payload) =>
  client.post("/suppliers/", payload);    // POST {{local}}/api/suppliers/

// Update (PUT)
export const updateSupplier = (id, payload) =>
  client.put(`/suppliers/${id}/`, payload); // PUT {{local}}/api/suppliers/:id/

// Patch
export const patchSupplier = (id, payload) =>
  client.patch(`/suppliers/${id}/`, payload); // PATCH {{local}}/api/suppliers/:id/

// Delete
export const deleteSupplier = (id) =>
  client.delete(`/suppliers/${id}/`);     // DELETE {{local}}/api/suppliers/:id/


/* =========================
   Mappers
   ========================= */

// API -> UI row
export const mapSupplierFromApi = (s) => ({
  id: s.id,
  name: s.name || "",
  // backend returns `email` (null) but create uses `contact_email`. Prefer either.
  email: s.email || s.contact_email || "",
  phone: s.phone || "",
  address: s.address || "",
  active: Boolean(s.is_active),
  createdAt: s.created_at,
  updatedAt: s.updated_at,
});

// UI form -> API payload (for create/update)
export const mapSupplierToPayload = (f) => ({
  name: (f.name || "").trim(),
  contact_email: (f.email || "").trim(), // <-- API expects contact_email in POST/PUT
  phone: (f.phone || f.mobile || "").trim(),
  address: (f.address || "").trim(),
  is_active: Boolean(f.active),
});
