import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { getDashboardData } from "@/lib/portal-data";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const { customers } = await getDashboardData();

  return (
    <AdminShell current="/admin/customers" subtitle="Customer records used for bookings, portals, and follow-up." title="Customers">
      <div style={{ marginBottom: 16 }}>
        <Link href="/admin/customers/new">Add customer</Link>
      </div>
      <section style={{ display: "grid", gap: 14 }}>
        {customers.map((customer) => (
          <article key={customer.id} style={{ padding: 22, background: "white", border: "1px solid var(--border)", borderRadius: 22, boxShadow: "var(--shadow)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
              <div>
                <h2>{customer.companyName}</h2>
                <p style={{ color: "var(--muted)" }}>
                  {customer.contactName} • {customer.email}
                </p>
              </div>
              <Link href={`/admin/customers/${customer.id}`}>Open</Link>
            </div>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
