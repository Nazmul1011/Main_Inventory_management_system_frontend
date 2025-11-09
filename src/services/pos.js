// // src/services/pos.js
// import client from "./client";

// /** List sales (if you need it later) */
// export const listSales = (params) => client.get("/sales/", { params });

// /** Get a single sale (used by InvoicePage when no state is passed) */
// export const getSale = (id) => client.get(`/sales/${id}/`);

// /** Create a sale (POS payment) */
// export const createSale = (payload) => client.post("/sales/", payload);

// /** Map backend product record to POS item shape */
// export const mapProductToPOS = (api) => ({
//   id: api.id,                                     // product UUID
//   name: api.name,
//   price: Number(api.sell_price ?? api.selling_price ?? 0),
// });

// /** Build backend payload for creating a sale */
// export const buildSalePayload = ({
//   invoiceNumber,
//   discount,
//   vat,
//   paidAmount,
//   paymentStatus,
//   notes,
//   cart,
//   customerName,
//   customerPhone,
// }) => {
//   return {
//     invoice_number: invoiceNumber,
//     // customer UUID NOT required. We'll embed name/phone in notes for reference.
//     discount: Number(discount || 0),
//     vat: Number(vat || 0),
//     paid_amount: Number(paidAmount || 0),
//     payment_status: paymentStatus, // "paid" | "partial" | "due"
//     notes: `Customer: ${customerName} | Mobile: ${customerPhone}${notes ? " | " + notes : ""}`,
//     items: cart.map((i) => ({
//       product: i.id,                              // UUID
//       quantity: Number(i.qty || 1),
//       unit_price: Number(i.price || 0),
//     })),
//   };
// };


/// second version 




// // src/services/pos.js
// import client from "./client";

// /** List sales (if you need it later) */
// export const listSales = (params) => client.get("/sales/", { params });

// /** Get a single sale (used by InvoicePage when no state is passed) */
// export const getSale = (id) => client.get(`/sales/${id}/`);

// /** Create a sale (POS payment) */
// export const createSale = (payload) => client.post("/sales/", payload);

// /** Map backend product record to POS item shape */
// export const mapProductToPOS = (api) => ({
//   id: api.id,                                     // product UUID
//   name: api.name,
//   price: Number(api.sell_price ?? api.selling_price ?? 0),
// });

// /** Build backend payload for creating a sale */
// export const buildSalePayload = ({
//   invoiceNumber,
//   discount,
//   vat,
//   paidAmount,
//   paymentStatus,
//   notes,
//   cart,
//   customerName,
//   customerPhone,
// }) => {
//   return {
//     invoice_number: invoiceNumber,
//     // customer UUID NOT required. We'll embed name/phone in notes for reference.
//     discount: Number(discount || 0),
//     vat: Number(vat || 0),
//     paid_amount: Number(paidAmount || 0),
//     payment_status: paymentStatus, // "paid" | "partial" | "due"
//     notes: `Customer: ${customerName} | Mobile: ${customerPhone}${notes ? " | " + notes : ""}`,
//     items: cart.map((i) => ({
//       product: i.id,                              // UUID
//       quantity: Number(i.qty || 1),
//       unit_price: Number(i.price || 0),
//     })),
//   };
// };

// /* =========================
//    NEW: tiny helpers for Invoice
//    ========================= */

// /** Pull {customer_name, customer_phone, extra_note} from the combined notes string */
// export const parseCustomerFromNotes = (notes = "") => {
//   // format we saved: "Customer: NAME | Mobile: PHONE | optional extra..."
//   const out = { customer_name: "", customer_phone: "", extra_note: "" };
//   if (!notes) return out;
//   const parts = notes.split("|").map((s) => s.trim());
//   for (const p of parts) {
//     if (p.toLowerCase().startsWith("customer:")) {
//       out.customer_name = p.split(":").slice(1).join(":").trim();
//     } else if (p.toLowerCase().startsWith("mobile:")) {
//       out.customer_phone = p.split(":").slice(1).join(":").trim();
//     } else if (p) {
//       out.extra_note = out.extra_note ? `${out.extra_note} | ${p}` : p;
//     }
//   }
//   return out;
// };

// /** Delete a sale (invoice) */
// export const deleteSale = (id) => client.delete(`/sales/${id}/`);

// /** (Optional) Full and partial update helpers */
// export const updateSale = (id, payload) => client.put(`/sales/${id}/`, payload);
// export const patchSale  = (id, payload) => client.patch(`/sales/${id}/`, payload);

// /**
//  * Add product_name to each sale item using a lookup dict.
//  * Usage:
//  *   const dict = await resolveProductNames(sale.items.map(i => i.product));
//  *   const saleUI = mapSaleItemsWithNames(sale, dict);
//  */
// export const mapSaleItemsWithNames = (sale, idToName = {}) => {
//   const clone = { ...sale };
//   clone.items = (sale.items || []).map((it) => ({
//     ...it,
//     product_name: idToName[it.product] || it.product, // fallback to ID if not resolved
//   }));
//   return clone;
// };


// src/services/pos.js
import client from "./client";

/** List sales */
export const listSales = (params) => client.get("/sales/", { params });

/** Get a single sale */
export const getSale = (id) => client.get(`/sales/${id}/`);

/** Create a sale */
export const createSale = (payload) => client.post("/sales/", payload);

/** Delete a sale */
export const deleteSale = (id) => client.delete(`/sales/${id}/`);

/** PATCH update (partial). Use this for EditInvoice */
export const patchSale  = (id, payload) => client.patch(`/sales/${id}/`, payload);

/** (keep) PUT full update if you ever need it */
export const updateSale = (id, payload) => client.put(`/sales/${id}/`, payload);

export const mapProductToPOS = (api) => ({
  id: api.id,
  name: api.name,
  price: Number(api.sell_price ?? api.selling_price ?? 0),
});

export const buildSalePayload = ({
  invoiceNumber, discount, vat, paidAmount, paymentStatus, notes, cart, customerName, customerPhone,
}) => ({
  invoice_number: invoiceNumber,
  discount: Number(discount || 0),
  vat: Number(vat || 0),
  paid_amount: Number(paidAmount || 0),
  payment_status: paymentStatus,
  notes: `Customer: ${customerName} | Mobile: ${customerPhone}${notes ? " | " + notes : ""}`,
  items: cart.map((i) => ({
    product: i.id,
    quantity: Number(i.qty || 1),
    unit_price: Number(i.price || 0),
  })),
});

/** Utility: sort newest first client-side */
export const sortByCreatedDesc = (arr) =>
  [...arr].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
