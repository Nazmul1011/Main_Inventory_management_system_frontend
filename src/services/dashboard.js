
// uses your existing axios client (same one used by customer.js)
import client from "./client";

// GET {{local}}/api/v1/dashboard/inventory/
export const getInventoryDashboard = () =>
  client.get("/v1/dashboard/inventory/");
