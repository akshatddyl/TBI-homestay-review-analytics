import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";

export default function Dashboard() {
  const { user, logout } = useAuth();
  
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setError(null);
    setResults([]);

    const reviews = inputText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (reviews.length === 0) {
      setError("Please enter at least one review.");
      return;
    }

    if (reviews.length > 20) {
      setError(`Maximum 20 reviews allowed. You entered ${reviews.length}.`);
      return;
    }

    setLoading(true);

    try {
      const response = await apiFetch("/analyze", {
        method: "POST",
        body: JSON.stringify({ reviews }),
      });
      setResults(response.results || []);
    } catch (err) {
      if (err.status === 401) {
        // useAuth handles 401 in some ways, but if it happens here we just log out or show error
        setError("Your session has expired. Please log in again.");
        setTimeout(() => logout(), 2000);
      } else {
        setError(err.message || "Failed to analyze reviews.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputText("");
    setResults([]);
    setError(null);
  };

  const lineCount = inputText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0).length;

  return (
    <div>
      {/* ── Dashboard header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {user?.avatar && (
            <img
              src={user.avatar}
              alt={user.displayName || "User avatar"}
              className="w-12 h-12 border-2 border-line"
              referrerPolicy="no-referrer"
            />
          )}
          <div>
            <h1 className="font-display text-3xl uppercase leading-none">
              Dashboard
            </h1>
            {user?.displayName && (
              <p className="label mt-1 mb-0">{user.displayName}</p>
            )}
          </div>
        </div>

        <button onClick={logout} className="btn" disabled={loading}>
          Logout
        </button>
      </div>

      {/* ── Input Section ─────────────────────────────────────────────── */}
      <div className="card mb-8">
        <label htmlFor="reviews-input" className="label text-base mb-2">
          Paste Guest Reviews
        </label>
        <p className="text-sm text-ink/70 mb-4">
          One review per line. Maximum 20 reviews.
        </p>
        
        <textarea
          id="reviews-input"
          className="input min-h-[150px] resize-y mb-4"
          placeholder="e.g. The room was clean and the host was very friendly."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={loading}
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-ink/70 tracking-widest">
            {lineCount} {lineCount === 1 ? "review" : "reviews"} detected
          </p>
          <div className="flex gap-4 w-full sm:w-auto">
            <button
              className="btn w-full sm:w-auto"
              onClick={handleClear}
              disabled={loading || (!inputText && results.length === 0 && !error)}
            >
              Clear
            </button>
            <button
              className="btn-primary w-full sm:w-auto"
              onClick={handleAnalyze}
              disabled={loading || lineCount === 0}
            >
              {loading ? "Analyzing..." : "Analyze Reviews"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Status / Error ────────────────────────────────────────────── */}
      <div aria-live="polite" className="mb-8">
        {loading && (
          <div className="card text-center !py-8">
            <div
              className="inline-block w-8 h-8 border-4 border-line border-t-accent animate-spin mb-4"
              role="status"
              aria-label="Analyzing"
            />
            <p className="font-display uppercase text-lg">Analyzing your reviews...</p>
            <p className="text-sm text-ink/70">This might take a few seconds.</p>
          </div>
        )}

        {error && !loading && (
          <div className="card !border-negative !shadow-none">
            <p className="label !text-negative mb-0">Error</p>
            <p className="text-sm text-ink/70 mt-1">{error}</p>
          </div>
        )}
      </div>

      {/* ── Results Section ───────────────────────────────────────────── */}
      {!loading && !error && results.length > 0 && (
        <div className="card overflow-hidden !p-0">
          <div className="p-4 border-b-2 border-line bg-surface flex justify-between items-center">
            <h2 className="label text-base mb-0">Analysis Results</h2>
            <span className="badge">{results.length} processed</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table-shell min-w-[800px]">
              <thead>
                <tr>
                  <th className="w-1/3">Review</th>
                  <th className="w-1/6">Sentiment</th>
                  <th className="w-1/6">Theme</th>
                  <th className="w-1/3">Suggested Response</th>
                </tr>
              </thead>
              <tbody>
                {results.map((res, index) => (
                  <tr key={index}>
                    <td className="align-top font-medium">{res.review}</td>
                    <td className="align-top">
                      <span className={`badge badge-${res.sentiment}`}>
                        {res.sentiment}
                      </span>
                    </td>
                    <td className="align-top">
                      <span className="badge bg-surface">{res.theme}</span>
                    </td>
                    <td className="align-top text-ink/80 italic">
                      {res.response}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Empty State ───────────────────────────────────────────────── */}
      {!loading && !error && results.length === 0 && (
        <div className="card text-center !py-12 border-dashed">
          <p className="text-4xl mb-4">💬</p>
          <p className="font-mono uppercase text-sm tracking-widest text-ink/50">
            Awaiting input
          </p>
        </div>
      )}
    </div>
  );
}
