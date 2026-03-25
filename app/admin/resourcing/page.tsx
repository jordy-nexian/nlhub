import { AdminShell } from "@/components/admin-shell";
import { getDashboardData } from "@/lib/portal-data";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ResourcingPage() {
  const { sessions, customers } = await getDashboardData();

  const upcoming = sessions.slice(0, 8);
  const unassigned = sessions.filter((session) => !session.customerId || session.status === "AVAILABLE");

  return (
    <AdminShell
      current="/admin/resourcing"
      subtitle="A shared view of trainer load, open capacity, and scheduled customer delivery."
      title="Resourcing Calendar"
    >
      <section style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
        {[
          ["Scheduled delivery", String(sessions.length)],
          ["Open capacity", String(unassigned.length)],
          ["Active customer accounts", String(customers.length)]
        ].map(([label, value]) => (
          <article key={label} style={{ padding: 20, background: "white", border: "1px solid var(--border)", borderRadius: 20, boxShadow: "var(--shadow)" }}>
            <p style={{ color: "var(--muted)", marginBottom: 10 }}>{label}</p>
            <strong style={{ fontSize: "2rem" }}>{value}</strong>
          </article>
        ))}
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 18, marginTop: 18 }}>
        <article style={{ padding: 22, background: "white", border: "1px solid var(--border)", borderRadius: 24, boxShadow: "var(--shadow)" }}>
          <h2>Upcoming workload</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {upcoming.map((session) => (
              <div key={session.id} style={{ display: "grid", gridTemplateColumns: "160px 1fr 120px", gap: 12, padding: "14px 0", borderTop: "1px solid var(--border)" }}>
                <strong>{new Date(session.startsAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</strong>
                <div>
                  <div style={{ fontWeight: 800 }}>{session.title}</div>
                  <div style={{ color: "var(--muted)" }}>{session.customer?.companyName ?? "Open slot"} • {session.trainerName}</div>
                </div>
                <div style={{ color: "var(--muted)", textAlign: "right" }}>{formatDateTime(session.startsAt).split(" at ").pop()}</div>
              </div>
            ))}
          </div>
        </article>

        <article style={{ padding: 22, background: "white", border: "1px solid var(--border)", borderRadius: 24, boxShadow: "var(--shadow)" }}>
          <h2>Planner notes</h2>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ padding: 16, borderRadius: 18, background: "var(--surface-2)" }}>
              <strong>Use this area for:</strong>
              <p style={{ color: "var(--muted)", marginBottom: 0 }}>Trainer availability, cover planning, leave clashes, and onboarding load balancing.</p>
            </div>
            <div style={{ padding: 16, borderRadius: 18, background: "var(--surface-2)" }}>
              <strong>Next step idea</strong>
              <p style={{ color: "var(--muted)", marginBottom: 0 }}>We can evolve this into a real month-view calendar with trainer lanes and drag-to-reassign sessions.</p>
            </div>
          </div>
        </article>
      </section>
    </AdminShell>
  );
}
