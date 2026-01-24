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
      name: "Mahabubur Rahman Shovo",
      role: "",
      img: "/src/assets/Mahabubur Rahman Shovo.jpeg",
    },
    {
      name: "Shakib Ali Khan",
      role: "",
      img: "/src/assets/Shakib Ali Khan.jpeg",
    },
    {
      name: "Ali Hayder",
      role: "",
      img: "/src/assets/Ali Hayder.jpeg",
    },
  ];

  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* ================== Hero / About Section ================== */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center py-16 px-6">
        <img
          src="/src/assets/Inventoyr_contact.jpg"
          alt="Inventory Management Team"
          className="rounded-xl shadow-lg object-cover w-full h-[400px]"
        />

        <div>
          <h3 className="text-sm uppercase text-indigo-600 font-semibold mb-2">
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
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Meet the Team
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl">
              The people behind our Inventory Management System — a passionate
              team dedicated to innovation and performance.
            </p>
          </div>

          {/* Team Members Grid */}
          <div className="grid md:grid-cols-3 gap-x-8 gap-y-16">
            {team.map((member, index) => (
              <div key={index} className="flex flex-col">
                {/* Name and Role Header */}
                <div className="flex justify-between items-end mb-4 px-1">
                  <h3 className="text-xl font-bold text-gray-900 leading-none">
                    {member.name.split(" ")[0]}
                  </h3>
                  <span className="text-sm font-medium text-gray-900 uppercase tracking-wider leading-none">
                    {member.role}
                  </span>
                </div>

                {/* Team Image - Large card style */}
                <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden group">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
