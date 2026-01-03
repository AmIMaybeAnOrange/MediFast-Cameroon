import React, { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { ArrowLeft, LogIn } from "lucide-react";

const LoginPage = () => {
  const { darkMode, t, setCurrentPage, language } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div
      className={`min-h-screen flex flex-col justify-center px-6 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 flex items-center gap-1 text-green-600"
      >
        <ArrowLeft size={20} />
        <span>{language === "fr" ? "Retour" : "Back"}</span>
      </button>

      {/* Card */}
      <div
        className={`max-w-md w-full mx-auto p-6 rounded-2xl shadow-xl ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h1
          className={`text-2xl font-bold mb-6 text-center ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {t("login")}
        </h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className={`w-full p-3 mb-3 border rounded-lg ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "border-gray-300"
          }`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder={language === "fr" ? "Mot de passe" : "Password"}
          className={`w-full p-3 mb-4 border rounded-lg ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "border-gray-300"
          }`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Login Button */}
        <button
          onClick={() => console.log("TODO: Firebase login")}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition"
        >
          <LogIn size={20} />
          {t("login")}
        </button>

        {/* Register Link */}
        <p
          className={`text-center mt-4 text-sm ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {language === "fr"
            ? "Pas de compte?"
            : "Don't have an account?"}{" "}
          <button
            onClick={() => setCurrentPage("register")}
            className="text-green-600 font-semibold"
          >
            {t("register")}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
