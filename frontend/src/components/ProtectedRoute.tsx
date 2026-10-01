import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { User } = useAuth();
  return User ? <Outlet /> : <Navigate to="/masuk" replace />;
}
