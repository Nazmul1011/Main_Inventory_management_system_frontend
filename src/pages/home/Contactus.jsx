import { useState } from "react";
import {
  FiMail,
  FiMessageCircle,
  FiPhone,
  FiUser,
  FiTag,
} from "react-icons/fi";
import axios from "axios";

export default function ContactUs() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    // 1. Phone Validation (BD format)
    // Accept: +8801xxxxxxxxx or 01xxxxxxxxx
    const bdPhoneRegex = /^(\+88)?01[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(form.phone)) {
      setErr(
        "Please enter a valid Bangladeshi phone number (e.g., 017xxxxxxxx).",
      );
      return;
    }

    setLoading(true);
    try {
      // 2. Prepare Payload
      // Backend expects: name, email, subject, message
      const payload = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        subject: form.subject || "New Inquiry",
        message: `${form.message}\n\nPhone: ${form.phone}`,
      };

      // 3. API Call
      // Assuming axios is configured with baseURL or proxy. If not, use relative path.
      // Ideally use a configured instance, but direct axios works if proxy is set in vite.config
      // or if using full URL. I'll use relative path assuming proxy or same origin.
      await axios.post("http://127.0.0.1:8000/api/contact-messages/", payload);

      setMsg("Thank you! Your message has been sent.");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      setErr("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-screen-2xl mx-auto px-4 md:px-20 py-20 flex items-center justify-center bg-gray-50">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-xl grid md:grid-cols-2 overflow-hidden mx-auto">
        {/* ===== Left Image Section ===== */}
        <div className="hidden md:block relative">
          <img
            src="/src/assets/Inventoyr_contact.jpg"
            alt="Office Building"
            className="object-cover w-full h-full"
          />
        </div>

        {/* ===== Right Form Section ===== */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          {/* Logo */}
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Let’s Get In <span className="text-indigo-600">Touch.</span>
            </h2>
            <p className="text-gray-500 mt-2">
              Or just reach out manually at{" "}
              <a
                href="mailto:patwarysmah59@gmail.com"
                className="text-indigo-600 font-medium hover:underline"
              >
                patwarysmah59@gmail.com
              </a>
            </p>
          </div>

          {err && (
            <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm">
              {err}
            </div>
          )}
          {msg && (
            <div className="mb-4 p-3 rounded bg-green-50 text-green-600 text-sm">
              {msg}
            </div>
          )}

          {/* ===== Form ===== */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  First Name
                </label>
                <div className="relative mt-1">
                  <FiUser className="absolute left-3 top-3 text-gray-400 text-lg" />
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                    className="w-full border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Last Name
                </label>
                <div className="relative mt-1">
                  <FiUser className="absolute left-3 top-3 text-gray-400 text-lg" />
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    required
                    className="w-full border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Email Address
              </label>
              <div className="relative mt-1">
                <FiMail className="absolute left-3 top-3 text-gray-400 text-lg" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                  className="w-full border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Phone Number
              </label>
              <div className="relative mt-1">
                <FiPhone className="absolute left-3 top-3 text-gray-400 text-lg" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="01xxxxxxxxx"
                  required
                  className="w-full border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Subject (Added field) */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Subject
              </label>
              <div className="relative mt-1">
                <FiTag className="absolute left-3 top-3 text-gray-400 text-lg" />
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Inquiry subject"
                  required
                  className="w-full border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Message
              </label>
              <div className="relative mt-1">
                <FiMessageCircle className="absolute left-3 top-3 text-gray-400 text-lg" />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Enter your message here..."
                  rows="4"
                  maxLength={300}
                  required
                  className="w-full border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none"
                ></textarea>
                <p className="text-xs text-gray-400 text-right mt-1">
                  {form.message.length}/300
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-indigo-600 text-white py-3 text-sm font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Submit Form →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
