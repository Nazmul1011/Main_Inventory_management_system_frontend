// // src/services/profile.js
// import client from "./client";

// /**
//  * Turn a media path from the API into an absolute URL.
//  * Works for both absolute and relative values.
//  * Example input: "/media/avatars/a.jpg" -> "http://localhost:8000/media/avatars/a.jpg"
//  */
// export const buildMediaUrl = (path) => {
//   const base = (client.defaults?.baseURL || "").replace(/\/+$/, "");
//   if (!path) return "";
//   if (/^https?:\/\//i.test(path)) return path;        // already absolute
//   const p = String(path).replace(/^\/+/, "");
//   return base ? `${base}/${p}` : `/${p}`;
// };

// // GET /api/user-profile/
// export const getProfile = () => client.get("/user-profile/");

// // PATCH /api/update-profile/  (multipart: profile fields + profile_picture)
// export const updateMyProfile = (formData) =>
//   client.patch("/update-profile/", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

// // POST /api/change-password/  (old_password, new_password)
// export const changePassword = (payload) =>
//   client.post("/change-password/", payload);


// src/services/profile.js
import client from "./client";

/**
 * Make an absolute media URL from an API path.
 * Examples:
 *   "/media/a.jpg" -> "http://localhost:8000/media/a.jpg"
 *   "http://cdn/site/a.jpg" -> passthrough
 */
export const buildMediaUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path; // already absolute

  const clean = String(path).replace(/^\/+/, "");

  // Derive origin (protocol + host + port) from client baseURL or window
  let origin = "";
  try {
    const u = new URL(client?.defaults?.baseURL || "", window.location.origin);
    origin = `${u.protocol}//${u.host}`; // strips any "/api" or trailing path
  } catch {
    origin = window.location.origin;
  }
  return `${origin}/${clean}`;
};

// GET /api/user-profile/
export const getProfile = () => client.get("/user-profile/");

// PATCH /api/update-profile/
export const updateMyProfile = (formData) =>
  client.patch("/update-profile/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// POST /api/change-password/
export const changePassword = (payload) =>
  client.post("/change-password/", payload);
