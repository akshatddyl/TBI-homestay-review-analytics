const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error(
    "[Perlogo] VITE_API_URL is not set. Create client/.env with:\n  VITE_API_URL=http://localhost:5000"
  );
}

/**
 * Wrapper around fetch that targets the backend API.
 *
 * - Prepends VITE_API_URL to every path.
 * - Always sends credentials (cookies).
 * - Sets Content-Type to JSON for requests with a body.
 * - Returns parsed JSON when possible.
 *
 * @param {string} path  – API path, e.g. "/auth/me"
 * @param {RequestInit} [options] – fetch options
 * @returns {Promise<any>} parsed response
 */
export async function apiFetch(path, options = {}) {
  if (!API_URL) {
    throw new Error("VITE_API_URL is not configured. Check your .env file.");
  }

  const headers = { ...options.headers };

  // Auto-set JSON content type when sending a body (unless already set)
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  // Try to parse JSON; fall back to null for empty responses
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : null;

  if (!res.ok) {
    const message = data?.message || data?.error || res.statusText || "Request failed";
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

/**
 * Returns the full backend URL for browser redirects (e.g. OAuth).
 * @param {string} path
 * @returns {string}
 */
export function apiURL(path) {
  if (!API_URL) return "";
  return `${API_URL}${path}`;
}

export { API_URL };
