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
  const trainingOpen =
    current === "/admin/customers" ||
    current === "/admin/customers/new" ||
    current === "/admin/sessions" ||
    current === "/admin/sessions/new" ||
    current === "/admin/registrations";

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          Nexian Legal Hub
          <span>Operations Workspace</span>
        </div>

        <nav className={styles.nav}>
          <div className={styles.section}>
            <p className={styles.sectionLabel}>Overview</p>
            <Link className={current === "/admin" ? styles.navActive : ""} href="/admin">
              Hub dashboard
            </Link>
          </div>

          <div className={styles.section}>
            <p className={styles.sectionLabel}>Operations</p>
            <Link className={current === "/admin/resourcing" ? styles.navActive : ""} href="/admin/resourcing">
              Resourcing calendar
            </Link>
            <Link
              className={current === "/admin/technology-requests" ? styles.navActive : ""}
              href="/admin/technology-requests"
            >
              Technology requests
            </Link>
            <Link className={current === "/admin/settings" ? styles.navActive : ""} href="/admin/settings">
              Hub settings
            </Link>
          </div>

          <div className={styles.section}>
            <p className={styles.sectionLabel}>Training</p>
            <div className={trainingOpen ? styles.submenuOpen : styles.submenu}>
              <Link className={current === "/admin/customers" ? styles.subnavActive : styles.subnav} href="/admin/customers">
                Customers
              </Link>
              <Link
                className={current === "/admin/customers/new" ? styles.subnavActive : styles.subnav}
                href="/admin/customers/new"
              >
                New customer
              </Link>
              <Link className={current === "/admin/sessions" ? styles.subnavActive : styles.subnav} href="/admin/sessions">
                Sessions
              </Link>
              <Link
                className={current === "/admin/sessions/new" ? styles.subnavActive : styles.subnav}
                href="/admin/sessions/new"
              >
                New session
              </Link>
              <Link
                className={current === "/admin/registrations" ? styles.subnavActive : styles.subnav}
                href="/admin/registrations"
              >
                Registrations
              </Link>
            </div>
          </div>

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
