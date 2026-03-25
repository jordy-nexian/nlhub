import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAppData } from "@/lib/bootstrap";
import { sendWebhook } from "@/lib/webhooks";

export async function GET() {
  await ensureAppData();
  const sessions = await prisma.trainingSession.findMany({
    include: { customer: true },
    orderBy: { startsAt: "asc" }
  });

  return NextResponse.json({ sessions });
}

export async function POST(request: Request) {
  await ensureAppData();
  const payload = (await request.json()) as Record<string, string>;
  const session = await prisma.trainingSession.create({
    data: {
      title: payload.title,
      description: payload.description || null,
      trainerName: payload.trainerName,
      startsAt: new Date(payload.startsAt),
      endsAt: new Date(payload.endsAt),
      capacity: Number(payload.capacity || 1),
      status: payload.status || "SCHEDULED",
      customerId: payload.customerId || null,
      meetingUrl: payload.meetingUrl || null,
      bookingToken: payload.bookingToken || crypto.randomUUID(),
      portalToken: payload.portalToken || `portal-${crypto.randomUUID()}`
    },
    include: { customer: true }
  });

  const webhookResponse = (await sendWebhook("session.created", {
    session
  })) as { id?: string } | null;

  const updatedSession = webhookResponse?.id
    ? await prisma.trainingSession.update({
        where: { id: session.id },
        data: { teamsMeetingId: webhookResponse.id },
        include: { customer: true }
      })
    : session;

  return NextResponse.json({ session: updatedSession }, { status: 201 });
}
