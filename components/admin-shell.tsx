import Link from "next/link";
import { signOut } from "@/lib/auth";
import styles from "./admin-shell.module.css";

type AdminShellProps = {
  title: string;
  subtitle: string;
  current: string;
  children: React.ReactNode;
};

export async function AdminShell({ title, subtitle, current, children }: AdminShellProps) {
  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          Nexian Training
          <span>Actionstep Admin</span>
        </div>

        <nav className={styles.nav}>
          <Link className={current === "/admin" ? styles.navActive : ""} href="/admin">
            Dashboard
          </Link>
          <Link className={current === "/admin/customers" ? styles.navActive : ""} href="/admin/customers">
            Customers
          </Link>
          <Link className={current === "/admin/customers/new" ? styles.navActive : ""} href="/admin/customers/new">
            New customer
          </Link>
          <Link className={current === "/admin/sessions" ? styles.navActive : ""} href="/admin/sessions">
            Sessions
          </Link>
          <Link className={current === "/admin/sessions/new" ? styles.navActive : ""} href="/admin/sessions/new">
            New session
          </Link>
          <Link className={current === "/admin/registrations" ? styles.navActive : ""} href="/admin/registrations">
            Registrations
          </Link>
          <Link className={current === "/admin/settings" ? styles.navActive : ""} href="/admin/settings">
            Settings
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/auth/signin" });
            }}
          >
            <button type="submit">Sign out</button>
          </form>
        </nav>
      </aside>

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div>
            <p>Trainer operations workspace</p>
          </div>
        </header>

        <div className={styles.body}>{children}</div>
      </section>
    </main>
  );
}
