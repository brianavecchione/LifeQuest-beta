import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { QuestProvider } from "./contexts/QuestContext";
import { GuestProvider } from "./contexts/GuestContext";
import { BackgroundProvider } from "./contexts/BackgroundContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import BackgroundImage from "./components/BackgroundImage";
import YouTubePlayer from "./components/YouTubePlayer";
import Home from "./pages/Home";
import Quests from "./pages/Quests";
import Achievements from "./pages/Achievements";
import Inventory from "./pages/Inventory";
import GoldShop from "./pages/GoldShop";
import Parties from "./pages/Parties";
import Settings from "./pages/Settings";
import Customization from "./pages/Customization";
import Challenges from "./pages/Challenges";
import Help from "./pages/Help";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GuestProvider>
        <UserProvider>
          <QuestProvider>
            <BackgroundProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <div className="min-h-screen flex flex-col relative">
                    <BackgroundImage />
                    <Navigation />
                    <main className="flex-1 relative">{/* Removed default padding, now controlled by body classes */}
                      <Routes>
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                        <Route path="/quests" element={<ProtectedRoute><Quests /></ProtectedRoute>} />
                        <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
                        <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
                        <Route path="/gold-shop" element={<ProtectedRoute><GoldShop /></ProtectedRoute>} />
                        <Route path="/parties" element={<ProtectedRoute><Parties /></ProtectedRoute>} />
                        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                        <Route path="/customization" element={<ProtectedRoute><Customization /></ProtectedRoute>} />
                        <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
                        <Route path="/help" element={<Help />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-conditions" element={<TermsConditions />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                      <YouTubePlayer />
                    </main>
                    <Footer />
                  </div>
                </BrowserRouter>
              </TooltipProvider>
            </BackgroundProvider>
          </QuestProvider>
        </UserProvider>
      </GuestProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
