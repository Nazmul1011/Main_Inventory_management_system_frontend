
import { useState } from "react";

import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* ===== Sticky Sidebar ===== */}
      <div className="sticky top-0 h-screen">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* ===== Main Content ===== */}
      <div className="flex-1 flex flex-col w-full overflow-x-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}




