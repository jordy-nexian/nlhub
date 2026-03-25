import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";

export default async function SignInPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/admin");
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <form
        action={async (formData) => {
          "use server";
          await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirectTo: "/admin"
          });
        }}
        style={{ width: "100%", maxWidth: 420, padding: 28, borderRadius: 28, background: "white", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
      >
        <p style={{ textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", fontWeight: 800 }}>Trainer sign in</p>
        <h1>Manage customer training</h1>
        <p style={{ color: "var(--muted)" }}>Use the trainer credentials configured in Vercel environment variables.</p>
        <div style={{ display: "grid", gap: 14 }}>
          <label>
            Email
            <input defaultValue="admin@nexian.co.uk" name="email" type="email" />
          </label>
          <label>
            Password
            <input defaultValue="ChangeMe123!" name="password" type="password" />
          </label>
          <button style={{ border: 0, borderRadius: 16, padding: "14px 16px", background: "linear-gradient(180deg, #3194e8 0%, #2367a6 100%)", color: "white", fontWeight: 800 }} type="submit">
            Sign in
          </button>
        </div>
      </form>
    </main>
  );
}
