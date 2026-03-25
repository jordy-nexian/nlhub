import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { getDashboardData } from "@/lib/portal-data";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  const { sessions } = await getDashboardData();

  return (
    <AdminShell current="/admin/sessions" subtitle="Manage training availability, assignments, and portal tokens." title="Sessions">
      <div style={{ marginBottom: 16 }}>
        <Link href="/admin/sessions/new">Create session</Link>
      </div>
      <section style={{ display: "grid", gap: 14 }}>
        {sessions.map((session) => (
          <article key={session.id} style={{ padding: 22, background: "white", border: "1px solid var(--border)", borderRadius: 22, boxShadow: "var(--shadow)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
              <div>
                <h2>{session.title}</h2>
                <p style={{ color: "var(--muted)" }}>
                  {formatDateTime(session.startsAt)} • {session.trainerName} • {session.status}
                </p>
              </div>
              <Link href={`/admin/sessions/${session.id}`}>Open</Link>
            </div>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
