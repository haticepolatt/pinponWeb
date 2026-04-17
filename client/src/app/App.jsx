import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { ToastProvider } from "./ToastContext";
import { HomePage } from "../pages/HomePage";
import { AboutPage } from "../pages/AboutPage";
import { TrainersPage } from "../pages/TrainersPage";
import { PackagesPage } from "../pages/PackagesPage";
import { BookingPage } from "../pages/BookingPage";
import { ContactPage } from "../pages/ContactPage";
import { AuthPage } from "../pages/AuthPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { RouteTransition } from "../components/layout/RouteTransition";

export const App = () => (
  <ToastProvider>
    <AuthProvider>
      <RouteTransition>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hakkimizda" element={<AboutPage />} />
          <Route path="/antrenorler" element={<TrainersPage />} />
          <Route path="/paketler" element={<PackagesPage />} />
          <Route path="/rezervasyon" element={<BookingPage />} />
          <Route path="/iletisim" element={<ContactPage />} />
          <Route path="/giris" element={<AuthPage />} />
          <Route
            path="/panel"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </RouteTransition>
    </AuthProvider>
  </ToastProvider>
);
