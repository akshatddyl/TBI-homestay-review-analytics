export default function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div
          className="inline-block w-10 h-10 border-4 border-line border-t-accent animate-spin"
          role="status"
          aria-label="Loading"
        />
        <p className="label mt-4">Loading…</p>
      </div>
    </div>
  );
}
