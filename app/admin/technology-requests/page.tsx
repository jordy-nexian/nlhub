import { AdminShell } from "@/components/admin-shell";

export const dynamic = "force-dynamic";

const requestSections = [
  "Requester details and department",
  "Customer or internal matter reference",
  "Business reason for the change",
  "Required hardware, software, or access",
  "Preferred completion date",
  "Approval / budget owner",
  "Security or compliance considerations"
];

export default async function TechnologyRequestsPage() {
  return (
    <AdminShell
      current="/admin/technology-requests"
      subtitle="Template-driven requests your legal team can submit to Nexian Technology for new compute, access, or changes."
      title="Technology Requests"
    >
      <section style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 18 }}>
        <article style={{ padding: 22, background: "white", border: "1px solid var(--border)", borderRadius: 24, boxShadow: "var(--shadow)" }}>
          <h2>Request template</h2>
          <p style={{ color: "var(--muted)" }}>
            This starter template gives your team a structured format to send to Nexian Technology when they need new compute,
            user access, equipment, or implementation support.
          </p>

          <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
            {requestSections.map((section) => (
              <div key={section} style={{ padding: 14, borderRadius: 16, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                {section}
              </div>
            ))}
          </div>
        </article>

        <article style={{ padding: 22, background: "white", border: "1px solid var(--border)", borderRadius: 24, boxShadow: "var(--shadow)" }}>
          <h2>Submission draft</h2>
          <textarea
            defaultValue={`Subject: New technology request\n\nRequester:\nDepartment:\nMatter / client reference:\n\nRequest summary:\n\nWhat is needed:\n- \n- \n- \n\nBusiness reason:\n\nTarget delivery date:\n\nApprover:\n\nRisks / compliance notes:\n\nAdditional context:`}
            rows={18}
            style={{ minHeight: 380, resize: "vertical" }}
          />
          <div style={{ marginTop: 16, padding: 16, borderRadius: 18, background: "var(--surface-2)" }}>
            <strong>Good next enhancement</strong>
            <p style={{ color: "var(--muted)", marginBottom: 0 }}>
              We can turn this into a proper submitted form with workflow status, ownership, and n8n routing into your internal ops queue.
            </p>
          </div>
        </article>
      </section>
    </AdminShell>
  );
}
