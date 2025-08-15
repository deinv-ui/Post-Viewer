// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import useAuthStore, { isTokenValid } from "@/stores/authStore";

export default function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token);

  if (!token || !isTokenValid(token)) {
    return <Navigate to="/auth/login" replace />;
  }

  // Token valid → render protected component
  return children;
}
