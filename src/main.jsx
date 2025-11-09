import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


// import React from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import "./index.css";

// import App from "./App.jsx";
// import Home from "./pages/home/home.jsx";
// import Help from "./pages/help/Help.jsx";
// import About from "./pages/Aboutus/About.jsx";
// import ContactUs from "./pages/Pricing.jsx";
// import UserLogin from "./pages/user/User_login.jsx";

// createRoot(document.getElementById("root")).render(
//     <BrowserRouter>
//       <Routes>
//         <Route element={<App />}>
//           <Route path="/" element={<Home />} />
//           <Route path="/feature" element={<div>Feature</div>} />
//           <Route path="/contact" element={<ContactUs />} />
//           <Route path="/aboutus" element={<About />} />
//           <Route path="/help" element={<Help />} />
//           <Route path="/userlogin" element={<UserLogin />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
// );
