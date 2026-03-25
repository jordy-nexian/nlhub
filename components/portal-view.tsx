import { formatDateTime } from "@/lib/format";
import styles from "./portal-view.module.css";

type PortalViewProps = {
  session: {
    title: string;
    description: string | null;
    trainerName: string;
    startsAt: Date;
    status: string;
    meetingUrl: string | null;
    customer: {
      companyName: string;
      contactName: string;
      email: string;
      notes: string | null;
    } | null;
  };
};

export function PortalView({ session }: PortalViewProps) {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.label}>Customer Portal</p>
        <h1>{session.title}</h1>
        <p>{session.description ?? "Your Actionstep training session details are confirmed below."}</p>
      </section>

      <section className={styles.grid}>
        <article className={styles.card}>
          <p className={styles.label}>Session details</p>
          <h2>{formatDateTime(session.startsAt)}</h2>
          <p>Trainer: {session.trainerName}</p>
          <p>Status: {session.status}</p>
          {session.meetingUrl ? <p>Meeting link: {session.meetingUrl}</p> : null}
        </article>

        <article className={styles.card}>
          <p className={styles.label}>Customer</p>
          <h2>{session.customer?.companyName ?? "Awaiting customer assignment"}</h2>
          <p>{session.customer?.contactName ?? "No contact assigned"}</p>
          <p>{session.customer?.email ?? "No email assigned"}</p>
          <p>{session.customer?.notes ?? "No notes added yet."}</p>
        </article>
      </section>
    </main>
  );
}
