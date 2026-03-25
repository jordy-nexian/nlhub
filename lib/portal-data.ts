import { prisma } from "@/lib/prisma";
import { ensureAppData } from "@/lib/bootstrap";

export async function getDashboardData() {
  await ensureAppData();
  const [customers, sessions, settings] = await Promise.all([
    prisma.customer.findMany({
      orderBy: { companyName: "asc" }
    }),
    prisma.trainingSession.findMany({
      include: { customer: true },
      orderBy: { startsAt: "asc" }
    }),
    prisma.appSetting.findMany()
  ]);

  return { customers, sessions, settings };
}

export async function getBookingContext(token: string) {
  await ensureAppData();
  const [link, sessions] = await Promise.all([
    prisma.bookingLink.findUnique({
      where: { token },
      include: { customer: true }
    }),
    prisma.trainingSession.findMany({
      where: {
        OR: [
          { bookingToken: token },
          { status: "AVAILABLE" }
        ]
      },
      include: { customer: true },
      orderBy: { startsAt: "asc" }
    })
  ]);

  return { link, sessions };
}

export async function getPortalContext(token: string) {
  await ensureAppData();
  return prisma.trainingSession.findFirst({
    where: { portalToken: token },
    include: { customer: true }
  });
}
