

// src/services/product.js
import client from "./client";

/* =========================
   PRODUCTS (DRF endpoints)
   Base: /api
   ========================= */

// List all products
export const listProducts = (params = {}) =>
  client.get("/products/", { params }); // GET {{local}}/api/products/

// Retrieve one
export const getProduct = (id) =>
  client.get(`/products/${id}/`);        // GET {{local}}/api/products/:id/

// Create
export const createProduct = (payload) =>
  client.post("/products/", payload);    // POST {{local}}/api/products/

// Update
export const updateProduct = (id, payload) =>
  client.put(`/products/${id}/`, payload); // PUT {{local}}/api/products/:id/

// Patch
export const patchProduct = (id, payload) =>
  client.patch(`/products/${id}/`, payload); // PATCH {{local}}/api/products/:id/

// Delete
export const deleteProduct = (id) =>
  client.delete(`/products/${id}/`);     // DELETE {{local}}/api/products/:id/

/* =========================
   CATEGORIES (for dropdown)
   ========================= */
export const listCategories = () =>
  client.get("/categories/");            // GET {{local}}/api/categories/

/* =========================
   Mappers
   ========================= */

// API -> UI row
export const mapProductFromApi = (p) => ({
  id: p.id,                              // UUID
  productId: p.product_id || "",         // "P001"
  name: p.name || "",
  sku: p.sku || "",
  unit: p.unit || "",                    // "piece" | "kg" | ...
  purchasePrice: Number(p.purchase_price ?? 0),
  sellPrice: Number(p.sell_price ?? 0),
  reorder: Number(p.reorder_level ?? 0),
  stock: Number(p.current_stock ?? 0),
  barcode: p.barcode || "",
  status: p.status || "in_stock",        // snake_case from backend
  description: p.description || "",
  createdAt: p.created_at,
  updatedAt: p.updated_at,
  organization: p.organization,
  category: p.category || "",            // category UUID
  supplier: p.supplier || "",            // optional UUID
});

// UI form -> API payload
export const mapFormToProductPayload = (f) => ({
  product_id: (f.productId || "").trim(),
  name: (f.name || "").trim(),
  sku: (f.sku || "").trim(),
  unit: (f.unit || "").trim(), // "kg" | "litre" | "loaf" | "gram" | "piece" | "box" | "set"
  purchase_price: Number(f.purchasePrice ?? 0),
  sell_price: Number(f.sellPrice ?? 0),
  reorder_level: Number(f.reorder ?? 0),
  current_stock: Number(f.stock ?? 0),
  barcode: (f.barcode || "").trim(),
  status: (f.status || "in_stock"), // must be snake_case
  description: f.description || "",
  category: f.category || null,     // UUID
  supplier: f.supplier || null,     // optional UUID
});

// derive label from stock/reorder (for helper text only)
export const deriveStatus = (stock, reorder) => {
  const s = Number(stock), r = Number(reorder);
  if (!Number.isFinite(s) || !Number.isFinite(r)) return "in_stock";
  if (s <= 0) return "out_of_stock";
  if (s <= r) return "low_stock";
  return "in_stock";
};

/* =========================
   NEW: Name resolvers (for invoices)
   ========================= */

// Simple in-memory cache to avoid refetching the same product IDs
const _nameCache = new Map();

/** Get a single product name from UUID (uses cache). */
export async function resolveProductName(id) {
  if (!id) return id;
  if (_nameCache.has(id)) return _nameCache.get(id);
  try {
    const { data } = await getProduct(id);
    const name = data?.name || id;
    _nameCache.set(id, name);
    return name;
  } catch {
    return id; // fallback to ID if fetch fails
  }
}

/** Batch: take an array of product UUIDs and return { id: name, ... } */
export async function resolveProductNames(productIds = []) {
  const unique = [...new Set(productIds.filter(Boolean))];
  const results = await Promise.all(
    unique.map(async (pid) => [pid, await resolveProductName(pid)])
  );
  return Object.fromEntries(results);
}
