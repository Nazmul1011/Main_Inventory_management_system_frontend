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
