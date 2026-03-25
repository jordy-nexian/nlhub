import { notFound } from "next/navigation";
import { PublicBooking } from "@/components/public-booking";
import { getBookingContext } from "@/lib/portal-data";

export const dynamic = "force-dynamic";

export default async function BookPage({ params }: { params: { token: string } }) {
  const { link, sessions } = await getBookingContext(params.token);

  if (!link) {
    notFound();
  }

  return (
    <PublicBooking
      companyName={link.customer?.companyName ?? undefined}
      label={link.label}
      sessions={sessions.map((session) => ({
        id: session.id,
        title: session.title,
        trainerName: session.trainerName,
        startsAt: session.startsAt.toISOString()
      }))}
      token={params.token}
    />
  );
}
