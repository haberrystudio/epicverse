"use client";
export default function PageError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="empty">
      <h1>The archive could not open</h1>
      <p>Please try loading this view again.</p>
      <button className="primary" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
