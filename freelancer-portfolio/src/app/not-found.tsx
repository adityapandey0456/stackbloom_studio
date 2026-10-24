import Link from "next/link";
export default function NotFound() {
  return (
    <main style={{ padding: "80px 24px", textAlign: "center" }}>
      <h1 style={{ fontSize: 36 }}>Page not found</h1>
      <Link href="/">Back to home</Link>
    </main>
  );
}