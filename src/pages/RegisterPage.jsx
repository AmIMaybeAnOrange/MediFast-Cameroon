import React, { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // your firebase config

const RegisterPage = () => {
  const { darkMode, t, language, setUser } = useApp();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {

    setError("");
    
    if (!fullName || !email || !password || !confirmPassword) {
  setError("Please fill in all fields");
  return;
}
    if (!/^\+?\d{7,15}$/.test(phone)) {
  setError("Please enter a valid phone number");
  return;
}

    setLoading(true);
    
  try {
          if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      
      if (passwordStrength === "weak" || passwordStrength === "medium") {
        setError("Password must include letters and numbers");
        return;
      }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    setUser({
      id: user.uid,
      fullName,
      email: user.email,
      phone,
    });

    navigate("/about");
  } catch (error) {
    setError(error.message);
  }
    finally { setLoading(false); }
};


  const checkPasswordStrength = (value: string) => {
  if (value.length < 6) return "weak";
  if (!/\d/.test(value)) return "medium";
  if (!/[!@#$%^&*]/.test(value)) return "strong";
  return "very-strong";
};

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
       <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className={`w-full p-3 pr-10 border rounded-lg ${
              darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"
            }`}
            value={password}
            onChange={(e) => {
              const value = e.target.value;
              setPassword(value);
              setPasswordStrength(checkPasswordStrength(value));
            }}
          />
        
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      

        {/*password strength*/}
        {password && (
          <p className={`text-sm mb-2 ${
            passwordStrength === "weak" ? "text-red-500" :
            passwordStrength === "medium" ? "text-yellow-500" :
            "text-green-500"
          }`}>
            {passwordStrength === "weak" && "Weak password"}
            {passwordStrength === "medium" && "Medium strength"}
            {passwordStrength === "strong" && "Strong password"}
            {passwordStrength === "very-strong" && "Very strong password"}
          </p>
        )}

        {/*Check password*/}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            className={`w-full p-3 pr-10 border rounded-lg ${
            darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"
            }`}

            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/*Show error*/}
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        
        {/* Register Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className={`w-full bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-700"
          }`}
        >
          <UserPlus size={20} />
        
          {loading ? "Registering..." : t("register")}
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
