// src/pages/login/Login.jsx
import { useState } from "react";
import { FaApple, FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiLock, FiMail } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/auth"; // <-- uses /api/user-login/

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);            // sets tokens in localStorage
      nav("/dashboard", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Invalid email or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-36 max-w-screen-2xl mx-auto grid md:grid-cols-2 align-center">
      {/* ========== Left: Login Form ========== */}
      <div className="flex flex-col justify-center px-10 md:px-20 bg-white">
        {/* Logo */}
        <div className="mb-10 flex items-center gap-2">
          <img src="/logo.png" alt="IMS Logo" className="h-8" />
          <h1 className="text-xl font-bold text-gray-800">InventoryMS</h1>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-6">
          Log in to manage your inventory, track stock, and access your dashboard.
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ====== Login Form ====== */}
        <form onSubmit={onSubmit} className="w-full max-w-md space-y-5">
          {/* Email */}
          <div className="relative">
            <FiMail className="pointer-events-none absolute left-3 top-3 text-lg text-gray-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="Email address"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock className="pointer-events-none absolute left-3 top-3 text-lg text-gray-400" />
            <input
              type={showPwd ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Password"
              className="w-full pl-10 pr-20 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-2.5 rounded px-2 py-1 text-xs text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? "Hide" : "Show"}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3 rounded-xl font-medium transition"
          >
            {loading ? "Signing in..." : "Continue"}
          </button>

          {/* Divider */}
          <div className="flex items-center my-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-3 text-sm text-gray-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social Buttons (placeholders) */}
          <div className="flex justify-center gap-4">
            <button type="button" className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 transition">
              <FcGoogle className="text-xl" />
            </button>
            <button type="button" className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 transition">
              <FaApple className="text-xl text-gray-900" />
            </button>
            <button type="button" className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 transition">
              <FaFacebookF className="text-xl text-blue-600" />
            </button>
          </div>

          {/* Forgot / Register Links */}
          <div className="flex items-center justify-between text-xs mt-2">
            <Link to="/forgetpass" className="text-gray-600 hover:text-indigo-600">
              Forgot Password?
            </Link>
            <div className="text-gray-600">
              Don’t have an account?{" "}
              <Link to="/logRegister" className="font-medium text-indigo-600 hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </form>

        {/* Footer */}
        
      </div>

      {/* ========== Right: Illustration ========== */}
      <div className=" hidden md:flex items-center justify-center  bg-white">
        <img
          src="public/login.png"
          alt="Login illustration"
          
        />
      </div>
    </div>
  );
}
