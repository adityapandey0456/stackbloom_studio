import { randomUUID } from "node:crypto";
import { notifyNewEnquiry } from "@/lib/email";
import { getDatabase } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const services = [
  "Website development",
  "Website fixes",
  "Data dashboard",
  "Automation",
  "Other",
];

export async function POST(request: Request) {
  let body: unknown;

  try {
    const text = await request.text();

    if (text.length > 15000) {
      return Response.json(
        { error: "Your message is too long." },
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
      { error: "Invalid form data." },
      { status: 400 }
    );
  }

  const values = body as Record<string, unknown>;

  function read(key: string): string {
    const value = values[key];
    return typeof value === "string" ? value.trim() : "";
  }

  if (read("website")) {
    return Response.json(
      { error: "Unable to accept this submission." },
      { status: 400 }
    );
  }

  const name = read("name");
  const email = read("email");
  const service = read("service");
  const message = read("message");

  if (
    name.length < 2 ||
    name.length > 100 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !services.includes(service) ||
    message.length < 20 ||
    message.length > 5000 ||
    values.consent !== true
  ) {
    return Response.json(
      {
        error: "Please check all fields and accept the contact consent.",
      },
      { status: 400 }
    );
  }

  const enquiry = {
    id: randomUUID(),
    name,
    email,
    service,
    message,
    consent: true,
    status: "New",
    createdAt: new Date().toISOString(),
  };

  try {
    const { error } = await getDatabase()
      .from("studio_enquiries")
      .insert({
        id: enquiry.id,
        name: enquiry.name,
        email: enquiry.email,
        service: enquiry.service,
        message: enquiry.message,
        consent: enquiry.consent,
        status: enquiry.status,
        created_at: enquiry.createdAt,
      });

    if (error) {
      console.error("SUPABASE_ENQUIRY_INSERT_ERROR", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      return Response.json(
        {
          error: "Your enquiry could not be saved. Please try again.",
        },
        { status: 500 }
      );
    }
  } catch {
    console.error("ENQUIRY_SAVE_FAILED", {
      reference: enquiry.id,
    });

    return Response.json(
      {
        error: "Your enquiry could not be saved. Please try again.",
      },
      { status: 500 }
    );
  }

  // An email failure must not mark a saved enquiry as failed.
  try {
    await notifyNewEnquiry(enquiry);
  } catch {
    console.error("ENQUIRY_NOTIFICATION_FAILED", {
      reference: enquiry.id,
    });
  }

  return Response.json(
    {
      success: true,
      reference: enquiry.id,
    },
    { status: 201 }
  );
}