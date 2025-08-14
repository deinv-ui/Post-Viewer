import { Navigate } from "react-router-dom";
import useAuthStore from "@/stores/authStore";

export default function ProtectedRoute({ children }) {
  const { token } = useAuthStore(); 

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}
