import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { prisma } from "@/lib/prisma";
import { ensureAppData } from "@/lib/bootstrap";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await ensureAppData();
  const webhook = await prisma.appSetting.findUnique({
    where: { key: "booking_webhook_url" }
  });

  return (
    <AdminShell current="/admin/settings" subtitle="Configure downstream automation such as invite or notification webhooks." title="Settings">
      <form
        action={async (formData) => {
          "use server";
          await prisma.appSetting.upsert({
            where: { key: "booking_webhook_url" },
            update: { value: String(formData.get("value") || "") },
            create: { key: "booking_webhook_url", value: String(formData.get("value") || "") }
          });

          redirect("/admin/settings");
        }}
        style={{ display: "grid", gap: 14, maxWidth: 760, padding: 22, background: "white", border: "1px solid var(--border)", borderRadius: 24, boxShadow: "var(--shadow)" }}
      >
        <label>Booking webhook URL<input defaultValue={webhook?.value ?? ""} name="value" placeholder="https://n8n.yourdomain/webhook/..." /></label>
        <button style={{ border: 0, borderRadius: 16, padding: "14px 16px", background: "#173b63", color: "white", fontWeight: 800 }} type="submit">
          Save webhook
        </button>
      </form>
    </AdminShell>
  );
}
