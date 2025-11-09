import React from "react";
import { IoBookOutline } from "react-icons/io5";
import { FaQuestionCircle } from "react-icons/fa";
import { RxGear } from "react-icons/rx";
import StatsSection from "./Statesection";

export const AboutKeyFeatures = () => {
  return (
    <div className="py-10 px-8 lg:px-10">
      <div className="py-10">
        <h1 className="text-4xl font-bold">About StockPilot</h1>
        <p className="text-gray-400 mt-4 l">
          StockPilot is a cutting-edge inventory management system designed to
          streamline your business operations. Our mission is to provide a
          user-friendly, efficient, and reliable solution for businesses of all
          sizes, helping them optimize their inventory, reduce costs, and
          improve customer satisfaction.
        </p>
      </div>

      <h1 className="text-4xl font-bold">Key Features</h1>

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
              Order Management
            </h2>

            {/* Paragraph */}
            <p className="text-gray-500 transition-colors duration-300 group-hover:text-white">
              Efficient order processing and fulfillment.
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
              Reporting & Analytics
            </h2>

            {/* Paragraph */}
            <p className="text-gray-500 transition-colors duration-300 group-hover:text-white">
              Data-driven insights for informed decisions.
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
              User Management
            </h2>

            {/* Paragraph */}
            <p className="text-gray-500 transition-colors duration-300 group-hover:text-white">
              Role-based access control for team collaboration.
            </p>
          </div>
        </div>

        {/* card 4 */}
         <div
          className="card bg-base-100 shadow-md rounded-lg p-6 
  group hover:bg-blue-400 transition-all duration-300 ease-in-out"
        >
          <div className="flex flex-col items-start gap-3">
            {/* Icon */}
            <FaQuestionCircle className="text-4xl text-primary transition-colors duration-300 group-hover:text-white" />

            {/* Heading */}
            <h2 className="text-xl font-bold transition-colors duration-300 group-hover:text-white">
              Cost Optimization
            </h2>

            {/* Paragraph */}
            <p className="text-gray-500 transition-colors duration-300 group-hover:text-white">
              Minimize carrying costs and maximize profits.
            </p>
          </div>
        </div>
        {/* card 5 */}
         <div
          className="card bg-base-100 shadow-md rounded-lg p-6 
  group hover:bg-blue-400 transition-all duration-300 ease-in-out"
        >
          <div className="flex flex-col items-start gap-3">
            {/* Icon */}
            <FaQuestionCircle className="text-4xl text-primary transition-colors duration-300 group-hover:text-white" />

            {/* Heading */}
            <h2 className="text-xl font-bold transition-colors duration-300 group-hover:text-white">
              Security
            </h2>

            {/* Paragraph */}
            <p className="text-gray-500 transition-colors duration-300 group-hover:text-white">
              Robust security measures to protect your data.
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
       
       <StatsSection/>

        <div className="flex flex-col sm:flex-row gap-4 py-4 items-center sm:items-start justify-center sm:justify-start">
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
            Contact Us
          </button>
          <button className="px-4 py-2 rounded-md border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition">
            View Document
          </button>
        </div>
      </div>
    </div>
  );
};
