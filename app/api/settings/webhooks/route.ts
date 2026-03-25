import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAppData } from "@/lib/bootstrap";

export async function GET() {
  await ensureAppData();
  const setting = await prisma.appSetting.findUnique({
    where: { key: "booking_webhook_url" }
  });

  return NextResponse.json({ bookingWebhookUrl: setting?.value ?? "" });
}

export async function PATCH(request: Request) {
  await ensureAppData();
  const payload = (await request.json()) as { bookingWebhookUrl?: string };
  const setting = await prisma.appSetting.upsert({
    where: { key: "booking_webhook_url" },
    update: { value: payload.bookingWebhookUrl ?? "" },
    create: { key: "booking_webhook_url", value: payload.bookingWebhookUrl ?? "" }
  });

  return NextResponse.json({ bookingWebhookUrl: setting.value });
}
