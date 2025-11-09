import { div } from "framer-motion/client";
import SectionHeader from "./section_header.";
import { BsQrCode } from "react-icons/bs";
import { CiDeliveryTruck } from "react-icons/ci";
import { HiMiniCalendarDateRange } from "react-icons/hi2";
import { FaPeopleArrows } from "react-icons/fa";


const tools = [
  {
    icon: BsQrCode,
    // title: "Barcode & QR Code Integration",
    description:
      "This feature allows businesses to assign unique barcodes or QR codes to each product. Staff can scan these codes using barcode scanners or mobile devices to quickly update stock information, record item movements, and verify shipments.",
  },
  {
    icon: CiDeliveryTruck,
    // title: "Supplier & Purchase Management",
    description:
      "This module helps businesses manage relationships with suppliers and automate purchase workflows. Users can create, approve, and track purchase orders, monitor supplier performance, and record delivery schedules",
  },
  {
    icon: HiMiniCalendarDateRange,
    // title: "Automated Reordering",
    description:
      "Ideal for industries dealing with perishable, chemical, or pharmaceutical products, this feature tracks each batch or lot number with its corresponding expiry date.. ",
  },
  {
    icon: FaPeopleArrows,
    // title: "Automated Reordering",
    description:
      "An essential security feature that allows administrators to assign different access levels to employees based on their roles.",
  },
];

function Service() {    
  return (
    <div className="max-w-screen-2xl mx-auto container text-center px-40 py-20 bg-gray-50">
      <SectionHeader
        header={"Our Services"}
        subheader={
          "Explore Our Range Of Professional Services Tailored To Meet Your Business Needs"
        }
        description={
          "An Inventory Management System helps businesses efficiently track, manage, and control their stock levels, ensuring accurate product availability, minimizing waste, and optimizing supply chain operations in real time"
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        {tools.map((tool, index) => (
          <div
            key={index}
            className=" text-center p-6 rounded-lg transition-transform duration-300 hover:shadow-2xl hover:-translate-y-2"
          >
            <tool.icon className="text-5xl text-blue-700 mx-auto mb-5 transition-transform duration-300 group-hover:scale-110 hover:bg-white" />
            <h2 className="text-xl font-bold mb-2">{tool.title}</h2>
            <p className="text-gray-500 text-sm">{tool.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Service