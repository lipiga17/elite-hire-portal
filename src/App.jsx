import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PositionsProvider } from "./contexts/PositionsContext";
import { CandidatesProvider } from "./contexts/CandidatesContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Positions from "./pages/Positions";
import PositionForm from "./pages/PositionForm";
import Candidates from "./pages/Candidates";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <PositionsProvider>
            <CandidatesProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />
                <Route path="/positions" element={
                  <ProtectedRoute><Positions /></ProtectedRoute>
                } />
                <Route path="/positions/new" element={
                  <ProtectedRoute><PositionForm /></ProtectedRoute>
                } />
                <Route path="/positions/edit/:id" element={
                  <ProtectedRoute><PositionForm /></ProtectedRoute>
                } />
                <Route path="/candidates" element={
                  <ProtectedRoute><Candidates /></ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute><Profile /></ProtectedRoute>
                } />
                
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </CandidatesProvider>
          </PositionsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
