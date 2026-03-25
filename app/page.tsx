import Link from "next/link";
import { ensureAppData } from "@/lib/bootstrap";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureAppData();

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "56px 24px" }}>
      <div style={{ padding: 28, background: "white", border: "1px solid var(--border)", borderRadius: 28, boxShadow: "var(--shadow)" }}>
        <p style={{ textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", fontWeight: 800 }}>Nexian Training Portal</p>
        <h1>Actionstep training operations</h1>
        <p style={{ color: "var(--muted)", maxWidth: 620 }}>
          This workspace matches the previous deployed structure with secure trainer sign-in, admin operations, token-based
          booking pages, and customer portals.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
          <Link href="/auth/signin">Trainer sign in</Link>
          <Link href="/book/open-april-slot">Example booking link</Link>
          <Link href="/portal/portal-brightwell-core">Example customer portal</Link>
        </div>
      </div>
    </main>
  );
}
