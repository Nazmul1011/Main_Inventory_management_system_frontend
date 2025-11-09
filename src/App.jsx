
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import About from "./pages/Aboutus/About.jsx";
import ContactUs from "./pages/Contact.jsx";
import Help from "./pages/help/Help.jsx";
import { FooterHome } from "./pages/home/footerHome";
import Home from "./pages/home/home.jsx";

import ForgetPass from "./pages/Forgetpass/Forgetpass.jsx";
import Register from "./pages/Register/Register_layout.jsx";
import Login from "./pages/login/Login.jsx";

import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import CategoryList from "./pages/Dash_board/Category/CategoryList.jsx";
import CustomerAdd from "./pages/Dash_board/Customer/Customer_add.jsx";
import CustomerList from "./pages/Dash_board/Customer/Customer_list.jsx";
import Dash_board_layout from "./pages/Dash_board/Dash_board_layout.jsx";
import Dashboard from "./pages/Dash_board/Dashboard.jsx";
import ProductAdd from "./pages/Dash_board/Product/Product_add.jsx";
import ProductList from "./pages/Dash_board/Product/Product_list.jsx";
import SalesReport from "./pages/Dash_board/Report/salesReport.jsx";
import StockReport from "./pages/Dash_board/Report/stockReport.jsx";
import AddSupplier from "./pages/Dash_board/Supplier/addSupplier.jsx";
import SupplierList from "./pages/Dash_board/Supplier/supplierList.jsx";
import UserManagement from "./pages/Dash_board/userManagement/userManagement.jsx";
import PointOfSale from "./pages/Pos/Pos_system.jsx";
import InvoicePage from "./pages/Pos/invoice.jsx";
import InvoicesList from "./pages/Pos/InvoicesList.jsx";
import EditInvoice from "./pages/Pos/EditInvoice.jsx";
import Profile from "./pages/Dash_board/Profile/Profile.jsx";

function DefaultLayout() {
  return (
    <div>
      <Navbar />
      <main><Outlet /></main>
      <FooterHome />
    </div>
  );
}

function AuthLayout() {
  return <div className="min-h-screen"><Outlet /></div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public site */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/feature" element={<div>Feature</div>} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/aboutus" element={<About />} />
          <Route path="/help" element={<Help />} />
        </Route>

        {/* Auth screens */}
        <Route element={<AuthLayout />}>
          <Route path="/loguser" element={<Login />} />
          <Route path="/logRegister" element={<Register />} />
          <Route path="/forgetpass" element={<ForgetPass />} />
        </Route>

        {/* Dashboard (protected) */}
        <Route
          element={
            <ProtectedRoute>
              <Dash_board_layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/product" element={<ProductAdd />} />
          <Route path="/dashboard/categories" element={<CategoryList />} />
          <Route path="/dashboard/productlist" element={<ProductList />} />
          <Route path="/dashboard/customerlist" element={<CustomerList />} />
          <Route path="/dashboard/customeradd" element={<CustomerAdd />} />

          <Route path="/dashboard/profile" element={<Profile />} />
          {/* POS & Invoices */}
          <Route path="/dashboard/pos" element={<PointOfSale />} />
          <Route path="/dashboard/invoice/:id" element={<InvoicePage />} />
          <Route path="/dashboard/invoice/preview" element={<InvoicePage />} />

          <Route path="/dashboard/invoices" element={<InvoicesList />} />      {/* NEW: all invoices */}
          <Route path="/dashboard/invoice/:id/edit" element={<EditInvoice />} />{/* NEW: edit */}


          <Route path="/dashboard/salesreport" element={<SalesReport />} />
          <Route path="/dashboard/stockreport" element={<StockReport />} />
          <Route path="/dashboard/supplier" element={<AddSupplier />} />
          <Route path="/dashboard/supplierlist" element={<SupplierList />} />
          <Route path="/dashboard/usermanagement" element={<UserManagement />} />
          <Route path="/dashboard/management" element={<div>Management (stub)</div>} />
          <Route path="/dashboard/report" element={<div>Report (stub)</div>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div className="p-6 text-center text-slate-600">Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
