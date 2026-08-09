import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLoader from "./PageLoader";

/**
 * Wraps a route that requires authentication.
 * - Shows loader while auth state is being checked.
 * - Redirects to /login if no user.
 * - Renders children if authenticated.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
