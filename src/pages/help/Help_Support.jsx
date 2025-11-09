import React from "react";
import { HiOutlineChartBar, HiOutlineRefresh } from "react-icons/hi";
import { IoBookOutline } from "react-icons/io5";
import { FaQuestionCircle } from "react-icons/fa";
import { RxGear } from "react-icons/rx";

export const HelpSupport = () => {
  return (
    <div className="py-10 px-8 lg:px-10">
      <h1 className="text-4xl font-bold">Help & Support</h1>
      <p className="text-gray-400 mt-4 max-w-2xl">
        StockWise offers a comprehensive suite of tools to help you manage your
        inventory effectively.
      </p>

      {/* Card container */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {/* Card 1 */}
        <div
          className="card bg-base-100 shadow-md rounded-lg p-6 
  group hover:bg-blue-400 transition-all duration-300 ease-in-out"
        >
          <div className="flex flex-col items-start gap-3">
            {/* Icon */}
            <IoBookOutline className="text-4xl text-primary transition-colors duration-300 group-hover:text-white" />

            {/* Heading */}
            <h2 className="text-xl font-bold transition-colors duration-300 group-hover:text-white">
              Gettingh Started
            </h2>

            {/* Paragraph */}
            <p className="text-gray-500 transition-colors duration-300 group-hover:text-white">
              Learn the basic of using the system
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div
          className="card bg-base-100 shadow-md rounded-lg p-6 
  group hover:bg-blue-400 transition-all duration-300 ease-in-out"
        >
          <div className="flex flex-col items-start gap-3">
            {/* Icon */}
            <FaQuestionCircle className="text-4xl text-primary transition-colors duration-300 group-hover:text-white" />

            {/* Heading */}
            <h2 className="text-xl font-bold transition-colors duration-300 group-hover:text-white">
              FAQs
            </h2>

            {/* Paragraph */}
            <p className="text-gray-500 transition-colors duration-300 group-hover:text-white">
              Frequently asked question
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div
          className="card bg-base-100 shadow-md rounded-lg p-6 
  group hover:bg-blue-400 transition-all duration-300 ease-in-out"
        >
          <div className="flex flex-col items-start gap-3">
            {/* Icon */}
            <RxGear className="text-4xl text-primary transition-colors duration-300 group-hover:text-white" />

            {/* Heading */}
            <h2 className="text-xl font-bold transition-colors duration-300 group-hover:text-white">
              Troubleshooting
            </h2>

            {/* Paragraph */}
            <p className="text-gray-500 transition-colors duration-300 group-hover:text-white">
              Solve common issues
            </p>
          </div>
        </div>
      </div>

      <div className="py-10 text-center sm:text-left">
        <h1 className="text-4xl font-bold">Contact Support</h1>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto sm:mx-0">
          If you can't find the answer you're looking for, please contact our
          support team.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 py-4 items-center sm:items-start justify-center sm:justify-start">
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
            Contact Us
          </button>
          <button className="btn btn-outline btn-primary">
            View Document
          </button>
        </div>
      </div>
    </div>
  );
};
