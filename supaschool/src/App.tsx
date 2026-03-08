
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Schools from "./pages/Schools";
import NotFound from "./pages/NotFound";
import Teachers from "./pages/Teachers";
import Students from "./pages/Students";
import Hodari from "./pages/Hodari";
import Attendance from "./pages/Attendance";
import Meals from "./pages/Meals";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Classes from "./pages/Classes";
import Curriculum from "./pages/Curriculum";
import Exams from "./pages/Exams";
import Timetable from "./pages/Timetable";
import Facilities from "./pages/Facilities";
import Finance from "./pages/Finance";
import Transport from "./pages/Transport";
import Messages from "./pages/Messages";
import FlamiAssistantPage from "./pages/flami/FlamiAssistant";
import FlamiKnowledgePage from "./pages/flami/FlamiKnowledge";
import FlamiCurriculumPage from "./pages/flami/FlamiCurriculum";
import FlamiModelsPage from "./pages/flami/FlamiModels";
import FlamiSearchPage from "./pages/flami/FlamiSearch";
import Settings from "./pages/Settings";

// Create empty placeholder pages for the routes in the sidebar
const Support = () => <h1 className="text-2xl font-bold p-6">Support Page</h1>;

// App pages
const Somanasi = () => <h1 className="text-2xl font-bold p-6">Somanasi App</h1>;
const Zazi = () => <h1 className="text-2xl font-bold p-6">Zazi (Parents) App</h1>;

const queryClient = new QueryClient();

console.log("App component is rendering");

const App = () => {
  console.log("Inside App component");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/schools" element={<Schools />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/students" element={<Students />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/transport" element={<Transport />} />
            <Route path="/meals" element={<Meals />} />
            <Route path="/messages" element={<Messages />} />
            
            {/* Flami AI routes */}
            <Route path="/flami" element={<FlamiAssistantPage />} />
            <Route path="/flami/knowledge" element={<FlamiKnowledgePage />} />
            <Route path="/flami/curriculum" element={<FlamiCurriculumPage />} />
            <Route path="/flami/models" element={<FlamiModelsPage />} />
            <Route path="/flami/search" element={<FlamiSearchPage />} />
            
            {/* App routes */}
            <Route path="/hodari" element={<Hodari />} />
            <Route path="/somanasi" element={<Somanasi />} />
            <Route path="/zazi" element={<Zazi />} />
            
            <Route path="/settings" element={<Settings />} />
            <Route path="/support" element={<Support />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

console.log("App export reached");
export default App;
