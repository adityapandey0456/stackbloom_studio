import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import EnquiryInbox from "@/components/admin/EnquiryInbox";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const statuses = [
  "New",
  "Contacted",
  "Quoted",
  "Won",
  "Lost",
] as const;

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

function isValidStatus(value: unknown): value is EnquiryStatusValue {
  return (
    typeof value === "string" &&
    statuses.some((status) => status === value)
  );
}

async function loadEnquiries(): Promise<Enquiry[]> {
  let content: string;

  try {
    content = await readFile(
      path.join(process.cwd(), "data", "enquiries.jsonl"),
      "utf8"
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }

  const enquiries = content
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line) as Enquiry)
    .reverse();

  return Promise.all(
    enquiries.map(async (enquiry): Promise<Enquiry> => {
      const validId =
        /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(
          enquiry.id
        );

      if (!validId) {
        throw new Error("Invalid saved enquiry ID.");
      }

      const originalStatus = isValidStatus(enquiry.status)
        ? enquiry.status
        : "New";

      let savedContent: string;

      try {
        savedContent = await readFile(
          path.join(
            process.cwd(),
            "data",
            "enquiry-status",
            `${enquiry.id}.json`
          ),
          "utf8"
        );
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
          return { ...enquiry, status: originalStatus };
        }

        throw error;
      }

      const saved: { status?: unknown } = JSON.parse(savedContent);

      if (!isValidStatus(saved.status)) {
        throw new Error("Invalid saved enquiry status.");
      }

      return { ...enquiry, status: saved.status };
    })
  );
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
            Review requests, track conversations and plan your next project.
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