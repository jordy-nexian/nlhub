import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { getDashboardData } from "@/lib/portal-data";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { customers, sessions, settings } = await getDashboardData();

  const booked = sessions.filter((session) => session.status !== "AVAILABLE").length;
  const available = sessions.filter((session) => session.status === "AVAILABLE").length;
  const webhook = settings.find((setting) => setting.key === "booking_webhook_url")?.value;

  return (
    <AdminShell current="/admin" subtitle="Operational overview for trainers and coordinators." title="Dashboard">
      <section style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}>
        {[
          ["Customers", String(customers.length)],
          ["Sessions", String(sessions.length)],
          ["Booked", String(booked)],
          ["Available", String(available)]
        ].map(([label, value]) => (
          <article key={label} style={{ padding: 20, background: "white", border: "1px solid var(--border)", borderRadius: 20, boxShadow: "var(--shadow)" }}>
            <p style={{ color: "var(--muted)", marginBottom: 10 }}>{label}</p>
            <strong style={{ fontSize: "2rem" }}>{value}</strong>
          </article>
        ))}
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 18, marginTop: 18 }}>
        <article style={{ padding: 22, background: "white", border: "1px solid var(--border)", borderRadius: 24, boxShadow: "var(--shadow)" }}>
          <h2>Upcoming sessions</h2>
          {sessions.slice(0, 5).map((session) => (
            <div key={session.id} style={{ padding: "16px 0", borderTop: "1px solid var(--border)" }}>
              <strong>{session.title}</strong>
              <p style={{ color: "var(--muted)", marginBottom: 6 }}>{formatDateTime(session.startsAt)}</p>
              <p style={{ color: "var(--muted)", marginBottom: 0 }}>
                {session.customer?.companyName ?? "Open slot"} • {session.trainerName} • {session.status}
              </p>
            </div>
          ))}
        </article>

        <article style={{ padding: 22, background: "white", border: "1px solid var(--border)", borderRadius: 24, boxShadow: "var(--shadow)" }}>
          <h2>Quick links</h2>
          <div style={{ display: "grid", gap: 12 }}>
            <Link href="/admin/customers/new">Add new customer</Link>
            <Link href="/admin/sessions/new">Create new session</Link>
            <Link href="/admin/settings">Manage webhooks</Link>
          </div>
          <div style={{ marginTop: 18, padding: 16, borderRadius: 18, background: "var(--surface-2)" }}>
            <p style={{ color: "var(--muted)", marginBottom: 6 }}>Webhook status</p>
            <strong>{webhook ? "Configured" : "Not configured"}</strong>
          </div>
        </article>
      </section>
    </AdminShell>
  );
}
