import { isAdmin } from "@/lib/auth";
import { getDatabase } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const statuses = ["New", "Contacted", "Quoted", "Won", "Lost"];

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return Response.json(
      { error: "Please log in again." },
      { status: 401 }
    );
  }

  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json(
      { error: "Request not allowed." },
      { status: 403 }
    );
  }

  let body: unknown;

  try {
    const text = await request.text();

    if (text.length > 1000) {
      return Response.json(
        { error: "Request too large." },
        { status: 413 }
      );
    }

    body = JSON.parse(text);
  } catch {
    return Response.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }

  const { id, status } = body as Record<string, unknown>;

  if (
    typeof id !== "string" ||
    !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id) ||
    typeof status !== "string" ||
    !statuses.includes(status)
  ) {
    return Response.json(
      { error: "Invalid enquiry or status." },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await getDatabase()
      .from("studio_enquiries")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      throw new Error(`Database update failed: ${error.code}`);
    }

    if (!data) {
      return Response.json(
        { error: "Enquiry not found." },
        { status: 404 }
      );
    }

    return Response.json({ success: true, status });
  } catch {
    console.error("Enquiry status update failed.");

    return Response.json(
      { error: "Could not save the status. Please try again." },
      { status: 500 }
    );
  }
}