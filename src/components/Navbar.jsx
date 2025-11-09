import { Link as ScrollLink } from "react-scroll";
import { Link, useLocation } from "react-router-dom";
import AuthDropdowns from "./AutoDropDown";

function Navbar() {
  const location = useLocation();

  // helper: if user is on another page, redirect to home and then scroll
  const handleScrollLink = (e, targetId) => {
    if (location.pathname !== "/") {
      e.preventDefault();
      window.location.href = `/#${targetId}`;
    }
  };

  return (
    <div className="navbar max-w-screen-2xl container mx-auto bg-white shadow-sm sticky top-0 z-50">
      {/* ---- Left ---- */}
      <div className="navbar-start">
        {/* mobile dropdown */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>

          {/* Mobile Menu */}
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-white rounded-box z-10 mt-3 w-52 p-2 shadow font-medium"
          >
            {/* Scroll Links (same page) */}
            <li>
              <ScrollLink
                to="hero-section"
                smooth={true}
                duration={600}
                offset={-80}
                className="cursor-pointer"
                onClick={(e) => handleScrollLink(e, "hero-section")}
              >
                Home
              </ScrollLink>
            </li>

            <li>
              <ScrollLink
                to="service-section"
                smooth={true}
                duration={600}
                offset={-80}
                className="cursor-pointer"
                onClick={(e) => handleScrollLink(e, "service-section")}
              >
                Services
              </ScrollLink>
            </li>

            <li>
              <ScrollLink
                to="testimonial-section"
                smooth={true}
                duration={600}
                offset={-80}
                className="cursor-pointer"
                onClick={(e) => handleScrollLink(e, "testimonial-section")}
              >
                Testimonials
              </ScrollLink>
            </li>

            <li>
              <ScrollLink
                to="Contactus-section"
                smooth={true}
                duration={600}
                offset={-80}
                className="cursor-pointer"
                onClick={(e) => handleScrollLink(e, "Contactus-section")}
              >
                Contact
              </ScrollLink>
            </li>

            {/* Normal routes */}
            <li>
              <Link to="/aboutus">About Us</Link>
            </li>
            {/* <li>
              <Link to="/help">Help</Link>
            </li> */}
            <li>
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
        </div>

        {/* Logo */}
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <img src="./logo.png" alt="IMS Logo" className="h-8" />
          <span>IMS</span>
        </Link>
      </div>

      {/* ---- Center (Desktop Menu) ---- */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-medium">
          {/* Same-page scroll links */}
          <li>
            <ScrollLink
              to="hero-section"
              smooth={true}
              duration={600}
              offset={-80}
              className="cursor-pointer hover:text-indigo-600"
              onClick={(e) => handleScrollLink(e, "hero-section")}
            >
              Home
            </ScrollLink>
          </li>

          <li>
            <ScrollLink
              to="service-section"
              smooth={true}
              duration={600}
              offset={-80}
              className="cursor-pointer hover:text-indigo-600"
              onClick={(e) => handleScrollLink(e, "service-section")}
            >
              Services
            </ScrollLink>
          </li>

          <li>
            <ScrollLink
              to="testimonial-section"
              smooth={true}
              duration={600}
              offset={-80}
              className="cursor-pointer hover:text-indigo-600"
              onClick={(e) => handleScrollLink(e, "testimonial-section")}
            >
              Testimonials
            </ScrollLink>
          </li>

          <li>
            <ScrollLink
              to="Contactus-section"
              smooth={true}
              duration={600}
              offset={-80}
              className="cursor-pointer hover:text-indigo-600"
              onClick={(e) => handleScrollLink(e, "Contactus-section")}
            >
              Contact
            </ScrollLink>
          </li>

          <li>
            <ScrollLink
              to="Help-section"
              smooth={true}
              duration={600}
              offset={-80}
              className="cursor-pointer hover:text-indigo-600"
              onClick={(e) => handleScrollLink(e, "Help-section")}
            >
              Help
            </ScrollLink>
          </li>

          {/* Normal route links */}
          <li>
            <Link to="/aboutus" className="hover:text-indigo-600">
              About Us
            </Link>
          </li>
        </ul>
      </div>

      {/* ---- Right ---- */}
      <div className="navbar-end">
        <AuthDropdowns />
      </div>
    </div>
  );
}

export default Navbar;
