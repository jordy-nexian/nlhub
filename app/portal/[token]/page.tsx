import { notFound } from "next/navigation";
import { PortalView } from "@/components/portal-view";
import { getPortalContext } from "@/lib/portal-data";

export const dynamic = "force-dynamic";

export default async function PortalPage({ params }: { params: { token: string } }) {
  const session = await getPortalContext(params.token);
  if (!session) {
    notFound();
  }

  return <PortalView session={session} />;
}
