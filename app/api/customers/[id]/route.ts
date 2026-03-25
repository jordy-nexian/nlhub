import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAppData } from "@/lib/bootstrap";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await ensureAppData();
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: { sessions: true, bookingLinks: true }
  });

  return NextResponse.json({ customer });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  await ensureAppData();
  const payload = (await request.json()) as Record<string, string>;
  const customer = await prisma.customer.update({
    where: { id: params.id },
    data: {
      companyName: payload.companyName,
      contactName: payload.contactName,
      email: payload.email,
      phone: payload.phone || null,
      actionstepOrg: payload.actionstepOrg || null,
      notes: payload.notes || null,
      status: payload.status || undefined
    }
  });

  return NextResponse.json({ customer });
}
