import { IoMdAnalytics } from "react-icons/io";
import { MdEmergencyRecording } from "react-icons/md";
import { RiTimeZoneFill } from "react-icons/ri";
import SectionHeader from "./section_header.";

const tools = [
  {
    icon: RiTimeZoneFill,
    title: "Real-Time Collaboration",
    description:
      "Track stock levels in real time to maintain optimal inventory.",
  },
  {
    icon: IoMdAnalytics,
    title: "Sales Analytics",
    description: "Analyze trends and top products to optimize inventory.",
  },
  {
    icon: MdEmergencyRecording,
    title: "Automated Reordering",
    description:
      "Set up automated reordering rules and  you will never run out of essential items. ",
  },
];

export const KeyFeaturesSection = () => {
  return (
    <div className="max-w-screen-2xl container mx-auto bg-gray-100 px-20 py-20 text-center">
      <SectionHeader
        header="The Tools You Need"
        subheader="All-in-One Solution for Your Projects"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {tools.map((tool, index) => (
          <div
            key={index}
            className="items-center shadow-lg rounded-lg text-center p-6 bg-white hover:shadow-xl transition"
          >
            <tool.icon className="text-5xl text-primary mx-auto mb-5" />
            <h2 className="text-xl font-bold mb-2">{tool.title}</h2>
            <p className="text-gray-500 text-sm">{tool.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button className="bg-primary text-white px-6 py-3 rounded-lg shadow-md  transition">
          Key Features
        </button>
      </div>
    </div>
  );
};
export default KeyFeaturesSection;
