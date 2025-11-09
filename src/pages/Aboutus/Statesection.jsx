import React from "react";
import CountUp from "react-countup";

const StatsSection = () => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Card 1 */}
      <div className="card bg-base-100 shadow-md rounded-lg p-6 group hover:bg-blue-400 transition-all duration-300 ease-in-out">
        <div className="flex flex-col items-start gap-3">
          <h2 className="text-4xl font-bold transition-colors duration-300 group-hover:text-white">
            <CountUp end={5} duration={2} />+
          </h2>
          <p className="text-gray-500 transition-colors duration-300 group-hover:text-white">
            Years of Experience
          </p>
        </div>
      </div>

      {/* Card 2 */}
      <div className="card bg-base-100 shadow-md rounded-lg p-6 group hover:bg-blue-400 transition-all duration-300 ease-in-out">
        <div className="flex flex-col items-start gap-3">
          <h2 className="text-4xl font-bold transition-colors duration-300 group-hover:text-white">
            <CountUp end={10} duration={2} />+
          </h2>
          <p className="text-gray-500 transition-colors duration-300 group-hover:text-white">
            Members
          </p>
        </div>
      </div>

      {/* Card 3 */}
      <div className="card bg-base-100 shadow-md rounded-lg p-6 group hover:bg-blue-400 transition-all duration-300 ease-in-out">
        <div className="flex flex-col items-start gap-3">
          <h2 className="text-4xl font-bold transition-colors duration-300 group-hover:text-white">
            <CountUp end={100} duration={3} />+
          </h2>
          <p className="text-gray-500 transition-colors duration-300 group-hover:text-white">
            Satisfied Clients
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
