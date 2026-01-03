import React, { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { darkMode, t, language } = useApp();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
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
        onClick={() => navigate("/login")}
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
          {t("register")}
        </h1>

        {/* Full Name */}
        <input
          type="text"
          placeholder={language === "fr" ? "Nom complet" : "Full Name"}
          className={`w-full p-3 mb-3 border rounded-lg ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "border-gray-300"
          }`}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        {/* Phone */}
        <input
          type="tel"
          placeholder={language === "fr" ? "Numéro de téléphone" : "Phone Number"}
          className={`w-full p-3 mb-3 border rounded-lg ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "border-gray-300"
          }`}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

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

        {/* Register Button */}
        <button
          onClick={() => console.log("TODO: Firebase register")}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition"
        >
          <UserPlus size={20} />
          {t("register")}
        </button>

        {/* Already have account */}
        <p
          className={`text-center mt-4 text-sm ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {language === "fr"
            ? "Déjà un compte?"
            : "Already have an account?"}{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-green-600 font-semibold"
          >
            {t("login")}
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
