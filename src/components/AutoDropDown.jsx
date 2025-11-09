import { Link } from "react-router-dom";

export default function AutoDropDown() {
  return (
    <div className="flex gap-2">
      {/* Login Button */}
      <Link
        to="/loguser"
        className="btn bg-primary text-white hover:bg-blue-700"
      >
        Login
      </Link>

      {/* Sign Up Button */}
      <Link
        to="/logRegister"
        className="btn btn-outline btn-primary hover:text-white"
      >
        Sign Up
      </Link>
    </div>
  );
}
