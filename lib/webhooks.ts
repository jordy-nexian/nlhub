import { prisma } from "@/lib/prisma";
import { ensureAppData } from "@/lib/bootstrap";

const eventToSettingKey: Record<string, string> = {
  "booking.created": "booking_webhook_url",
  "session.created": "meeting_webhook_url",
  "attendee.updated": "attendee_webhook_url",
  "attendance.sync": "attendance_webhook_url"
};

export async function getWebhookUrl(event: string) {
  await ensureAppData();
  const key = eventToSettingKey[event] ?? "booking_webhook_url";
  const setting = await prisma.appSetting.findUnique({
    where: { key }
  });

  const envFallbacks: Record<string, string | undefined> = {
    booking_webhook_url: process.env.N8N_BOOKING_WEBHOOK_URL,
    meeting_webhook_url: process.env.N8N_MEETING_WEBHOOK_URL,
    attendee_webhook_url: process.env.N8N_ATTENDEE_WEBHOOK_URL,
    attendance_webhook_url: process.env.N8N_ATTENDANCE_WEBHOOK_URL
  };

  return setting?.value || envFallbacks[key] || "";
}

export async function sendWebhook(event: string, payload: Record<string, unknown>) {
  const url = await getWebhookUrl(event);

  if (!url) {
    return null;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, ...payload }),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Webhook request failed for ${event}: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
}
