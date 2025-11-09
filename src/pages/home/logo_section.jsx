
import SectionHeader from "./section_header.";
import { FaApple, FaGoogle,FaLinkedin } from "react-icons/fa";
import { TfiMicrosoftAlt } from "react-icons/tfi";
import { motion } from "framer-motion";

function LogoSection() {

    const logos = [
      {
        icon: FaApple,
        name: "Apple",
      },
      {
        icon: FaGoogle,
        name: "Google",
      },
      {
        icon: FaLinkedin,
        name: "Linkedin",
      },
      {
        icon: TfiMicrosoftAlt,
        name: "Microsoft",
      },
    ];



    return (
      <div className="px-10 py-20 bg-gray-50 max-w-screen-2xl mx-auto container text-center ">
        <SectionHeader
          header="Our Trusted Partners"
          subheader="Companies We've Worked With"
          description="We are proud to have collaborated with a diverse range of companies, from startups to industry leaders."
        />

        {/* logo container */}
        <div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 mt-10 ">
            {/* logo input */}
            {logos.map((logo, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex justify-center items-center bg-white rounded-full p-6 h-24 w-24 sm:h-28 sm:w-28 shadow-md"
              >
                <logo.icon
                  className="text-4xl sm:text-5xl text-primary"
                  title={logo.name}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
}
export default LogoSection;