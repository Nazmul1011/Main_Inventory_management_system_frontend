// src/services/client.js
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// ---- token store (localStorage) ----
const TOKENS_KEY = "auth_tokens"; // { access, refresh }
export const getTokens = () => {
  try { return JSON.parse(localStorage.getItem(TOKENS_KEY)) || null; } catch { return null; }
};
export const setTokens = (t) => localStorage.setItem(TOKENS_KEY, JSON.stringify(t));
export const clearTokens = () => localStorage.removeItem(TOKENS_KEY);
export const isLoggedIn = () => !!getTokens()?.access;

// ---- axios instance for app requests ----
const client = axios.create({
  baseURL,
  withCredentials: false,
  timeout: 20000,
});

// attach Authorization if we have access token
client.interceptors.request.use((config) => {
  const tokens = getTokens();
  if (tokens?.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`;
  }
  return config;
});

// dedicated axios for refresh (no interceptors/headers)
const refreshClient = axios.create({ baseURL, timeout: 10000 });

// ---- single-flight refresh logic ----
let isRefreshing = false;
let pending = [];

const processQueue = (error, token = null) => {
  pending.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  pending = [];
};

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // Not a 401 or already retried -> bubble up
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    const tokens = getTokens();
    if (!tokens?.refresh) {
      clearTokens();
      return Promise.reject(error);
    }

    // queue behind an ongoing refresh
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pending.push({
          resolve: (newAccess) => {
            original.headers.Authorization = `Bearer ${newAccess}`;
            resolve(client(original));
          },
          reject,
        });
      });
    }

    // do refresh
    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await refreshClient.post("/refresh-token/", { refresh: tokens.refresh });
      // normalize possible shapes
      const newAccess = data?.access || data?.access_token;
      if (!newAccess) throw new Error("No access token from refresh");

      const newTokens = { ...tokens, access: newAccess };
      setTokens(newTokens);

      processQueue(null, newAccess);
      original.headers.Authorization = `Bearer ${newAccess}`;
      return client(original);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      clearTokens();
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default client;



