import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAppData } from "@/lib/bootstrap";
import { sendWebhook } from "@/lib/webhooks";

export async function GET(_: Request, { params }: { params: { token: string } }) {
  await ensureAppData();
  const link = await prisma.bookingLink.findUnique({
    where: { token: params.token },
    include: { customer: true }
  });

  return NextResponse.json({ link });
}

export async function POST(request: Request, { params }: { params: { token: string } }) {
  await ensureAppData();
  const payload = (await request.json()) as {
    sessionId: string;
    companyName: string;
    contactName: string;
    email: string;
    notes?: string;
  };

  const link = await prisma.bookingLink.findUnique({
    where: { token: params.token },
    include: { customer: true }
  });

  if (!link || !link.isActive) {
    return NextResponse.json({ error: "Booking link not found." }, { status: 404 });
  }

  let customerId = link.customerId;
  if (customerId) {
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        companyName: payload.companyName,
        contactName: payload.contactName,
        email: payload.email,
        notes: payload.notes || null
      }
    });
  } else {
    const customer = await prisma.customer.create({
      data: {
        companyName: payload.companyName,
        contactName: payload.contactName,
        email: payload.email,
        notes: payload.notes || null
      }
    });
    customerId = customer.id;
  }

  const session = await prisma.trainingSession.update({
    where: { id: payload.sessionId },
    data: {
      customerId,
      seatsBooked: 1,
      status: "BOOKED"
    },
    include: { customer: true }
  });

  await sendWebhook("booking.created", {
    token: params.token,
    sessionId: session.id,
    customer: session.customer
  });

  return NextResponse.json({
    message: `Reserved ${session.title} for ${session.customer?.companyName}.`
  });
}
