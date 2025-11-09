// src/services/categories.js
import client from "./client";

/* ======== CRUD ======== */
export const listCategories = (params = {}) =>
  client.get("/categories/", { params });              // GET /api/categories/

export const getCategory = (id) =>
  client.get(`/categories/${id}/`);                    // GET /api/categories/:id/

export const createCategory = (payload) =>
  client.post("/categories/", payload);                // POST /api/categories/

export const updateCategory = (id, payload) =>
  client.put(`/categories/${id}/`, payload);           // PUT  /api/categories/:id/

export const patchCategory = (id, payload) =>
  client.patch(`/categories/${id}/`, payload);         // PATCH /api/categories/:id/

export const deleteCategory = (id) =>
  client.delete(`/categories/${id}/`);                 // DELETE /api/categories/:id/

/* ======== Mappers (optional) ======== */
export const mapCategoryFromApi = (c) => ({
  id: c.id,
  name: c.name ?? "",
  description: c.description ?? "",
  createdAt: c.created_at,
  organization: c.organization,
});

export const mapFormToCategoryPayload = (f) => ({
  name: (f.name || "").trim(),
  description: (f.description || "").trim(),
});
