import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { prisma } from "@/lib/prisma";
import { ensureAppData } from "@/lib/bootstrap";

export const dynamic = "force-dynamic";

export default async function NewCustomerPage() {
  return (
    <AdminShell current="/admin/customers/new" subtitle="Create a customer record before sending a booking link." title="New customer">
      <form
        action={async (formData) => {
          "use server";
          await ensureAppData();
          const customer = await prisma.customer.create({
            data: {
              companyName: String(formData.get("companyName") || ""),
              contactName: String(formData.get("contactName") || ""),
              email: String(formData.get("email") || ""),
              phone: String(formData.get("phone") || "") || null,
              actionstepOrg: String(formData.get("actionstepOrg") || "") || null,
              notes: String(formData.get("notes") || "") || null
            }
          });

          redirect(`/admin/customers/${customer.id}`);
        }}
        style={{ display: "grid", gap: 14, maxWidth: 760, padding: 22, background: "white", border: "1px solid var(--border)", borderRadius: 24, boxShadow: "var(--shadow)" }}
      >
        <label>Company name<input name="companyName" required /></label>
        <label>Contact name<input name="contactName" required /></label>
        <label>Email<input name="email" required type="email" /></label>
        <label>Phone<input name="phone" /></label>
        <label>Actionstep organisation<input name="actionstepOrg" /></label>
        <label>Notes<textarea name="notes" rows={5} /></label>
        <button style={{ border: 0, borderRadius: 16, padding: "14px 16px", background: "#173b63", color: "white", fontWeight: 800 }} type="submit">
          Save customer
        </button>
      </form>
    </AdminShell>
  );
}
