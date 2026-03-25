import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAppData } from "@/lib/bootstrap";

export async function GET() {
  await ensureAppData();
  const customers = await prisma.customer.findMany({
    orderBy: { companyName: "asc" }
  });

  return NextResponse.json({ customers });
}

export async function POST(request: Request) {
  await ensureAppData();
  const payload = (await request.json()) as Record<string, string>;
  const customer = await prisma.customer.create({
    data: {
      companyName: payload.companyName,
      contactName: payload.contactName,
      email: payload.email,
      phone: payload.phone || null,
      actionstepOrg: payload.actionstepOrg || null,
      notes: payload.notes || null
    }
  });

  return NextResponse.json({ customer }, { status: 201 });
}
