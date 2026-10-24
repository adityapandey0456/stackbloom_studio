import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getDatabase } from "@/lib/supabase-admin";
import EnquiryInbox from "@/components/admin/EnquiryInbox";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const statuses = ["New", "Contacted", "Quoted", "Won", "Lost"] as const;

type EnquiryStatusValue = (typeof statuses)[number];

type Enquiry = {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  status: EnquiryStatusValue;
  createdAt: string;
};

async function loadEnquiries(): Promise<Enquiry[]> {
  const { data, error } = await getDatabase()
    .from("studio_enquiries")
    .select("id,name,email,service,message,status,created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    throw new Error(`Could not load enquiries: ${error.code}`);
  }

  return (data ?? []).map((row) => {
    const status = statuses.find((value) => value === row.status);

    if (!status) {
      throw new Error("Invalid enquiry status.");
    }

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      service: row.service,
      message: row.message,
      status,
      createdAt: row.created_at,
    };
  });
}

export default async function AdminDashboard() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  const enquiries = await loadEnquiries();

  return (
    <>
      <div className="inbox-heading">
        <div>
          <p className="eyebrow">STACKBLOOM STUDIO / WORKSPACE</p>

          <h1 className="admin-title">Your project inbox.</h1>

          <p className="admin-summary">
            Review your latest 500 requests, track conversations
            and plan your next project.
          </p>
        </div>

        <Link
          href="/admin/projects"
          className="button button-primary"
        >
          Manage portfolio ↗
        </Link>
      </div>

      <EnquiryInbox enquiries={enquiries} />
    </>
  );
}