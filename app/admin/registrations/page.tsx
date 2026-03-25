import { AdminShell } from "@/components/admin-shell";
import { getDashboardData } from "@/lib/portal-data";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function RegistrationsPage() {
  const { sessions } = await getDashboardData();
  const registrations = sessions.filter((session) => session.customerId);

  return (
    <AdminShell current="/admin/registrations" subtitle="Overview of booked training tied to customer records." title="Registrations">
      <section style={{ display: "grid", gap: 14 }}>
        {registrations.map((session) => (
          <article key={session.id} style={{ padding: 22, background: "white", border: "1px solid var(--border)", borderRadius: 22, boxShadow: "var(--shadow)" }}>
            <h2>{session.customer?.companyName}</h2>
            <p style={{ color: "var(--muted)" }}>
              {session.title} • {formatDateTime(session.startsAt)} • {session.status}
            </p>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
