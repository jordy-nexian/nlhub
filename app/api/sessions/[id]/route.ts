import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAppData } from "@/lib/bootstrap";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  await ensureAppData();
  const payload = (await request.json()) as Record<string, string>;
  const session = await prisma.trainingSession.update({
    where: { id: params.id },
    data: {
      title: payload.title || undefined,
      description: payload.description || undefined,
      trainerName: payload.trainerName || undefined,
      startsAt: payload.startsAt ? new Date(payload.startsAt) : undefined,
      endsAt: payload.endsAt ? new Date(payload.endsAt) : undefined,
      status: payload.status || undefined,
      customerId: payload.customerId || undefined,
      meetingUrl: payload.meetingUrl || undefined
    }
  });

  return NextResponse.json({ session });
}
