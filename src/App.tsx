import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminBootstrap from "./pages/AdminBootstrap";
import AdminSetup from "./pages/AdminSetup";
import Install from "./pages/Install";
import NotFound from "./pages/NotFound";
import CareerComparison from "./pages/CareerComparison";
import StreamRecommender from "./pages/StreamRecommender";
import LearningResources from "./pages/LearningResources";
import AfterTwelfth from "./pages/AfterTwelfth";
import PracticeQuiz from "./pages/PracticeQuiz";
import DeepAnalysis from "./pages/DeepAnalysis";
import ChatBot from "./components/ChatBot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/results/:stream" element={<Results />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin-setup" element={<AdminSetup />} />
            <Route path="/admin/bootstrap" element={<AdminBootstrap />} />
            <Route path="/team" element={<AdminBootstrap />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/install" element={<Install />} />
            <Route path="/career-comparison" element={<CareerComparison />} />
            <Route path="/stream-recommender" element={<StreamRecommender />} />
            <Route path="/learning" element={<LearningResources />} />
            <Route path="/after-12th" element={<AfterTwelfth />} />
            <Route path="/practice-quiz" element={<PracticeQuiz />} />
            <Route path="/deep-analysis" element={<DeepAnalysis />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatBot />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
