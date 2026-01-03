
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
              <Route path="/" element={<WelcomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/doctors" element={<DoctorsPage />} />
              <Route path="/book" element={<BookPage />} />
              <Route path="/hospitals" element={<HospitalsPage />} />
              <Route path="/payment" element={<PaymentPage />} />
            </Routes>
          </BrowserRouter>
          <Analytics />
        </AppProvider>   
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
