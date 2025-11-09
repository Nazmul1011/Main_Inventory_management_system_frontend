import { HiArrowNarrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/inventroypicture.jpg')" }} // ✅ public folder
    >
      {/* Optional overlay for readability */}
      <div className="absolute inset-0"></div>

      {/* Content */}
      <div className="relative max-w-screen-2xl container mx-auto py-20 px-20 flex flex-col lg:flex-row items-center lg:items-start justify-between">
        <div className="lg:w-1/2 text-left">
          {/* Heading */}
          <h1 className="text-white font-bold text-4xl leading-tight">
            Streamline Your Inventory with StockWise
          </h1>

          {/* Subtitle inside a container */}
          <div className="mt-4 bg-black/40 rounded-md p-4 max-w-md">
            <p className="text-gray-200 text-base">
              Efficiently manage your stock, track sales, and optimize your
              supply chain with our intuitive inventory management system.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 py-6  ">
            <button className="btn bg-primary text-white hover:bg-blue-700 flex items-center gap-2 p-2">
              <span>
                <Link to="/logRegister">Get Started</Link>
              </span>
              <HiArrowNarrowRight />
            </button>

            <button className="btn btn-outline btn-primary text-white border-white hover:bg-white hover:text-black p-4">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
