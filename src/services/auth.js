// src/services/auth.js
import client, { setTokens, clearTokens, getTokens } from "./client";

// ---- Signup & OTP ----
export const signup = (payload) => client.post("/user-signup/", payload);
export const verifySignupOtp = (payload) => client.post("/verify-otp/", payload);
export const resendSignupOtp = (payload) => client.post("/resend-otp/", payload);

// ---- Login / Refresh / Logout ----
export const login = async ({ email, password }) => {
  const { data } = await client.post("/user-login/", { email, password });

  // DEBUG: see exact backend payload
  console.log("[login] response:", data);

  // Normalize token shapes:
  const access =
    data?.access ||
    data?.access_token ||
    data?.token ||
    data?.tokens?.access ||
    null;

  const refresh =
    data?.refresh ||
    data?.refresh_token ||
    data?.tokens?.refresh ||
    "";

  if (!access) throw new Error("No access token in response");

  setTokens({ access, refresh });
  console.log("[login] saved:", localStorage.getItem("auth_tokens"));

  return data;
};

export const logout = async () => {
  const tokens = getTokens();
  try {
    if (tokens?.refresh) await client.post("/user-logout/", { refresh: tokens.refresh });
  } catch (_) {}
  clearTokens();
};

export const refresh = async () => {
  const tokens = getTokens();
  if (!tokens?.refresh) throw new Error("No refresh token");
  const { data } = await client.post("/refresh-token/", { refresh: tokens.refresh });
  const newAccess = data?.access || data?.access_token;
  if (!newAccess) throw new Error("No access token from refresh");
  setTokens({ ...tokens, access: newAccess });
  return data;
};

// ---- Me / Profile ----
export const getProfile = () => client.get("/user-profile/");
export const updateProfile = (payload) => client.put("/update-profile/", payload);
export const changePassword = (payload) => client.post("/change-password/", payload);

// ---- Forgot / Reset Password ----
export const forgotPassword = (payload) => client.post("/forget-password/", payload);
export const verifyForgotOtp = (payload) => client.post("/password-forgot/otp-verify/", payload);
export const setNewPassword = (payload) => client.post("/password-forgot/new-password-set/", payload);
