import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiURL, API_URL } from "../lib/api";
import PageLoader from "../components/PageLoader";

export default function Register() {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/dashboard" replace />;

  const googleAuthURL = apiURL("/auth/google");

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="card max-w-md w-full text-center">
        <h1 className="font-display text-2xl uppercase mb-6">Register</h1>

        <p className="text-ink/70 mb-8 leading-relaxed">
          Registration is handled through <strong>Google&nbsp;OAuth</strong>.
          <br />
          Click below to sign in with your Google account.
        </p>

        {API_URL ? (
          <a href={googleAuthURL} className="btn-primary no-underline w-full">
            Continue with Google
          </a>
        ) : (
          <div className="card !border-negative !shadow-none">
            <p className="label !text-negative mb-0">Configuration Error</p>
            <p className="text-sm text-ink/70 mt-1">
              VITE_API_URL is not set. Check your .env file.
            </p>
          </div>
        )}

        <p className="label mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-accent underline underline-offset-2">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
