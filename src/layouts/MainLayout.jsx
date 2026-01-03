import React, { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { 
  Menu, Home, UserCheck, Calendar, AlertTriangle, CreditCard 
} from "lucide-react";

const MainLayout = ({ children }) => {
  const { darkMode, language, setLanguage, setDarkMode } = useApp();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen relative ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>

      {/* TOP LEFT BANNER */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-3 px-3 py-2 rounded-xl shadow-lg"
           style={{ backgroundColor: darkMode ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.85)" }}>
        <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg">
          M
        </div>
        <div>
          <h1 className="text-lg font-bold text-green-600">MboaMed</h1>
          <p className="text-xs text-gray-600">HealthTech Pioneers</p>
        </div>
      </div>

      {/* TOP RIGHT CONTROLS */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">

        {/* Accessibility */}
        <button
          onClick={() => navigate("/")}
          className={`p-2 rounded-full shadow font-bold ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
        >
          ♿
        </button>

        {/* Language */}
        <button
          onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
          className={`px-3 py-1 rounded-full text-sm font-semibold shadow ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
        >
          {language === "fr" ? "EN" : "FR"}
        </button>

        {/* Dark Mode */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full shadow ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
        >
          {darkMode ? "🌞" : "🌙"}
        </button>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(true)}
          className={`p-2 rounded-full shadow ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* SLIDE-OUT MENU (old Navigation component) */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-[60]" onClick={() => setMenuOpen(false)}>
          <div
            className={`absolute right-0 top-0 h-full w-64 p-6 shadow-xl ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Menu</h2>

            <button onClick={() => navigate("/profile")} className="block w-full text-left py-2">
              {language === "fr" ? "Profil" : "Profile"}
            </button>

            <button onClick={() => navigate("/about")} className="block w-full text-left py-2">
              {language === "fr" ? "À propos" : "About"}
            </button>

            <button onClick={() => navigate("/pharmacy")} className="block w-full text-left py-2">
              {language === "fr" ? "Pharmacies" : "Pharmacies"}
            </button>

            <button onClick={() => setMenuOpen(false)} className="mt-6 text-red-500">
              {language === "fr" ? "Fermer" : "Close"}
            </button>
          </div>
        </div>
      )}

      {/* PAGE CONTENT */}
      <div className="pt-20 pb-20">
        <Outlet />
      </div>

      {/* BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 border-t border-gray-200 dark:border-gray-700 py-2 flex justify-around">

        <button onClick={() => navigate("/")} className="flex flex-col items-center text-xs">
          <Home size={18} className="text-green-600" />
          <span>{language === "fr" ? "Accueil" : "Home"}</span>
        </button>

        <button onClick={() => navigate("/doctors")} className="flex flex-col items-center text-xs">
          <UserCheck size={18} />
          <span>{language === "fr" ? "Médecins" : "Doctors"}</span>
        </button>

        <button onClick={() => navigate("/appointments")} className="flex flex-col items-center text-xs">
          <Calendar size={18} />
          <span>{language === "fr" ? "Rendez-vous" : "Appts"}</span>
        </button>

        <button onClick={() => navigate("/emergency")} className="flex flex-col items-center text-xs">
          <AlertTriangle size={18} className="text-red-500" />
          <span>{language === "fr" ? "Urgence" : "Emergency"}</span>
        </button>

        <button onClick={() => navigate("/book")} className="flex flex-col items-center text-xs">
          <CreditCard size={18} />
          <span>{language === "fr" ? "Réserver" : "Book"}</span>
        </button>

      </div>
    </div>
  );
};

export default MainLayout;
