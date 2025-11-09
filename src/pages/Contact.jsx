import {
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineEnvelope,
} from "react-icons/hi2";

function ContactUs (){
     return (
    <section className="bg-[#f8fafc] min-h-[70vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <header>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d131b]">
            Contact Us
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            We’re here to help! Reach out with any questions or feedback.
          </p>
        </header>

        {/* Form */}
        <form className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0d131b] mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Your  Name"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0d131b] mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Your  Email"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0d131b] mb-1">
              Subject
            </label>
            <input
              type="text"
              placeholder="Subject"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0d131b] mb-1">
              Message
            </label>
            <textarea
              rows={5}
              placeholder="Write your message…"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-md text-white bg-[#2c80ed] hover:bg-[#1f6ad0] text-sm font-medium"
          >
            Submit
          </button>
        </form>

        <hr className="my-8 border-slate-200" />

        {/* Contact Information */}
        <section>
          <h2 className="text-base font-semibold text-[#0d131b]">
            Contact Information
          </h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-slate-600">
                <HiOutlineMapPin />
              </span>
              <div>
                <p className="text-[#0d131b] font-medium">Address</p>
                <p className="text-slate-500">
                  1234 Example Ave, Suite
                  <br />
                  426, Anytown, CA 90234
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-slate-600">
                <HiOutlinePhone />
              </span>
              <div>
                <p className="text-[#0d131b] font-medium">Phone</p>
                <p className="text-slate-500">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-slate-600">
                <HiOutlineEnvelope />
              </span>
              <div>
                <p className="text-[#0d131b] font-medium">Email</p>
                <p className="text-slate-500">support@stockpilot.com</p>
              </div>
            </div>
          </div>
        </section>

        {/* Extra Question Section */}
        <section className="mt-10">
          <h3 className="text-base font-semibold text-[#0d131b]">
            Extra Question Section
          </h3>
          <div className="mt-3">
            <label className="block text-sm font-medium text-[#0d131b] mb-1">
              Additional Questions
            </label>
            <textarea
              rows={4}
              placeholder="Type here…"
              className="w-full sm:max-w-md rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            className="mt-3 px-4 py-2 rounded-md text-white bg-[#2c80ed] hover:bg-[#1f6ad0] text-sm font-medium"
          >
            Submit Additional Questions
          </button>
        </section>
      </div>
    </section>
  );
}
export default ContactUs;