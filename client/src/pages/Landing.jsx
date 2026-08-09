import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  {
    title: "Sentiment",
    description: "Classify every review as positive, neutral, or negative instantly.",
    icon: "📊",
  },
  {
    title: "Theme Tagging",
    description: "Auto-tag reviews by topic — food, host, location, cleanliness, value, or experience.",
    icon: "🏷️",
  },
  {
    title: "Suggested Response",
    description: "Get a professional one-line management response ready to send.",
    icon: "💬",
  },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 text-center">
        <p className="label mb-4">Trishul Eco-Homestays</p>

        <h1 className="font-display text-5xl sm:text-7xl tracking-tight leading-none mb-6">
          PERLOGO
        </h1>

        <p className="max-w-xl mx-auto text-lg sm:text-xl text-ink/70 mb-10 leading-relaxed">
          Paste guest reviews and get instant sentiment classification, theme&nbsp;tags,
          and suggested management responses — powered by AI.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Link to="/dashboard" className="btn-primary no-underline">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-primary no-underline">
                Login
              </Link>
              <Link to="/register" className="btn no-underline">
                Register
              </Link>
            </>
          )}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section className="py-12">
        <h2 className="label text-center mb-10 text-base">What You Get</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {FEATURES.map(({ title, description, icon }) => (
            <div key={title} className="card flex flex-col items-start gap-4">
              <span className="text-3xl" role="img" aria-label={title}>
                {icon}
              </span>
              <h3 className="font-display text-lg uppercase">{title}</h3>
              <p className="text-sm text-ink/70 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
