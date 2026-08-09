import { Navigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiURL, API_URL } from "../lib/api";
import PageLoader from "../components/PageLoader";

export default function Login() {
  const { user, loading, error: authError } = useAuth();
  const [searchParams] = useSearchParams();
  const oauthError = searchParams.get("error");

  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/dashboard" replace />;

  const googleAuthURL = apiURL("/auth/google");

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="card max-w-md w-full text-center">
        <h1 className="font-display text-2xl uppercase mb-6">Login</h1>

        {/* OAuth failure banner */}
        {oauthError && (
          <div className="card !border-negative !shadow-none !p-4 mb-6">
            <p className="label !text-negative mb-0">Login Failed</p>
            <p className="text-sm text-ink/70 mt-1">
              Google authentication failed. Please try again.
            </p>
          </div>
        )}

        {/* Backend unreachable banner */}
        {authError && (
          <div className="card !border-neutral !shadow-none !p-4 mb-6">
            <p className="label !text-neutral mb-0">Server Unreachable</p>
            <p className="text-sm text-ink/70 mt-1">{authError}</p>
          </div>
        )}

        <p className="text-ink/70 mb-8 leading-relaxed">
          Login to analyze guest reviews with AI-powered sentiment classification.
        </p>

        {API_URL ? (
          <a href={googleAuthURL} className="btn-primary no-underline w-full">
            Login with Google
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
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-accent underline underline-offset-2">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
