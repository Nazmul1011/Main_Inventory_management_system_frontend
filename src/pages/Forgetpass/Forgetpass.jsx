// src/pages/Forgetpass/Forgetpass.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  forgotPassword,
  verifyForgotOtp,
  setNewPassword,
} from "../../services/auth";

export default function ForgotPassword() {
  const nav = useNavigate();

  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // data across steps
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [tokenData, setTokenData] = useState(null); // expects { user_id, token_id }
  const [passwords, setPasswords] = useState({ password: "", confirm: "" });

  const resetFeedback = () => { setMsg(""); setErr(""); };

  // Step 1: Send OTP
  const submitEmail = async (e) => {
    e.preventDefault();
    resetFeedback();
    setLoading(true);
    try {
      await forgotPassword({ email: String(email).trim() }); // POST /forget-password/
      setMsg("OTP sent to your email.");
      setStep(2);
    } catch (e1) {
      const d = e1?.response?.data;
      setErr(d?.detail || d?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP (backend returns user_id + token_id)
  const submitOtp = async (e) => {
    e.preventDefault();
    resetFeedback();
    setLoading(true);
    try {
      const { data } = await verifyForgotOtp({
        email: String(email).trim(),
        otp: String(otp).trim(),
      }); // POST /password-forgot/otp-verify/
      setTokenData(data); // { user_id, token_id } per your docs
      setMsg("OTP verified. Set your new password.");
      setStep(3);
    } catch (e2) {
      const d = e2?.response?.data;
      setErr(d?.detail || d?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set new password
  const submitNewPass = async (e) => {
    e.preventDefault();
    resetFeedback();

    if (passwords.password !== passwords.confirm) {
      setErr("Passwords do not match.");
      return;
    }

    // Normalize/trim possible key names from backend
    const user_id = String(
      tokenData?.user_id ?? tokenData?.user ?? tokenData?.uid ?? tokenData?.id ?? ""
    ).trim();
    const token_id = String(
      tokenData?.token_id ?? tokenData?.token ?? tokenData?.reset_token ?? tokenData?.tid ?? ""
    ).trim();

    if (!user_id || !token_id) {
      setErr("Reset token is missing. Please restart the reset process.");
      setStep(1);
      return;
    }

    setLoading(true);
    try {
      // send both password & new_password (backend will accept one and ignore the other)
      await setNewPassword({
        user_id,
        token_id,          // if your API expects "token" instead, it will be mapped in the service or backend can alias
        password: passwords.password,
        new_password: passwords.password,
      }); // POST /password-forgot/new-password-set/

      setMsg("Password updated. Redirecting to Sign In…");
      setTimeout(() => nav("/loguser", { replace: true }), 900);
    } catch (e3) {
      const d = e3?.response?.data;
      // surface exact backend messages (incl. “Verification Token does not Exist!”)
      setErr(
        d?.password?.[0] ||
        d?.detail ||
        d?.message ||
        d?.error ||
        "Could not set new password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <h1 className="text-center text-2xl font-semibold text-gray-900">
          Forgot Your Password?
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          {step === 1 && "Enter your email to receive an OTP."}
          {step === 2 && <>We sent an OTP to <b>{email}</b>. Enter it below.</>}
          {step === 3 && "Set a new password for your account."}
        </p>

        {msg && (
          <div className="mx-auto mt-4 max-w-md rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            {msg}
          </div>
        )}
        {err && (
          <div className="mx-auto mt-4 max-w-md rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {err}
          </div>
        )}

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={submitEmail} className="mx-auto mt-8 max-w-md space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>

            <div className="text-center text-xs text-gray-600">
              Remembered your password?{" "}
              <Link to="/loguser" className="font-medium text-indigo-600 hover:underline">
                Sign In
              </Link>
            </div>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={submitOtp} className="mx-auto mt-8 max-w-md space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">OTP Code</label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                required
                className="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Change Email
              </button>
            </div>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={submitNewPass} className="mx-auto mt-8 max-w-md space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">New Password</label>
              <input
                type="password"
                value={passwords.password}
                onChange={(e) => setPasswords((s) => ({ ...s, password: e.target.value }))}
                placeholder="New password"
                required
                className="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">Confirm Password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords((s) => ({ ...s, confirm: e.target.value }))}
                placeholder="Confirm new password"
                required
                className="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

            <div className="text-center text-xs text-gray-600">
              Done already?{" "}
              <Link to="/loguser" className="font-medium text-indigo-600 hover:underline">
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

