// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth pages */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

        {/* Protected dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Router>
  );
}
