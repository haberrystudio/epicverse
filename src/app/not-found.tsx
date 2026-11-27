import Link from "next/link";
export default function NotFound() {
  return (
    <main className="empty">
      <h1>Folio not found</h1>
      <p>This character is outside the current register.</p>
      <Link className="primary" href="/">
        Return to the archive
      </Link>
    </main>
  );
}
