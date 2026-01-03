import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useApp } from "../contexts/AppContext";

import Header from "./Header";
import Navigation from "./Navigation";
import BottomNav from "./BottomNav";
import SimpleDashboard from "./SimpleDashboard";

const AppShellLayout = () => {
  const { darkMode, simpleMode } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      
      {/* HEADER */}
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* SIDE NAVIGATION */}
      <Navigation isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* MAIN CONTENT */}
      <main className="pb-20 pt-20">
        {simpleMode ? <SimpleDashboard /> : <Outlet />}
      </main>

      {/* BOTTOM NAV */}
      <BottomNav />
    </div>
  );
};

export default AppShellLayout;
