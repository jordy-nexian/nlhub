import { prisma } from "@/lib/prisma";

let bootstrapPromise: Promise<void> | null = null;

function iso(date: string) {
  return new Date(date).toISOString();
}

export async function ensureAppData() {
  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Customer" (
          "id" TEXT PRIMARY KEY,
          "companyName" TEXT NOT NULL,
          "contactName" TEXT NOT NULL,
          "email" TEXT NOT NULL UNIQUE,
          "phone" TEXT,
          "actionstepOrg" TEXT,
          "notes" TEXT,
          "status" TEXT NOT NULL DEFAULT 'ACTIVE',
          "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "TrainingSession" (
          "id" TEXT PRIMARY KEY,
          "title" TEXT NOT NULL,
          "description" TEXT,
          "trainerName" TEXT NOT NULL,
          "startsAt" TIMESTAMPTZ NOT NULL,
          "endsAt" TIMESTAMPTZ NOT NULL,
          "capacity" INTEGER NOT NULL DEFAULT 1,
          "seatsBooked" INTEGER NOT NULL DEFAULT 0,
          "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
          "meetingUrl" TEXT,
          "customerId" TEXT,
          "bookingToken" TEXT UNIQUE,
          "portalToken" TEXT UNIQUE,
          "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "BookingLink" (
          "id" TEXT PRIMARY KEY,
          "token" TEXT NOT NULL UNIQUE,
          "label" TEXT NOT NULL,
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "customerId" TEXT,
          "expiresAt" TIMESTAMPTZ,
          "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "AppSetting" (
          "key" TEXT PRIMARY KEY,
          "value" TEXT NOT NULL,
          "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      const customerCount = await prisma.customer.count();
      if (customerCount === 0) {
        await prisma.customer.createMany({
          data: [
            {
              id: "cust_brightwell",
              companyName: "Brightwell Legal",
              contactName: "Aimee Shaw",
              email: "aimee@brightwelllegal.com",
              actionstepOrg: "brightwell-legal",
              notes: "Conveyancing rollout and staff onboarding.",
              status: "ACTIVE"
            },
            {
              id: "cust_kingsmere",
              companyName: "Kingsmere Advisory",
              contactName: "Tom Ellis",
              email: "tom@kingsmereadvisory.co.uk",
              actionstepOrg: "kingsmere-advisory",
              notes: "Needs practice management workflow training.",
              status: "ACTIVE"
            },
            {
              id: "cust_northlane",
              companyName: "North Lane Group",
              contactName: "Priya Mehta",
              email: "priya@northlanegroup.com",
              actionstepOrg: "north-lane-group",
              notes: "Customer prefers afternoon sessions where possible.",
              status: "PENDING"
            }
          ]
        });
      }

      const sessionCount = await prisma.trainingSession.count();
      if (sessionCount === 0) {
        await prisma.trainingSession.createMany({
          data: [
            {
              id: "sess_1",
              title: "Actionstep Core Foundations",
              description: "Initial onboarding covering matters, contacts, and workflows.",
              trainerName: "Lauren Tate",
              startsAt: iso("2026-03-31T09:30:00.000Z"),
              endsAt: iso("2026-03-31T10:30:00.000Z"),
              capacity: 1,
              seatsBooked: 1,
              status: "BOOKED",
              customerId: "cust_brightwell",
              bookingToken: "brightwell-core",
              portalToken: "portal-brightwell-core",
              meetingUrl: "https://meet.google.com/example-brightwell"
            },
            {
              id: "sess_2",
              title: "Actionstep Reporting Workshop",
              description: "Dashboards, reports, and operational follow-up.",
              trainerName: "Marcus Dale",
              startsAt: iso("2026-04-01T12:00:00.000Z"),
              endsAt: iso("2026-04-01T13:00:00.000Z"),
              capacity: 1,
              seatsBooked: 1,
              status: "CONFIRMED",
              customerId: "cust_kingsmere",
              bookingToken: "kingsmere-reporting",
              portalToken: "portal-kingsmere-reporting",
              meetingUrl: "https://meet.google.com/example-kingsmere"
            },
            {
              id: "sess_3",
              title: "Actionstep Team Training",
              description: "Reserved session for reassignment or reschedule handling.",
              trainerName: "Lauren Tate",
              startsAt: iso("2026-04-02T15:00:00.000Z"),
              endsAt: iso("2026-04-02T16:00:00.000Z"),
              capacity: 1,
              seatsBooked: 0,
              status: "AVAILABLE",
              bookingToken: "open-april-slot",
              portalToken: "portal-open-april-slot",
              meetingUrl: "https://meet.google.com/example-open"
            }
          ]
        });
      }

      const bookingLinkCount = await prisma.bookingLink.count();
      if (bookingLinkCount === 0) {
        await prisma.bookingLink.createMany({
          data: [
            {
              id: "link_1",
              token: "brightwell-core",
              label: "Brightwell onboarding invite",
              customerId: "cust_brightwell",
              isActive: true
            },
            {
              id: "link_2",
              token: "kingsmere-reporting",
              label: "Kingsmere reporting invite",
              customerId: "cust_kingsmere",
              isActive: true
            },
            {
              id: "link_3",
              token: "open-april-slot",
              label: "General booking link",
              isActive: true
            }
          ]
        });
      }

      await prisma.appSetting.upsert({
        where: { key: "booking_webhook_url" },
        update: {},
        create: {
          key: "booking_webhook_url",
          value: process.env.N8N_BOOKING_WEBHOOK_URL ?? ""
        }
      });
    })();
  }

  await bootstrapPromise;
}
