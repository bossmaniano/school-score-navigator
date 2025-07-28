import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LoginPage from "@/components/auth/LoginPage";
import AdminLoginPage from "@/components/auth/AdminLoginPage";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['administrator', 'head_teacher']}>
                  <DashboardLayout>
                    <AdminDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/school-setup"
              element={
                <ProtectedRoute allowedRoles={['administrator']}>
                  <DashboardLayout>
                    <div>School Setup Page - Coming Soon</div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/classes"
              element={
                <ProtectedRoute allowedRoles={['administrator', 'class_teacher', 'subject_teacher', 'head_teacher']}>
                  <DashboardLayout>
                    <div>Classes Page - Coming Soon</div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute allowedRoles={['administrator', 'class_teacher', 'head_teacher']}>
                  <DashboardLayout>
                    <div>Students Page - Coming Soon</div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessments"
              element={
                <ProtectedRoute allowedRoles={['administrator', 'class_teacher', 'subject_teacher', 'head_teacher']}>
                  <DashboardLayout>
                    <div>Assessments Page - Coming Soon</div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div>Reports Page - Coming Soon</div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-results"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <DashboardLayout>
                    <div>My Results Page - Coming Soon</div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-pathway"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <DashboardLayout>
                    <div>My Pathway Page - Coming Soon</div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
