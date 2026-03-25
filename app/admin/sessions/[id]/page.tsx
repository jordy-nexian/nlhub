import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { prisma } from "@/lib/prisma";
import { ensureAppData } from "@/lib/bootstrap";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

function inputValue(date: Date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export default async function SessionDetailPage({ params }: { params: { id: string } }) {
  await ensureAppData();
  const [session, customers] = await Promise.all([
    prisma.trainingSession.findUnique({
      where: { id: params.id },
      include: { customer: true }
    }),
    prisma.customer.findMany({ orderBy: { companyName: "asc" } })
  ]);

  if (!session) {
    notFound();
  }

  return (
    <AdminShell current="/admin/sessions" subtitle="Update timing, ownership, and booking tokens for this session." title={session.title}>
      <section style={{ display: "grid", gridTemplateColumns: "1fr 0.9fr", gap: 18 }}>
        <form
          action={async (formData) => {
            "use server";
            await prisma.trainingSession.update({
              where: { id: params.id },
              data: {
                title: String(formData.get("title") || ""),
                description: String(formData.get("description") || "") || null,
                trainerName: String(formData.get("trainerName") || ""),
                startsAt: new Date(String(formData.get("startsAt") || "")),
                endsAt: new Date(String(formData.get("endsAt") || "")),
                status: String(formData.get("status") || "SCHEDULED"),
                customerId: String(formData.get("customerId") || "") || null,
                meetingUrl: String(formData.get("meetingUrl") || "") || null
              }
            });

            redirect(`/admin/sessions/${params.id}`);
          }}
          style={{ display: "grid", gap: 14, padding: 22, background: "white", border: "1px solid var(--border)", borderRadius: 24, boxShadow: "var(--shadow)" }}
        >
          <label>Title<input defaultValue={session.title} name="title" required /></label>
          <label>Description<textarea defaultValue={session.description ?? ""} name="description" rows={4} /></label>
          <label>Trainer name<input defaultValue={session.trainerName} name="trainerName" required /></label>
          <label>Starts at<input defaultValue={inputValue(session.startsAt)} name="startsAt" required type="datetime-local" /></label>
          <label>Ends at<input defaultValue={inputValue(session.endsAt)} name="endsAt" required type="datetime-local" /></label>
          <label>Status<select defaultValue={session.status} name="status"><option>SCHEDULED</option><option>AVAILABLE</option><option>CONFIRMED</option><option>BOOKED</option><option>COMPLETED</option></select></label>
          <label>Customer<select defaultValue={session.customerId ?? ""} name="customerId"><option value="">Unassigned</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.companyName}</option>)}</select></label>
          <label>Meeting URL<input defaultValue={session.meetingUrl ?? ""} name="meetingUrl" /></label>
          <button style={{ border: 0, borderRadius: 16, padding: "14px 16px", background: "#173b63", color: "white", fontWeight: 800 }} type="submit">
            Save session
          </button>
        </form>

        <div style={{ display: "grid", gap: 16 }}>
          <article style={{ padding: 22, background: "white", border: "1px solid var(--border)", borderRadius: 24, boxShadow: "var(--shadow)" }}>
            <h2>Links</h2>
            <p>Booking: `/book/{session.bookingToken}`</p>
            <p>Portal: `/portal/{session.portalToken}`</p>
          </article>
          <article style={{ padding: 22, background: "white", border: "1px solid var(--border)", borderRadius: 24, boxShadow: "var(--shadow)" }}>
            <h2>Session summary</h2>
            <p>{formatDateTime(session.startsAt)}</p>
            <p>{session.customer?.companyName ?? "No customer assigned"}</p>
            <p>{session.status}</p>
            <p>{session.teamsMeetingID ?? "No Teams meeting linked yet"}</p>
          </article>
        </div>
      </section>
    </AdminShell>
  );
}
