import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { prisma } from "@/lib/prisma";
import { ensureAppData } from "@/lib/bootstrap";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await ensureAppData();
  const settings = await prisma.appSetting.findMany({
    where: {
      key: {
        in: [
          "booking_webhook_url",
          "meeting_webhook_url",
          "attendee_webhook_url",
          "attendance_webhook_url"
        ]
      }
    }
  });
  const values = Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));

  return (
    <AdminShell current="/admin/settings" subtitle="Configure downstream automation such as invite or notification webhooks." title="Settings">
      <form
        action={async (formData) => {
          "use server";
          const entries = [
            ["booking_webhook_url", String(formData.get("bookingWebhookUrl") || "")],
            ["meeting_webhook_url", String(formData.get("meetingWebhookUrl") || "")],
            ["attendee_webhook_url", String(formData.get("attendeeWebhookUrl") || "")],
            ["attendance_webhook_url", String(formData.get("attendanceWebhookUrl") || "")]
          ] as const;

          await Promise.all(
            entries.map(([key, value]) =>
              prisma.appSetting.upsert({
                where: { key },
                update: { value },
                create: { key, value }
              })
            )
          );

          redirect("/admin/settings");
        }}
        style={{ display: "grid", gap: 14, maxWidth: 760, padding: 22, background: "white", border: "1px solid var(--border)", borderRadius: 24, boxShadow: "var(--shadow)" }}
      >
        <label>Booking webhook URL<input defaultValue={values.booking_webhook_url ?? ""} name="bookingWebhookUrl" placeholder="https://n8n.yourdomain/webhook/booking-events" /></label>
        <label>Meeting creation webhook URL<input defaultValue={values.meeting_webhook_url ?? ""} name="meetingWebhookUrl" placeholder="https://n8n.yourdomain/webhook/meeting-create" /></label>
        <label>Attendee update webhook URL<input defaultValue={values.attendee_webhook_url ?? ""} name="attendeeWebhookUrl" placeholder="https://n8n.yourdomain/webhook/attendee-updates" /></label>
        <label>Attendance sync webhook URL<input defaultValue={values.attendance_webhook_url ?? ""} name="attendanceWebhookUrl" placeholder="https://n8n.yourdomain/webhook/attendance-sync" /></label>
        <button style={{ border: 0, borderRadius: 16, padding: "14px 16px", background: "#173b63", color: "white", fontWeight: 800 }} type="submit">
          Save webhooks
        </button>
      </form>
    </AdminShell>
  );
}
