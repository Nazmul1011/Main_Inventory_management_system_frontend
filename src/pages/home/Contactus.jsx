import { FiMail, FiMessageCircle, FiPhone, FiUser } from "react-icons/fi";

export default function ContactUs() {
  return (
    <section className="max-w-screen-2xl mx-auto px-20 py-20 flex items-center justify-center bg-gray-50">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-xl grid md:grid-cols-2 overflow-hidden mx-4 md:mx-20">
        {/* ===== Left Image Section ===== */}
        <div className="hidden md:block relative">
          <img
            src="src/assets/Inventoyr_contact.jpg"
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
                href="mailto:hello@yourcompany.com"
                className="text-indigo-600 font-medium hover:underline"
              >
                hello@yourcompany.com
              </a>
            </p>
          </div>

          {/* ===== Form ===== */}
          <form className="space-y-5">
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
                    placeholder="Enter your first name"
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
                    placeholder="Enter your last name"
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
                  placeholder="Enter your email address"
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
                  placeholder="+44 (000) 000-0000"
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
                  placeholder="Enter your message here..."
                  rows="4"
                  maxLength={300}
                  className="w-full border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none"
                ></textarea>
                <p className="text-xs text-gray-400 text-right mt-1">300/300</p>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full rounded-full bg-indigo-600 text-white py-3 text-sm font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2"
              >
                Submit Form →
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
