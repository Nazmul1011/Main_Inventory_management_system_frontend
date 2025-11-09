import { FiChevronDown, FiLinkedin, FiTwitter, FiGithub } from "react-icons/fi";
import { useState } from "react";

export default function About() {
  const [openIndex, setOpenIndex] = useState(0);

  const accordionData = [
    {
      title: "Tailored Inventory Solutions",
      content:
        "Our IMS platform is designed to adapt to your business — from small startups to enterprise chains. Every feature is crafted to simplify operations, reduce waste, and maximize profit.",
    },
    {
      title: "Scalable & Future-Ready",
      content:
        "Built with modern architecture, our system grows alongside your inventory demands, ensuring smooth performance and scalability.",
    },
    {
      title: "Client-Centric & Transparent",
      content:
        "We prioritize our clients’ goals and feedback, ensuring that every update enhances usability, clarity, and business value.",
    },
    {
      title: "Security & Compliance First",
      content:
        "Your business data is safe with us. Our infrastructure follows industry-grade encryption and GDPR-compliant security measures.",
    },
  ];

  const team = [
    {
      name: "Nazmul Hasan",
      role: "Founder & Lead Developer",
      img: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    {
      name: "Arafat Rahman",
      role: "UI/UX Designer",
      img: "https://randomuser.me/api/portraits/men/23.jpg",
    },
    {
      name: "Rafsan Jamil",
      role: "Backend Engineer",
      img: "https://randomuser.me/api/portraits/men/44.jpg",
    },
   
  ];

  return (
    <div className="bg-gray-50 text-gray-900">
      {/* ================== Hero / About Section ================== */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center py-16 px-6">
        <img
          src="src/assets/Inventoyr_contact.jpg"
          alt="Inventory Management Team"
          className="rounded-xl shadow-lg object-cover w-full h-[400px]"
        />

        <div>
          <h3 className="text-sm uppercase text-green-600 font-semibold mb-2">
            Why Choose IMS
          </h3>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Built on Trust, <br /> Driven by Results
          </h1>

          <div className="space-y-2 border-t border-gray-200 mt-6">
            {accordionData.map((item, index) => (
              <div
                key={index}
                className="border-b border-gray-200 py-3 cursor-pointer"
                onClick={() => setOpenIndex(index === openIndex ? null : index)}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-gray-800">{item.title}</h4>
                  <FiChevronDown
                    className={`transform transition ${
                      openIndex === index ? "rotate-180 text-indigo-600" : ""
                    }`}
                  />
                </div>
                {openIndex === index && (
                  <p className="text-gray-600 mt-2 text-sm">{item.content}</p>
                )}
              </div>
            ))}
          </div>

          <button className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition">
            Learn More
          </button>
        </div>
      </section>

      {/* ================== Team Section ================== */}
      <section className="bg-gray-50 py-20 text-center">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Meet the Team
          </h2>
          <p className="text-gray-600 mt-3 mb-12 max-w-2xl mx-auto">
            The people behind our Inventory Management System — a passionate
            team dedicated to innovation, performance, and user-centric design.
          </p>

          {/* Team Members Grid */}
          <div className="grid sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-10">
            {team.map((member, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-4 group"
              >
                {/* Profile Picture */}
                <div className="relative">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-36 h-36  rounded-full  object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>

                {/* Social Icons */}
                <div className="flex justify-center gap-4 text-gray-400">
                  <FiLinkedin className="hover:text-indigo-500 cursor-pointer transition" />
                  <FiTwitter className="hover:text-sky-500 cursor-pointer transition" />
                  <FiGithub className="hover:text-gray-700 cursor-pointer transition" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
