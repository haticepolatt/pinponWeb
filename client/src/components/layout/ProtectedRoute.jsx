import { Navigate } from "react-router-dom";
import { useAuth } from "../../app/AuthContext";
import { LoadingBlock } from "../ui/LoadingBlock";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingBlock text="Oturum kontrol ediliyor..." />;
  if (!user) return <Navigate to="/giris" replace />;
  return children;
};
