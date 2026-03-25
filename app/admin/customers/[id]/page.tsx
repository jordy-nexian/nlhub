import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { prisma } from "@/lib/prisma";
import { ensureAppData } from "@/lib/bootstrap";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  await ensureAppData();
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: { sessions: true, bookingLinks: true }
  });

  if (!customer) {
    notFound();
  }

  return (
    <AdminShell current="/admin/customers" subtitle="Update customer details and see related sessions." title={customer.companyName}>
      <section style={{ display: "grid", gridTemplateColumns: "1fr 0.9fr", gap: 18 }}>
        <form
          action={async (formData) => {
            "use server";
            await prisma.customer.update({
              where: { id: params.id },
              data: {
                companyName: String(formData.get("companyName") || ""),
                contactName: String(formData.get("contactName") || ""),
                email: String(formData.get("email") || ""),
                phone: String(formData.get("phone") || "") || null,
                actionstepOrg: String(formData.get("actionstepOrg") || "") || null,
                notes: String(formData.get("notes") || "") || null,
                status: String(formData.get("status") || "ACTIVE")
              }
            });

            redirect(`/admin/customers/${params.id}`);
          }}
          style={{ display: "grid", gap: 14, padding: 22, background: "white", border: "1px solid var(--border)", borderRadius: 24, boxShadow: "var(--shadow)" }}
        >
          <label>Company name<input defaultValue={customer.companyName} name="companyName" required /></label>
          <label>Contact name<input defaultValue={customer.contactName} name="contactName" required /></label>
          <label>Email<input defaultValue={customer.email} name="email" required type="email" /></label>
          <label>Phone<input defaultValue={customer.phone ?? ""} name="phone" /></label>
          <label>Actionstep organisation<input defaultValue={customer.actionstepOrg ?? ""} name="actionstepOrg" /></label>
          <label>Status<select defaultValue={customer.status} name="status"><option>ACTIVE</option><option>PENDING</option><option>ARCHIVED</option></select></label>
          <label>Notes<textarea defaultValue={customer.notes ?? ""} name="notes" rows={5} /></label>
          <button style={{ border: 0, borderRadius: 16, padding: "14px 16px", background: "#173b63", color: "white", fontWeight: 800 }} type="submit">
            Save changes
          </button>
        </form>

        <div style={{ display: "grid", gap: 16 }}>
          <article style={{ padding: 22, background: "white", border: "1px solid var(--border)", borderRadius: 24, boxShadow: "var(--shadow)" }}>
            <h2>Booking links</h2>
            {customer.bookingLinks.map((link) => (
              <p key={link.id} style={{ marginBottom: 10 }}>
                `/book/{link.token}`
              </p>
            ))}
          </article>
          <article style={{ padding: 22, background: "white", border: "1px solid var(--border)", borderRadius: 24, boxShadow: "var(--shadow)" }}>
            <h2>Linked sessions</h2>
            {customer.sessions.map((session) => (
              <p key={session.id} style={{ marginBottom: 10 }}>
                {session.title} • {new Date(session.startsAt).toLocaleString("en-GB")}
              </p>
            ))}
          </article>
        </div>
      </section>
    </AdminShell>
  );
}
