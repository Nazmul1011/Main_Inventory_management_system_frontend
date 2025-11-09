


// second verison 

// src/services/users.js
import client from "./client";
import { buildMediaUrl } from "./profile";

// GET: list all users
export const listUsers = () => client.get("/user-list/");

// GET: single user details
export const getUserDetails = (id) => client.get(`/user/${id}/details/`);

// DELETE: soft delete
export const deleteUser = (id) => client.delete(`/user/${id}/delete/`);

// POST: create user
// Accepts either a plain object (JSON) or FormData (multipart with image)
export const createUser = (payload) => {
  if (payload instanceof FormData) {
    // Let Axios set the multipart boundary automatically
    return client.post("/user/create/", payload);
  }
  return client.post("/user/create/", payload);
};

// API -> UI row
export const mapUserFromApi = (u) => ({
  id: u.id,
  name:
    `${u.first_name || ""} ${u.last_name || ""}`.trim() ||
    (u.email ? u.email.split("@")[0] : ""),
  email: u.email || "",
  phone: u.phone || "",
  role: u.role || "",
  organization_name: u.organization?.name || "",
  profile_picture: buildMediaUrl(u.profile_picture),
  is_verified: !!u.is_verified,
  is_active: !!u.is_active,
  is_block: !!u.is_block,
  is_terminated: !!u.is_terminated,
  created_at: u.created_at,
});

// UI form -> API payload (JSON mode)
export const mapUserToCreatePayload = (f) => ({
  first_name: (f.first_name || "").trim(),
  last_name: (f.last_name || "").trim(),
  email: (f.email || "").trim(),
  phone: (f.phone || "").trim(),
  role: String(f.role || "").toLowerCase(), // normalize to backend enum
  password: f.password,
});

