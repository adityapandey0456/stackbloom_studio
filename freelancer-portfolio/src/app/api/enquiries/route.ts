import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { notifyNewEnquiry } from "@/lib/email";
import { getDatabase } from "@/lib/supabase-admin";
export const runtime = "nodejs";

export async function POST(request: Request) {
  let body;

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

  if (!body || typeof body !== "object") {
    return Response.json(
      { error: "Invalid form data." },
      { status: 400 }
    );
  }

  const read = (key: string) =>
    typeof body[key] === "string" ? body[key].trim() : "";
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

  const services = [
    "Website development",
    "Website fixes",
    "Data dashboard",
    "Automation",
    "Other",
  ];

  if (
    name.length < 2 ||
    name.length > 100 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !services.includes(service) ||
    message.length < 20 ||
    message.length > 5000 ||
    body.consent !== true
  ) {
    return Response.json(
      { error: "Please check all fields and accept the contact consent." },
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
  throw new Error(`Database insert failed: ${error.code}`);
}

// Saving succeeds even if the notification email fails.
try {
  await notifyNewEnquiry(enquiry);
} catch {
  console.error("Notification failed for enquiry:", enquiry.id);
}
  } catch (error) {
    console.error("Enquiry could not be saved:", error);

    return Response.json(
      { error: "Your enquiry could not be saved. Please try again." },
      { status: 500 }
    );
  }
}