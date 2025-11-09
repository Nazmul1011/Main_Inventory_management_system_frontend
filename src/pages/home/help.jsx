import { MdSupportAgent } from "react-icons/md";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { BiBookOpen } from "react-icons/bi";
import SectionHeader from "./section_header.";

const helpItems = [
  {
    icon: MdSupportAgent,
    title: "24/7 Customer Support",
    description:
      "Our dedicated support team is always ready to assist you via live chat, phone, or email — anytime you need help.",
  },
  {
    icon: IoChatbubbleEllipsesOutline,
    title: "Community & FAQs",
    description:
      "Find quick answers, helpful guides, and connect with other users in our growing support community.",
  },
  {
    icon: BiBookOpen,
    title: "Knowledge Base",
    description:
      "Access detailed documentation, video tutorials, and setup guides to help you get the most out of our system.",
  },
];

export const Help = () => {
  return (
    <div
      id="Help-section"
      className="max-w-screen-2xl container mx-auto bg-gray-100 px-6 md:px-20 py-20 text-center"
    >
      <SectionHeader
        header="Help & Support"
        subheader="We’re Here to Assist You"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {helpItems.map((item, index) => (
          <div
            key={index}
            className="items-center shadow-lg rounded-lg text-center p-6 bg-white hover:shadow-2xl transition duration-300"
          >
            <item.icon className="text-5xl text-indigo-600 mx-auto mb-5" />
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              {item.title}
            </h2>
            <p className="text-gray-500 text-sm">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full shadow-md transition duration-300">
          Visit Support Center
        </button>
      </div>
    </div>
  );
};

export default Help;
