import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <Link
          href="/admin"
          className="logo"
          aria-label="StackBloom Studio admin dashboard"
        >
          StackBloom<span>.</span>
          <small className="brand-studio">Admin</small>
        </Link>

        <nav
          className="admin-actions"
          aria-label="Admin navigation"
        >
          <Link href="/admin">Enquiries</Link>

          <Link href="/admin/projects">
            Manage projects
          </Link>

          <Link href="/" target="_blank" rel="noopener noreferrer">
            View website ↗
          </Link>

          <form action="/api/auth/logout" method="post">
            <button type="submit">Log out</button>
          </form>
        </nav>
      </header>

      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}