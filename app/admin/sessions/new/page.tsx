import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { prisma } from "@/lib/prisma";
import { ensureAppData } from "@/lib/bootstrap";
import { sendWebhook } from "@/lib/webhooks";

export const dynamic = "force-dynamic";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default async function NewSessionPage() {
  await ensureAppData();
  const customers = await prisma.customer.findMany({ orderBy: { companyName: "asc" } });

  return (
    <AdminShell current="/admin/sessions/new" subtitle="Create a trainer slot or assign one directly to a customer." title="New session">
      <form
        action={async (formData) => {
          "use server";
          const title = String(formData.get("title") || "");
          const tokenBase = slugify(title || crypto.randomUUID());

          const session = await prisma.trainingSession.create({
            data: {
              title,
              description: String(formData.get("description") || "") || null,
              trainerName: String(formData.get("trainerName") || ""),
              startsAt: new Date(String(formData.get("startsAt") || "")),
              endsAt: new Date(String(formData.get("endsAt") || "")),
              capacity: Number(formData.get("capacity") || 1),
              customerId: String(formData.get("customerId") || "") || null,
              status: String(formData.get("status") || "SCHEDULED"),
              meetingUrl: String(formData.get("meetingUrl") || "") || null,
              bookingToken: `${tokenBase}-${crypto.randomUUID().slice(0, 6)}`,
              portalToken: `portal-${tokenBase}-${crypto.randomUUID().slice(0, 6)}`
            },
            include: { customer: true }
          });

          const webhookResponse = (await sendWebhook("session.created", {
            session
          })) as { id?: string } | null;

          if (webhookResponse?.id) {
            await prisma.trainingSession.update({
              where: { id: session.id },
              data: { teamsMeetingID: webhookResponse.id }
            });
          }

          redirect(`/admin/sessions/${session.id}`);
        }}
        style={{ display: "grid", gap: 14, maxWidth: 760, padding: 22, background: "white", border: "1px solid var(--border)", borderRadius: 24, boxShadow: "var(--shadow)" }}
      >
        <label>Title<input name="title" required /></label>
        <label>Description<textarea name="description" rows={4} /></label>
        <label>Trainer name<input defaultValue="Lauren Tate" name="trainerName" required /></label>
        <label>Starts at<input name="startsAt" required type="datetime-local" /></label>
        <label>Ends at<input name="endsAt" required type="datetime-local" /></label>
        <label>Capacity<input defaultValue="1" min="1" name="capacity" type="number" /></label>
        <label>Status<select defaultValue="SCHEDULED" name="status"><option>SCHEDULED</option><option>AVAILABLE</option><option>CONFIRMED</option><option>BOOKED</option><option>COMPLETED</option></select></label>
        <label>Customer<select defaultValue="" name="customerId"><option value="">Unassigned</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.companyName}</option>)}</select></label>
        <label>Meeting URL<input name="meetingUrl" /></label>
        <button style={{ border: 0, borderRadius: 16, padding: "14px 16px", background: "#173b63", color: "white", fontWeight: 800 }} type="submit">
          Create session
        </button>
      </form>
    </AdminShell>
  );
}
