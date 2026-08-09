import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check session on mount
  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        const data = await apiFetch("/auth/me");
        if (!cancelled) {
          setUser(data.user || null);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          if (err.status === 401) {
            // Not logged in — that's fine
            setUser(null);
            setError(null);
          } else {
            // Network error or backend unreachable
            setUser(null);
            setError("Unable to reach the server. Please try again later.");
            console.error("[AUTH]", err.message);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    checkAuth();
    return () => { cancelled = true; };
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // Even if the call fails, clear local state
    }
    setUser(null);
    navigate("/login");
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, loading, error, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
