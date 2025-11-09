// src/pages/Register/Register_layout.jsx
import { useState } from "react";
import { FiBriefcase, FiLock, FiMail, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { resendSignupOtp, signup, verifySignupOtp } from "../../services/auth";

export default function Register() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);              // 1: form, 2: otp
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  // keep email for OTP step
  const [email, setEmail] = useState("");

  // form fields expected by backend
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    organization_name: "",
  });

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const submitSignup = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");
    if (form.password !== form.confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        organization_name: form.organization_name,
      };
      await signup(payload);              // POST /api/user-signup/
      setEmail(form.email);
      setStep(2);
      setMsg("OTP sent to your email. Please verify.");
    } catch (e2) {
      setErr(e2?.response?.data?.detail || e2?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // OTP
  const [otp, setOtp] = useState("");
  const submitOtp = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");
    setLoading(true);
    try {
      await verifySignupOtp({ email, otp });   // POST /api/verify-otp/
      setMsg("Verified! You can now sign in.");
      nav("/loguser", { replace: true });
    } catch (e3) {
      setErr(e3?.response?.data?.detail || e3?.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const doResend = async () => {
    setErr(""); setMsg("");
    try {
      await resendSignupOtp({ email });        // POST /api/resend-otp/
      setMsg("OTP resent. Check your email.");
    } catch (e4) {
      setErr("Could not resend OTP.");
    }
  };

  return (
    <div className="py-32 max-w-screen-2xl mx-auto grid md:grid-cols-2">
      {/* Left */}
      <div className="flex flex-col justify-center px-8 md:px-20 bg-white">
        {/* Logo */}
        <div className="mb-10 flex items-center gap-2">
          <img src="/logo.png" alt="IMS Logo" className="h-8" />
          <h1 className="text-xl font-bold text-gray-800">InventoryMS</h1>
        </div>

        {step === 1 ? (
          <>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an Account</h2>
            <p className="text-gray-500 mb-6">Join us to manage your inventory smarter.</p>

            {err && <div className="mb-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</div>}
            {msg && <div className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{msg}</div>}

            <form onSubmit={submitSignup} className="space-y-4 w-full max-w-md">
              {/* First Name */}
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400 text-lg" />
                <input
                  name="first_name" value={form.first_name} onChange={onChange}
                  placeholder="First Name" required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {/* Last Name */}
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400 text-lg" />
                <input
                  name="last_name" value={form.last_name} onChange={onChange}
                  placeholder="Last Name" required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {/* Organization */}
              <div className="relative">
                <FiBriefcase className="absolute left-3 top-3 text-gray-400 text-lg" />
                <input
                  name="organization_name" value={form.organization_name} onChange={onChange}
                  placeholder="Organization / Store Name" required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {/* Email */}
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400 text-lg" />
                <input
                  type="email" name="email" value={form.email} onChange={onChange}
                  placeholder="Email Address" required autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {/* Password */}
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400 text-lg" />
                <input
                  type="password" name="password" value={form.password} onChange={onChange}
                  placeholder="Password" required autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {/* Confirm Password */}
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400 text-lg" />
                <input
                  type="password" name="confirmPassword" value={form.confirmPassword} onChange={onChange}
                  placeholder="Confirm Password" required autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3 rounded-xl font-medium transition"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>

              <p className="text-center text-xs text-gray-600">
                Already have an account?{" "}
                <Link to="/loguser" className="font-medium text-indigo-600 hover:underline">Sign In</Link>
              </p>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify your email</h2>
            <p className="text-gray-500 mb-6">
              We sent a 6-digit OTP to <b>{email}</b>. Enter it below to activate your account.
            </p>

            {err && <div className="mb-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</div>}
            {msg && <div className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{msg}</div>}

            <form onSubmit={submitOtp} className="space-y-4 w-full max-w-sm">
              <input
                value={otp} onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit" disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3 rounded-xl font-medium transition"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>
              <button
                type="button" onClick={doResend}
                className="w-full border border-gray-300 hover:bg-gray-50 py-3 rounded-xl font-medium transition"
              >
                Resend OTP
              </button>

              <p className="text-center text-xs text-gray-600">
                Wrong email?{" "}
                <button type="button" onClick={() => setStep(1)} className="text-indigo-600 hover:underline">
                  Go back
                </button>
              </p>
            </form>
          </>
        )}
      </div>

      {/* Right */}
      <div className=" p-0 hidden md:flex items-center justify-center bg-white">
        <img
          src="public/register.png"
        />
      </div>
    </div>
  );
}






// import { useState } from "react";
// import { FiBriefcase, FiLock, FiMail, FiUser } from "react-icons/fi";
// import { Link, useNavigate } from "react-router-dom";
// import { resendSignupOtp, signup, verifySignupOtp } from "../../services/auth";

// export default function Register() {
//   const nav = useNavigate();
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");
//   const [msg, setMsg] = useState("");
//   const [email, setEmail] = useState("");

//   const [form, setForm] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     organization_name: "",
//   });

//   const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

//   const submitSignup = async (e) => {
//     e.preventDefault();
//     setErr(""); setMsg("");
//     if (form.password !== form.confirmPassword) {
//       setErr("Passwords do not match.");
//       return;
//     }
//     setLoading(true);
//     try {
//       await signup({
//         first_name: form.first_name,
//         last_name: form.last_name,
//         email: form.email,
//         password: form.password,
//         organization_name: form.organization_name,
//       });
//       setEmail(form.email);
//       setStep(2);
//       setMsg("OTP sent to your email. Please verify.");
//     } catch (e2) {
//       setErr(e2?.response?.data?.detail || e2?.response?.data?.message || "Registration failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const [otp, setOtp] = useState("");
//   const submitOtp = async (e) => {
//     e.preventDefault();
//     setErr(""); setMsg("");
//     setLoading(true);
//     try {
//       await verifySignupOtp({ email, otp });
//       setMsg("Verified! You can now sign in.");
//       nav("/loguser", { replace: true });
//     } catch (e3) {
//       setErr(e3?.response?.data?.detail || e3?.response?.data?.message || "OTP verification failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const doResend = async () => {
//     setErr(""); setMsg("");
//     try {
//       await resendSignupOtp({ email });
//       setMsg("OTP resent. Check your email.");
//     } catch {
//       setErr("Could not resend OTP.");
//     }
//   };

//   return (
//     <div
//       className="min-h-screen w-full relative overflow-hidden"
//       style={{
//         backgroundImage: "url('/auth-bg.jpg')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-blue-900/50 to-sky-900/60" />

//       <div className="relative z-10 flex min-h-screen items-center justify-center p-4 md:p-8">
//         <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-[0_10px_60px_-15px_rgba(0,0,0,0.5)]">
//           {/* Illustration */}
//           <div className="hidden md:flex items-center justify-center bg-white/5 backdrop-blur-xl">
//             <img
//               src="/register.png"
//               alt="Register illustration"
//               className="max-h-[420px] w-auto drop-shadow-xl"
//             />
//           </div>

//           {/* Glass card */}
//           <div className="bg-white/10 backdrop-blur-xl p-6 sm:p-10">
//             <div className="mb-8 flex items-center gap-2">
//               <img src="/logo.png" alt="IMS Logo" className="h-8 w-8 rounded-sm bg-white/70 p-1" />
//               <h1 className="text-xl font-bold text-white drop-shadow">InventoryMS</h1>
//             </div>

//             {step === 1 ? (
//               <>
//                 <h2 className="text-3xl font-bold text-white drop-shadow-sm">Create an account</h2>
//                 <p className="text-slate-100/80 mt-1 mb-6">Join us to manage your inventory smarter.</p>

//                 {err && (
//                   <div className="mb-4 rounded-xl border border-red-300/40 bg-red-500/15 px-3 py-2 text-sm text-red-100">
//                     {err}
//                   </div>
//                 )}
//                 {msg && (
//                   <div className="mb-4 rounded-xl border border-emerald-300/40 bg-emerald-500/15 px-3 py-2 text-sm text-emerald-100">
//                     {msg}
//                   </div>
//                 )}

//                 <form onSubmit={submitSignup} className="space-y-4 w-full max-w-md">
//                   <div className="relative">
//                     <FiUser className="absolute left-3 top-3.5 text-lg text-slate-200/70" />
//                     <input
//                       name="first_name" value={form.first_name} onChange={onChange}
//                       placeholder="First Name" required
//                       className="w-full pl-10 pr-4 py-3 rounded-xl text-sm
//                                  bg-white/10 text-white placeholder:text-slate-200/70
//                                  border border-white/20 outline-none
//                                  focus:bg-white/15 focus:border-sky-300/60 focus:ring-2 focus:ring-sky-300/30"
//                     />
//                   </div>
//                   <div className="relative">
//                     <FiUser className="absolute left-3 top-3.5 text-lg text-slate-200/70" />
//                     <input
//                       name="last_name" value={form.last_name} onChange={onChange}
//                       placeholder="Last Name" required
//                       className="w-full pl-10 pr-4 py-3 rounded-xl text-sm
//                                  bg-white/10 text-white placeholder:text-slate-200/70
//                                  border border-white/20 outline-none
//                                  focus:bg-white/15 focus:border-sky-300/60 focus:ring-2 focus:ring-sky-300/30"
//                     />
//                   </div>
//                   <div className="relative">
//                     <FiBriefcase className="absolute left-3 top-3.5 text-lg text-slate-200/70" />
//                     <input
//                       name="organization_name" value={form.organization_name} onChange={onChange}
//                       placeholder="Organization / Store Name" required
//                       className="w-full pl-10 pr-4 py-3 rounded-xl text-sm
//                                  bg-white/10 text-white placeholder:text-slate-200/70
//                                  border border-white/20 outline-none
//                                  focus:bg-white/15 focus:border-sky-300/60 focus:ring-2 focus:ring-sky-300/30"
//                     />
//                   </div>
//                   <div className="relative">
//                     <FiMail className="absolute left-3 top-3.5 text-lg text-slate-200/70" />
//                     <input
//                       type="email" name="email" value={form.email} onChange={onChange}
//                       placeholder="Email Address" required autoComplete="email"
//                       className="w-full pl-10 pr-4 py-3 rounded-xl text-sm
//                                  bg-white/10 text-white placeholder:text-slate-200/70
//                                  border border-white/20 outline-none
//                                  focus:bg-white/15 focus:border-sky-300/60 focus:ring-2 focus:ring-sky-300/30"
//                     />
//                   </div>
//                   <div className="relative">
//                     <FiLock className="absolute left-3 top-3.5 text-lg text-slate-200/70" />
//                     <input
//                       type="password" name="password" value={form.password} onChange={onChange}
//                       placeholder="Password" required autoComplete="new-password"
//                       className="w-full pl-10 pr-4 py-3 rounded-xl text-sm
//                                  bg-white/10 text-white placeholder:text-slate-200/70
//                                  border border-white/20 outline-none
//                                  focus:bg-white/15 focus:border-sky-300/60 focus:ring-2 focus:ring-sky-300/30"
//                     />
//                   </div>
//                   <div className="relative">
//                     <FiLock className="absolute left-3 top-3.5 text-lg text-slate-200/70" />
//                     <input
//                       type="password" name="confirmPassword" value={form.confirmPassword} onChange={onChange}
//                       placeholder="Confirm Password" required autoComplete="new-password"
//                       className="w-full pl-10 pr-4 py-3 rounded-xl text-sm
//                                  bg-white/10 text-white placeholder:text-slate-200/70
//                                  border border-white/20 outline-none
//                                  focus:bg-white/15 focus:border-sky-300/60 focus:ring-2 focus:ring-sky-300/30"
//                     />
//                   </div>

//                   <button
//                     type="submit" disabled={loading}
//                     className="w-full py-3 rounded-xl font-medium text-white
//                                bg-gradient-to-r from-sky-500 to-blue-600
//                                hover:from-sky-600 hover:to-blue-700
//                                disabled:opacity-60 transition shadow-lg shadow-blue-900/30"
//                   >
//                     {loading ? "Creating..." : "Create Account"}
//                   </button>

//                   <p className="text-center text-xs text-slate-200/80">
//                     Already have an account?{" "}
//                     <Link to="/loguser" className="font-medium text-white hover:underline">Sign in</Link>
//                   </p>
//                 </form>
//               </>
//             ) : (
//               <>
//                 <h2 className="text-3xl font-bold text-white drop-shadow-sm">Verify your email</h2>
//                 <p className="text-slate-100/80 mt-1 mb-6">
//                   We sent a 6-digit OTP to <b>{email}</b>. Enter it below to activate your account.
//                 </p>

//                 {err && (
//                   <div className="mb-4 rounded-xl border border-red-300/40 bg-red-500/15 px-3 py-2 text-sm text-red-100">
//                     {err}
//                   </div>
//                 )}
//                 {msg && (
//                   <div className="mb-4 rounded-xl border border-emerald-300/40 bg-emerald-500/15 px-3 py-2 text-sm text-emerald-100">
//                     {msg}
//                   </div>
//                 )}

//                 <form onSubmit={submitOtp} className="space-y-4 w-full max-w-sm">
//                   <input
//                     value={otp} onChange={(e) => setOtp(e.target.value)}
//                     placeholder="Enter 6-digit OTP"
//                     className="w-full px-4 py-3 rounded-xl text-sm
//                                bg-white/10 text-white placeholder:text-slate-200/70
//                                border border-white/20 outline-none
//                                focus:bg-white/15 focus:border-sky-300/60 focus:ring-2 focus:ring-sky-300/30"
//                   />
//                   <button
//                     type="submit" disabled={loading}
//                     className="w-full py-3 rounded-xl font-medium text-white
//                                bg-gradient-to-r from-sky-500 to-blue-600
//                                hover:from-sky-600 hover:to-blue-700
//                                disabled:opacity-60 transition shadow-lg shadow-blue-900/30"
//                   >
//                     {loading ? "Verifying..." : "Verify & Continue"}
//                   </button>
//                   <button
//                     type="button" onClick={doResend}
//                     className="w-full py-3 rounded-xl font-medium
//                                bg-white/10 text-white hover:bg-white/20
//                                border border-white/20 backdrop-blur transition"
//                   >
//                     Resend OTP
//                   </button>

//                   <p className="text-center text-xs text-slate-200/80">
//                     Wrong email?{" "}
//                     <button type="button" onClick={() => setStep(1)} className="text-white hover:underline">
//                       Go back
//                     </button>
//                   </p>
//                 </form>
//               </>
//             )}

//             <p className="mt-6 text-[11px] text-slate-200/60">
//               © {new Date().getFullYear()} InventoryMS. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
