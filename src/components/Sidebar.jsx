// src/pages/Dash_board/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiFile, FiHome, FiBox, FiUsers, FiTruck, FiBarChart2,
  FiSettings, FiUser, FiFileText, FiShoppingCart, FiTrendingUp,
  FiLogOut, FiTag, FiList, FiEdit
} from "react-icons/fi";
import { motion } from "framer-motion";
import { logout } from "../services/auth";

export default function Sidebar({ collapsed, setCollapsed }) {
  const nav = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      nav("/", { replace: true });
    }
  };

  const linkBase =
    "flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition text-sm";
  const linkActive = "bg-gray-800 text-indigo-400 font-semibold shadow-inner";
  const sectionTitle =
    "uppercase text-[11px] tracking-wider font-semibold text-gray-500 px-4 mt-5 mb-1";

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 250 }}
      className="bg-gray-900 h-screen sticky top-0 flex flex-col shadow-lg transition-all duration-300"
    >
      {/* ===== Logo & Collapse Button ===== */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
        {!collapsed && (
          <h1 className="text-lg font-semibold text-white truncate">IMS Admin</h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-indigo-400 transition"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      {/* ===== Navigation ===== */}
      <nav className="flex-1 mt-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
        {!collapsed && <div className={sectionTitle}>Dashboard</div>}
        <NavLink to="/dashboard" className={({isActive}) => `${linkBase} ${isActive ? linkActive : ""}`}>
          <FiHome className="text-xl" /> {!collapsed && <span>Overview</span>}
        </NavLink>

        {!collapsed && <div className={sectionTitle}>Inventory</div>}
        <NavLink to="/dashboard/product" className={({isActive}) => `${linkBase} ${isActive ? linkActive : ""}`}>
          <FiBox className="text-xl" /> {!collapsed && <span>Products</span>}
        </NavLink>
        <NavLink to="/dashboard/productlist" className={({isActive}) => `${linkBase} ${isActive ? linkActive : ""}`}>
          <FiFileText className="text-xl" /> {!collapsed && <span>Product List</span>}
        </NavLink>
        <NavLink to="/dashboard/categories" className={({isActive}) => `${linkBase} ${isActive ? linkActive : ""}`}>
          <FiTag className="text-xl" /> {!collapsed && <span>Categories</span>}
        </NavLink>

        {!collapsed && <div className={sectionTitle}>Sales</div>}
        <NavLink to="/dashboard/pos" className={({isActive}) => `${linkBase} ${isActive ? linkActive : ""}`}>
          <FiShoppingCart className="text-xl" /> {!collapsed && <span>POS System</span>}
        </NavLink>
        <NavLink to="/dashboard/invoices" className={({isActive}) => `${linkBase} ${isActive ? linkActive : ""}`}>
          <FiList className="text-xl" /> {!collapsed && <span>Invoice List</span>}
        </NavLink>

        {!collapsed && <div className={sectionTitle}>Customers</div>}
        <NavLink to="/dashboard/customeradd" className={({isActive}) => `${linkBase} ${isActive ? linkActive : ""}`}>
          <FiUser className="text-xl" /> {!collapsed && <span>Add Customer</span>}
        </NavLink>
        <NavLink to="/dashboard/customerlist" className={({isActive}) => `${linkBase} ${isActive ? linkActive : ""}`}>
          <FiUsers className="text-xl" /> {!collapsed && <span>Customer List</span>}
        </NavLink>

        {!collapsed && <div className={sectionTitle}>Suppliers</div>}
        <NavLink to="/dashboard/supplier" className={({isActive}) => `${linkBase} ${isActive ? linkActive : ""}`}>
          <FiTruck className="text-xl" /> {!collapsed && <span>Add Supplier</span>}
        </NavLink>
        <NavLink to="/dashboard/supplierlist" className={({isActive}) => `${linkBase} ${isActive ? linkActive : ""}`}>
          <FiTruck className="text-xl" /> {!collapsed && <span>Supplier List</span>}
        </NavLink>

        {!collapsed && <div className={sectionTitle}>Reports</div>}
        <NavLink to="/dashboard/salesreport" className={({isActive}) => `${linkBase} ${isActive ? linkActive : ""}`}>
          <FiTrendingUp className="text-xl" /> {!collapsed && <span>Sales Report</span>}
        </NavLink>
        <NavLink to="/dashboard/stockreport" className={({isActive}) => `${linkBase} ${isActive ? linkActive : ""}`}>
          <FiBarChart2 className="text-xl" /> {!collapsed && <span>Stock Report</span>}
        </NavLink>

        {/* ===== Account / Profile ===== */}
        {!collapsed && <div className={sectionTitle}>Account</div>}
        <NavLink to="/dashboard/profile" className={({isActive}) => `${linkBase} ${isActive ? linkActive : ""}`}>
          <FiUser className="text-xl" /> {!collapsed && <span>Profile</span>}
        </NavLink>

        {!collapsed && <div className={sectionTitle}>Management</div>}
        <NavLink to="/dashboard/usermanagement" className={({isActive}) => `${linkBase} ${isActive ? linkActive : ""}`}>
          <FiUser className="text-xl" /> {!collapsed && <span>User Management</span>}
        </NavLink>
        <NavLink to="/dashboard/settings" className={({isActive}) => `${linkBase} ${isActive ? linkActive : ""}`}>
          <FiSettings className="text-xl" /> {!collapsed && <span>Settings</span>}
        </NavLink>
      </nav>

      {/* ===== Footer (Logout) ===== */}
      <div className="border-t border-gray-800 p-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition text-sm"
          title="Log out"
        >
          <FiLogOut className="text-xl" />
          {!collapsed && <span>Logout</span>}
        </button>
        {!collapsed && (
          <div className="mt-2 text-center text-[11px] text-gray-500">
            © {new Date().getFullYear()} IMS Dashboard
          </div>
        )}
      </div>
    </motion.aside>
  );
}
