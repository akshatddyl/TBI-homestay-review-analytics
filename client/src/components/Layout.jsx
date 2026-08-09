import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const { user, loading } = useAuth();

  // Build nav links based on auth state
  const navLinks = user
    ? [
        { to: "/", label: "Home" },
        { to: "/dashboard", label: "Dashboard" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/login", label: "Login" },
      ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className="border-b-2 border-line bg-surface">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl tracking-tight text-ink no-underline">
            PERLOGO
          </Link>

          <div className="flex items-center gap-3">
            {!loading && (
              <nav className="hidden sm:flex items-center gap-1">
                {navLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`font-mono text-xs uppercase tracking-widest px-3 py-2 border-2 no-underline transition-all duration-150 ${
                      pathname === to
                        ? "border-line bg-accent text-black shadow-brutal-sm"
                        : "border-transparent text-ink hover:border-line"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Main ──────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-10 w-full">
        {children}
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="border-t-2 border-line bg-surface">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono text-xs text-ink/50 uppercase tracking-widest">
            Perlogo · Trishul Eco-Homestays
          </p>
          <p className="font-mono text-xs text-ink/40">
            Built for better hospitality
          </p>
        </div>
      </footer>
    </div>
  );
}
