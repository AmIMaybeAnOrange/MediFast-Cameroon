import React from 'react';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, Shield, Clock, MapPin, Heart, Stethoscope, 
  UserCheck, Calendar, CreditCard, Menu, Home, AlertTriangle 
} from 'lucide-react';

const WelcomePage: React.FC = () => {
  const { darkMode, t, language, setLanguage, setDarkMode } = useApp();
  const navigate = useNavigate();

  const features = [
    { icon: Clock, title: language === 'fr' ? 'Gagnez du Temps' : 'Save Time', desc: language === 'fr' ? 'Plus de longues files' : 'No more long queues' },
    { icon: MapPin, title: language === 'fr' ? 'Trouvez des Soins' : 'Find Care', desc: language === 'fr' ? 'Hôpitaux proches' : 'Nearest hospitals' },
    { icon: Shield, title: language === 'fr' ? 'Urgence' : 'Emergency', desc: language === 'fr' ? 'Accès prioritaire' : 'Priority access' },
  ];

  const quickActions = [
    { icon: UserCheck, label: language === 'fr' ? 'Nos Médecins' : 'Our Doctors', page: '/doctors', color: 'bg-blue-100 text-blue-600' },
    { icon: Calendar, label: language === 'fr' ? 'Rendez-vous' : 'Book Now', page: '/book', color: 'bg-green-100 text-green-600' },
    { icon: MapPin, label: language === 'fr' ? 'Hôpitaux' : 'Hospitals', page: '/hospitals', color: 'bg-purple-100 text-purple-600' },
    { icon: CreditCard, label: language === 'fr' ? 'Paiement' : 'Payment', page: '/payment', color: 'bg-orange-100 text-orange-600' },
  ];

  const stats = [
    { value: '50+', label: language === 'fr' ? 'Hôpitaux' : 'Hospitals' },
    { value: '200+', label: language === 'fr' ? 'Médecins' : 'Doctors' },
    { value: '10K+', label: language === 'fr' ? 'Patients' : 'Patients' },
  ];

  const pricing = [
    { service: language === 'fr' ? 'Consultation générale' : 'General consultation', price: '600 FCFA' },
    { service: language === 'fr' ? 'Spécialiste' : 'Specialist', price: '2 000 FCFA' },
    { service: 'ExpressCare', price: '5 000 FCFA' },
    { service: language === 'fr' ? 'Visite domicile' : 'Home visit', price: '10 000 FCFA' },
  ];

  return (
    <div className={`min-h-screen relative ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-green-50 to-white'}`}>

      {/* TOP LEFT BANNER */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg">
          M
        </div>
        <div>
          <h1 className="text-lg font-bold text-green-600">MboaMed</h1>
          <p className="text-xs text-gray-500">HealthTech Pioneers</p>
        </div>
      </div>

      {/* TOP RIGHT CONTROLS */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">

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

        {/* Hamburger Menu */}
        <button
          onClick={() => navigate("/menu")}
          className={`p-2 rounded-full shadow ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* HERO SECTION */}
      <div className="relative h-[50vh] overflow-hidden">
        <img 
          src="https://d64gsuwffb70l.cloudfront.net/692db78c383879166ccc73e9_1764608413301_99c6de1b.webp" 
          alt="Hospital" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="p-4 -mt-6 relative z-10">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {stats.map((s, i) => (
            <div key={i} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-3 text-center shadow-lg`}>
              <p className="text-xl font-bold text-green-600">{s.value}</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-4 mb-4`}>
          <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {language === 'fr' ? 'Accès Rapide' : 'Quick Access'}
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.page)}
                className="flex flex-col items-center gap-1"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}>
                  <action.icon size={22} />
                </div>
                <span className={`text-[10px] font-medium text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Features + Login Button */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-5`}>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {features.map((f, i) => (
              <div key={i} className="text-center">
                <div className="w-11 h-11 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <f.icon className="text-green-600" size={22} />
                </div>
                <p className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{f.title}</p>
                <p className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{f.desc}</p>
              </div>
            ))}
          </div>

          <button 
            onClick={() => navigate("/login")}
            className="w-full bg-green-600 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition"
          >
            {t('login')} / {t('register')} <ArrowRight size={18} />
          </button>
        </div>

        {/* Pricing */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-4 mt-4`}>
          <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {language === 'fr' ? 'Tarifs Abordables' : 'Affordable Pricing'}
          </h3>
          <div className="space-y-2">
            {pricing.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.service}</span>
                <span className="text-green-600 font-semibold text-sm">{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Doctors Banner */}
        <button 
          onClick={() => navigate("/doctors")}
          className={`w-full mt-4 ${darkMode ? 'bg-gradient-to-r from-green-800 to-green-900' : 'bg-gradient-to-r from-green-600 to-green-700'} rounded-2xl p-4 text-white shadow-xl`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Stethoscope size={24} />
              </div>
              <div className="text-left">
                <p className="font-semibold">Hôpital Jamot Yaoundé</p>
                <p className="text-xs opacity-80">
                  {language === 'fr' ? 'Voir nos médecins spécialistes' : 'View our specialist doctors'}
                </p>
              </div>
            </div>
            <ArrowRight size={20} />
          </div>
        </button>
      </div>

      {/* BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 border-t border-gray-200 dark:border-gray-700 py-2 flex justify-around">
        
        <button onClick={() => navigate('/')} className="flex flex-col items-center text-xs">
          <Home size={18} className="text-green-600" />
          <span>{language === 'fr' ? 'Accueil' : 'Home'}</span>
        </button>

        <button onClick={() => navigate('/doctors')} className="flex flex-col items-center text-xs">
          <UserCheck size={18} />
          <span>{language === 'fr' ? 'Médecins' : 'Doctors'}</span>
        </button>

        <button onClick={() => navigate('/appointments')} className="flex flex-col items-center text-xs">
          <Calendar size={18} />
          <span>{language === 'fr' ? 'Rendez-vous' : 'Appts'}</span>
        </button>

        <button onClick={() => navigate('/emergency')} className="flex flex-col items-center text-xs">
          <AlertTriangle size={18} className="text-red-500" />
          <span>{language === 'fr' ? 'Urgence' : 'Emergency'}</span>
        </button>

        <button onClick={() => navigate('/book')} className="flex flex-col items-center text-xs">
          <CreditCard size={18} />
          <span>{language === 'fr' ? 'Réserver' : 'Book'}</span>
        </button>

      </div>

    </div>
  );
};

export default WelcomePage;
