"use client";

import { useMemo, useState, useTransition } from "react";
import { formatDateTime } from "@/lib/format";
import styles from "./public-booking.module.css";

type BookingSession = {
  id: string;
  title: string;
  trainerName: string;
  startsAt: string;
};

type PublicBookingProps = {
  token: string;
  label: string;
  companyName?: string;
  sessions: BookingSession[];
};

export function PublicBooking({ token, label, companyName, sessions }: PublicBookingProps) {
  const [selectedSessionId, setSelectedSessionId] = useState(sessions[0]?.id ?? "");
  const [companyNameState, setCompanyNameState] = useState(companyName ?? "");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("Select a session time and submit the customer details to reserve it.");
  const [isPending, startTransition] = useTransition();

  const selected = useMemo(
    () => sessions.find((session) => session.id === selectedSessionId),
    [selectedSessionId, sessions]
  );

  function submit() {
    startTransition(async () => {
      const response = await fetch(`/api/book/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: selectedSessionId,
          companyName: companyNameState,
          contactName,
          email,
          notes
        })
      });

      const payload = (await response.json()) as { message?: string; error?: string };
      setMessage(payload.message ?? payload.error ?? "Request completed.");
    });
  }

  return (
    <main className={styles.page}>
      <section className={styles.grid}>
        <aside className={styles.panel}>
          <p className={styles.eyebrow}>Nexian Training Portal</p>
          <h1>Book your Actionstep training session</h1>
          <p className={styles.copy}>
            {label}. Choose a slot, submit the attendee details, and the team can confirm the invite from the admin
            dashboard.
          </p>
          <div className={styles.pill}>60-minute remote training</div>
        </aside>

        <section className={styles.panel}>
          <h2>Available sessions</h2>
          <p className={styles.subtle}>These slots mirror the trainer schedule from the operations portal.</p>
          <div className={styles.slots}>
            {sessions.map((session) => (
              <button
                className={session.id === selectedSessionId ? styles.slotButtonActive : styles.slotButton}
                key={session.id}
                onClick={() => setSelectedSessionId(session.id)}
                type="button"
              >
                <span className={styles.slotTime}>{formatDateTime(session.startsAt)}</span>
                <span className={styles.slotMeta}>
                  {session.title} • {session.trainerName}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <h2>Your details</h2>
          <div className={styles.form}>
            <label>
              Company
              <input onChange={(event) => setCompanyNameState(event.target.value)} value={companyNameState} />
            </label>
            <label>
              Full name
              <input onChange={(event) => setContactName(event.target.value)} value={contactName} />
            </label>
            <label>
              Work email
              <input onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
            </label>
            <label>
              Notes
              <textarea onChange={(event) => setNotes(event.target.value)} rows={4} value={notes} />
            </label>
            <div className={styles.selection}>
              {selected ? `Selected: ${formatDateTime(selected.startsAt)}` : "Select a slot to continue"}
            </div>
            <button className={styles.submit} disabled={isPending || !selectedSessionId} onClick={submit} type="button">
              {isPending ? "Saving..." : "Reserve session"}
            </button>
            <div className={styles.notice}>{message}</div>
          </div>
        </section>
      </section>
    </main>
  );
}
