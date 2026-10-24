import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { notifyNewEnquiry } from "@/lib/email";

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
    const folder = path.join(process.cwd(), "data");

    await mkdir(folder, { recursive: true });

    await appendFile(
      path.join(folder, "enquiries.jsonl"),
      JSON.stringify(enquiry) + "\n",
      "utf8"
    );
    await notifyNewEnquiry(enquiry);

    return Response.json(
      { success: true, reference: enquiry.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Enquiry could not be saved:", error);

    return Response.json(
      { error: "Your enquiry could not be saved. Please try again." },
      { status: 500 }
    );
  }
}