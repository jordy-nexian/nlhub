import { prisma } from "@/lib/prisma";
import { ensureAppData } from "@/lib/bootstrap";

export async function getWebhookUrl() {
  await ensureAppData();
  const setting = await prisma.appSetting.findUnique({
    where: { key: "booking_webhook_url" }
  });

  return setting?.value || process.env.N8N_BOOKING_WEBHOOK_URL || "";
}

export async function sendWebhook(event: string, payload: Record<string, unknown>) {
  const url = await getWebhookUrl();

  if (!url) {
    return;
  }

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, ...payload }),
    cache: "no-store"
  });
}
