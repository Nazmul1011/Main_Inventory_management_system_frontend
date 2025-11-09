// // src/services/customer.js
// import client from "./client";

// /* =========================
//    CUSTOMERS (DRF endpoints)
//    Base: /api
//    ========================= */

// // List all customers
// export const listCustomers = (params = {}) =>
//   client.get("/customers/", { params });          // GET {{local}}/api/customers/

// // Retrieve one
// export const getCustomer = (id) =>
//   client.get(`/customers/${id}/`);                // GET {{local}}/api/customers/:id/

// // Create
// export const createCustomer = (payload) =>
//   client.post("/customers/", payload);            // POST {{local}}/api/customers/

// // Update (replace)
// export const updateCustomer = (id, payload) =>
//   client.put(`/customers/${id}/`, payload);       // PUT {{local}}/api/customers/:id/

// // Patch (partial)
// export const patchCustomer = (id, payload) =>
//   client.patch(`/customers/${id}/`, payload);     // PATCH {{local}}/api/customers/:id/

// // Delete
// export const deleteCustomer = (id) =>
//   client.delete(`/customers/${id}/`);             // DELETE {{local}}/api/customers/:id/

// /* =========================
//    Mappers
//    ========================= */

// // API -> UI row
// export const mapCustomerFromApi = (c) => ({
//   id: c.id,
//   name: c.name || "",
//   email: c.email || "",
//   mobile: c.mobile || c.phone || "",              // backend returns "mobile"; create uses "phone"
//   address: c.address || "",
//   due: Number(c.due_amount ?? 0),
//   paymentTotal: Number(c.payment_total ?? 0),
//   active: Boolean(c.is_active),
//   createdAt: c.created_at,
//   updatedAt: c.updated_at,
//   organization: c.organization,
// });

// // UI form -> API payload (for create/update)
// // NOTE: backend expects `phone` on POST even though it returns `mobile`
// export const mapCustomerToPayload = (f) => ({
//   name: (f.name || "").trim(),
//   email: (f.email || "").trim() || null,
//   mobile: (f.mobile || "").trim() || null,        // important: phone, not mobile
//   address: (f.address || "").trim() || null,
//   ...(typeof f.active !== "undefined" ? { is_active: !!f.active } : {}),
// });



// src/services/customer.js
import client from "./client";

/* ===== CRUD ===== */
export const listCustomers = (params = {}) =>
  client.get("/customers/", { params });

export const getCustomer = (id) =>
  client.get(`/customers/${id}/`);

export const createCustomer = (payload) =>
  client.post("/customers/", payload);

export const updateCustomer = (id, payload) =>
  client.put(`/customers/${id}/`, payload);

export const patchCustomer = (id, payload) =>
  client.patch(`/customers/${id}/`, payload);

export const deleteCustomer = (id) =>
  client.delete(`/customers/${id}/`);

/* ===== Mappers ===== */

// API -> UI
export const mapCustomerFromApi = (c) => ({
  id: c.id,
  name: c.name || "",
  email: c.email || "",
  // be tolerant to any backend field name
  mobile: c.mobile ?? c.phone ?? c.contact_phone ?? c.contact ?? "",
  address: c.address || "",
  due: Number(c.due_amount ?? 0),
  paymentTotal: Number(c.payment_total ?? 0),
  active: Boolean(c.is_active),
  createdAt: c.created_at,
  updatedAt: c.updated_at,
  organization: c.organization,
});

// UI -> API
export const mapCustomerToPayload = (f) => ({
  name: (f.name || "").trim(),
  email: (f.email || "").trim() || null,
  mobile: (f.mobile || "").trim() || null,    // <-- must be `mobile`
  address: (f.address || "").trim() || null,
  ...(typeof f.active !== "undefined" ? { is_active: !!f.active } : {}),
});
