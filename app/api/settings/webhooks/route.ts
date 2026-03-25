import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAppData } from "@/lib/bootstrap";

export async function GET() {
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

  return NextResponse.json({
    bookingWebhookUrl: values.booking_webhook_url ?? "",
    meetingWebhookUrl: values.meeting_webhook_url ?? "",
    attendeeWebhookUrl: values.attendee_webhook_url ?? "",
    attendanceWebhookUrl: values.attendance_webhook_url ?? ""
  });
}

export async function PATCH(request: Request) {
  await ensureAppData();
  const payload = (await request.json()) as {
    bookingWebhookUrl?: string;
    meetingWebhookUrl?: string;
    attendeeWebhookUrl?: string;
    attendanceWebhookUrl?: string;
  };
  const entries = [
    ["booking_webhook_url", payload.bookingWebhookUrl ?? ""],
    ["meeting_webhook_url", payload.meetingWebhookUrl ?? ""],
    ["attendee_webhook_url", payload.attendeeWebhookUrl ?? ""],
    ["attendance_webhook_url", payload.attendanceWebhookUrl ?? ""]
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

  return NextResponse.json({
    bookingWebhookUrl: payload.bookingWebhookUrl ?? "",
    meetingWebhookUrl: payload.meetingWebhookUrl ?? "",
    attendeeWebhookUrl: payload.attendeeWebhookUrl ?? "",
    attendanceWebhookUrl: payload.attendanceWebhookUrl ?? ""
  });
}
