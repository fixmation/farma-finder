
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AdminAuth from "./pages/AdminAuth";
import LabBooking from "./pages/LabBooking";
import PDPA from "./pages/PDPA";
import TermsOfService from "./pages/TermsOfService";
import HowToUse from "./pages/HowToUse";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin-auth" element={<AdminAuth />} />
            <Route path="/lab-booking" element={<LabBooking />} />
            <Route path="/pdpa" element={<PDPA />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/how-to-use" element={<HowToUse />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
