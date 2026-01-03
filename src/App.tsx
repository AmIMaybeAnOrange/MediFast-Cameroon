import MainLayout from "./layouts/MainLayout";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import LoginPage from "./pages/LoginPage";
import WelcomePage from "./pages/WelcomePage";
import RegisterPage from "./pages/RegisterPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AppProvider } from "./contexts/AppContext";
import DoctorsPage from "./pages/DoctorsPage";
import BookPage from "./components/BookAppointment";
import HospitalsPage from "./components/HospitalLocator";
import PaymentPage from "./components/PaymentPage";
import AppointmentsList from "./components/AppointmentsList";
import EmergencyPage from "./components/EmergencyPage";
import ProfilePage from "./components/ProfilePage";
import AboutPage from "./components/AboutPage";
import PharmacyPage from "./components/PharmacyPage";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>  
          <Toaster />
          <Sonner />
         <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/welcome" element={<WelcomePage />} />
          
              {/* Layout-wrapped routes */}
              <Route path="/doctors" element={<MainLayout><DoctorsPage /></MainLayout>} />
              <Route path="/book" element={<MainLayout><BookPage /></MainLayout>} />
              <Route path="/appointments" element={<MainLayout><AppointmentsList /></MainLayout>} />
              <Route path="/emergency" element={<MainLayout><EmergencyPage /></MainLayout>} />
              <Route path="/payment" element={<MainLayout><PaymentPage /></MainLayout>} />
              <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
              <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
              <Route path="/pharmacy" element={<MainLayout><PharmacyPage /></MainLayout>} />
          
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Analytics />
        </AppProvider>   
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
